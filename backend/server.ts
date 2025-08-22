import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import allRoutes from './routes/index';
import path from 'path';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing
app.use(cors());
// Parse JSON request bodies
app.use(express.json());
// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: false }));


// --- API Routes ---
// Use the aggregated routes from the /routes directory
app.use('/api', allRoutes);

// --- Server Initialization ---
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
