import express from 'express';
import { PORT } from './config/dotenv';
import sequelize from './config/database';

const app = express();

sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch((err) => console.log('Error: ' + err))

// Middleware to parse JSON requests
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
