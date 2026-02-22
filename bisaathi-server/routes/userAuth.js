const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../lib/supabase');
const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign(
      { id: user.id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, score: user.score } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, score: user.score, badges: user.badges, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET PROFILE
router.get('/me', require('../middleware/userAuthMiddleware'), async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, score, scans, violations_caught, complaints_filed, complaints_verified, badges, missions_done, pending_notifications, role, created_at')
      .eq('id', req.user.id)
      .single();

    if (error || !user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE PROFILE (score, badges, missions)
router.patch('/me', require('../middleware/userAuthMiddleware'), async (req, res) => {
  try {
    const { score, badges, missions_done, scans, violations_caught, complaints_filed, pending_notifications } = req.body;

    const updates = {};
    if (score !== undefined) updates.score = score;
    if (badges !== undefined) updates.badges = badges;
    if (missions_done !== undefined) updates.missions_done = missions_done;
    if (scans !== undefined) updates.scans = scans;
    if (violations_caught !== undefined) updates.violations_caught = violations_caught;
    if (complaints_filed !== undefined) updates.complaints_filed = complaints_filed;
    if (pending_notifications !== undefined) updates.pending_notifications = pending_notifications;

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
