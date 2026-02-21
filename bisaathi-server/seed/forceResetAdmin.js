require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const forceResetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    const email = 'admin@bis.gov.in';
    const password = 'admin123';

    // Delete existing admin to be sure
    await Admin.deleteOne({ email });
    console.log('Old admin deleted');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({
      name: 'BIS Officer',
      email: email,
      password: hashedPassword
    });

    await admin.save();
    console.log('Admin forced reset successful');
    console.log('Email:', email);
    console.log('Password:', password);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

forceResetAdmin();
