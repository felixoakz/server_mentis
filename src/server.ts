import express from 'express';
import { PORT } from './config/dotenv';
import authRoutes from './routes/auth';
import authMiddleware from './middleware/auth';

const app = express();

app.use(express.json()); // Parse incoming JSON


// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


app.use('/auth', authRoutes);

// Protected route example
app.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Access granted to protected route' });
});

