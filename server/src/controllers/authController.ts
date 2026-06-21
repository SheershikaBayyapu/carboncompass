import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({
      token: generateToken(user._id.toString()),
      user: { id: user._id, name: user.name, email: user.email, streak: user.streak, sustainabilityScore: user.sustainabilityScore }
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        token: generateToken(user._id.toString()),
        user: { id: user._id, name: user.name, email: user.email, streak: user.streak, sustainabilityScore: user.sustainabilityScore }
      });
    }
    return res.status(401).json({ message: 'Invalid credentials structural baseline' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
