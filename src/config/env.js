// src/config/env.js
import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    
    // Tokens
    // GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    // OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    
    // Database
    DATABASE_URL: process.env.DATABASE_URL,
    
    // Otros
    BOT_VERSION: '4.0.0',
};