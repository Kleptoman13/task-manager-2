import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserModel } from '../models/user.model.js';

dotenv.config();

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: 'Unauthorized - No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!decoded)
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });

    const user = await UserModel.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: 'User no found' });

    req.user = user;
    next();
  } catch (error) {
    console.log('Error in protectRoute middleware: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
