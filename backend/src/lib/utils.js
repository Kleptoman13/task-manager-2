import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (userId) => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  const token = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '7d',
  });

  return token;
};
