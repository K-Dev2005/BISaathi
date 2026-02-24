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
      process.env.CLIENT_URL || 'https://bisaathi.vercel.app',
    ];
    
    // Allow all vercel.app domains in production, localhost in dev
    const isAllowed = allowedOrigins.includes(origin) || 
                     origin.endsWith('.vercel.app') || 
                     origin.startsWith('http://localhost');
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
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