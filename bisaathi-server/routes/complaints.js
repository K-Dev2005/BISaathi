const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuthMiddleware');

// Submit new complaint (Public or Logged-in)
router.post('/', async (req, res) => {
  try {
    const { cml_code, product_name, issue_type, complaint_text, latitude, longitude, location_label, user_id } = req.body;
    
    const complaint = new Complaint({
      cml_code,
      product_name,
      issue_type,
      complaint_text,
      latitude,
      longitude,
      location_label,
      user_id: user_id || null
    });

    await complaint.save();

    if (user_id) {
      await User.findByIdAndUpdate(user_id, { $inc: { complaints_filed: 1 } });
    }

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all complaints
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, issue_type, has_user } = req.query;
    console.log('--- ADMIN FETCH COMPLAINTS ---');
    console.log('Query Params:', req.query);
    
    let query = {};
    if (status && status !== 'All') query.status = status;
    if (issue_type && issue_type !== 'All') query.issue_type = issue_type;
    if (has_user === 'Logged-in user') query.user_id = { $ne: null };
    if (has_user === 'Anonymous') query.user_id = null;

    const complaints = await Complaint.find(query).sort({ submitted_at: -1 }).populate('user_id', 'name email score');
    console.log('Count Found:', complaints.length);
    console.log('------------------------------');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'pending' });
    const reviewing = await Complaint.countDocuments({ status: 'reviewing' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });
    const rejected = await Complaint.countDocuments({ status: 'rejected' });

    const statsByType = await Complaint.aggregate([
      { $group: { _id: '$issue_type', count: { $sum: 1 } } }
    ]);

    res.json({ total, pending, reviewing, resolved, rejected, statsByType });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get by day (last 7 days)
router.get('/by-day', adminAuth, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const statsByDay = await Complaint.aggregate([
      { $match: { submitted_at: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$submitted_at" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(statsByDay);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Top Validators
router.get('/top-validators', adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ score: -1 }).limit(5).select('name score role scans complaints_filed complaints_verified');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get single complaint
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user_id', 'name email score role');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update status + award points
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const { status, admin_notes } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const oldStatus = complaint.status;
    complaint.status = status;
    if (admin_notes) complaint.admin_notes = admin_notes;

    if (status === 'resolved' && oldStatus !== 'resolved' && complaint.user_id && !complaint.points_awarded) {
      // Award 100 bonus points
      const user = await User.findById(complaint.user_id);
      if (user) {
        user.score += 100;
        user.complaints_verified += 1;
        user.pending_notifications.push({
          message: `🌟 BIS verified your complaint about ${complaint.product_name} — you earned +100 pts!`,
          points: 100
        });
        await user.save();
        complaint.points_awarded = true;
      }
    }

    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
