import express from 'express';
import {
  login,
  logout,
  register,
  updateProfile,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.use(protectRoute);

router.post('/logout', logout);
router.put('/update-profile', updateProfile);

router.get('/check', protectRoute, (req, res) =>
  res.status(200).json(req.user)
);

export default router;
