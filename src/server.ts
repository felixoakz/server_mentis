import express from 'express';
import { PORT } from './config/dotenv';
import authRoutes from './routes/auth';
import authMiddleware from './middleware/auth';
import cors from 'cors'

const app = express();

app.use(express.json()); // Parse incoming JSON

app.use(
  cors({
    origin: 'http://localhost:3000', // Replace with your React app URL
    credentials: true, // Allow cookies if required
  })
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


app.use('/auth', authRoutes);

// Protected route example
app.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Access granted to protected route' });
});

