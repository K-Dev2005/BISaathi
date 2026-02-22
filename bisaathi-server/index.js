require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ CORS — must be before ALL routes
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://bisaathi.vercel.app',
      'https://bisaathi-server.vercel.app',
    ];
    
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Handle preflight OPTIONS requests explicitly
app.options('*', cors());

app.use(express.json());

// your routes below...