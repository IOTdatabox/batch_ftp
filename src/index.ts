import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes';
import path from 'path';
import { IBatchType } from './types/batch.type';
import { SIGNUP_TRACK } from './enums/track.enum';
import { generateCSV } from './services/signup.service';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT as string) || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

const publicPath = path.join(__dirname, '../');
// Serve static files from public directory
app.use(express.static(publicPath));

app.use('/api', router);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
