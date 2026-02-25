import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = async () => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  const token = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // Prevent XSS attacks: cross-site scripting
    sameSite: 'strict', // CSRF attacks
    secure: false,
  });

  return token;
};
