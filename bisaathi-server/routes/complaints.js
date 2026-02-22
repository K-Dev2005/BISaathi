const express = require('express');
const supabase = require('../lib/supabase');
const adminAuth = require('../middleware/adminAuthMiddleware');
const router = express.Router();

// SUBMIT COMPLAINT (public)
router.post('/', async (req, res) => {
  try {
    const { cml_code, product_name, issue_type, complaint_text, latitude, longitude, location_label, user_id } = req.body;

    const { data, error } = await supabase
      .from('complaints')
      .insert([{ cml_code, product_name, issue_type, complaint_text, latitude, longitude, location_label, user_id: user_id || null }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL COMPLAINTS (admin, with filters + pagination)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, issue_type, search, page = 1, limit = 10, from_date, to_date } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('complaints')
      .select('*, users(name, email, score, role)', { count: 'exact' })
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') query = query.eq('status', status);
    if (issue_type && issue_type !== 'all') query = query.eq('issue_type', issue_type);
    if (search) query = query.or(`cml_code.ilike.%${search}%,product_name.ilike.%${search}%`);
    if (from_date) query = query.gte('submitted_at', from_date);
    if (to_date) query = query.lte('submitted_at', to_date);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ complaints: data, total: count, page: Number(page), pages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET STATS (admin dashboard cards)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const { count: total } = await supabase.from('complaints').select('*', { count: 'exact', head: true });
    const { count: pending } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { count: reviewing } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'reviewing');
    const { count: resolved } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'resolved');
    const { count: rejected } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'rejected');

    // Count by issue type
    const { data: byType } = await supabase.from('complaints').select('issue_type');
    const issueTypeCounts = byType.reduce((acc, c) => {
      acc[c.issue_type] = (acc[c.issue_type] || 0) + 1;
      return acc;
    }, {});

    // Total points awarded
    const { count: pointsAwarded } = await supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('points_awarded', true);

    res.json({ total, pending, reviewing, resolved, rejected, issueTypeCounts, pointsAwarded, pointsTotal: pointsAwarded * 100 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET COMPLAINTS BY DAY — last 7 days (admin line chart)
router.get('/by-day', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('submitted_at')
      .gte('submitted_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const days = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days[key] = 0;
    }

    data.forEach(c => {
      const key = c.submitted_at.split('T')[0];
      if (days[key] !== undefined) days[key]++;
    });

    res.json(Object.entries(days).map(([date, count]) => ({ date, count })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET TOP VALIDATORS (admin dashboard)
router.get('/top-validators', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, score, role, scans, complaints_filed, complaints_verified')
      .order('score', { ascending: false })
      .limit(5);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SINGLE COMPLAINT (admin)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*, users(id, name, email, score, role)')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ message: 'Complaint not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE COMPLAINT STATUS + ADMIN NOTES (admin)
// Auto-awards +100 pts if resolved and user exists
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const { status, admin_notes } = req.body;

    const { data: complaint, error: fetchError } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !complaint) return res.status(404).json({ message: 'Complaint not found' });

    const updates = {};
    if (status) updates.status = status;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;

    // Auto-award +100 pts if resolving and not already awarded
    let pointsAwarded = false;
    if (status === 'resolved' && !complaint.points_awarded && complaint.user_id) {

      // Get current user score
      const { data: user } = await supabase
        .from('users')
        .select('score, complaints_verified, pending_notifications')
        .eq('id', complaint.user_id)
        .single();

      if (user) {
        const newNotification = {
          message: `Your complaint about ${complaint.product_name} was verified by BIS!`,
          points: 100,
          seen: false,
          created_at: new Date().toISOString()
        };

        await supabase
          .from('users')
          .update({
            score: user.score + 100,
            complaints_verified: user.complaints_verified + 1,
            pending_notifications: [...(user.pending_notifications || []), newNotification]
          })
          .eq('id', complaint.user_id);

        updates.points_awarded = true;
        pointsAwarded = true;
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from('complaints')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ complaint: updated, pointsAwarded, message: pointsAwarded ? `+100 pts awarded to user` : 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
