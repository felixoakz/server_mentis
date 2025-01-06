import express, { Request, Response } from 'express';
import User from '../models/user';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = User.hashPassword(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created successfully!', user });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.validatePassword(password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = user.generateAuthToken(); // Generate JWT

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  }
});


export default router;
