import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';
import { UserModel } from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are reqiured' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be al least 6 characters' });
    }

    // check if email is valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await UserModel.findByEmail(email);
    if (user) return res.status(400).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create(name, email, hashedPassword);

    if (newUser) {
      // generateToken(newUser.id, res);
      res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar_url: newUser.avatar_url,
      });

      // try {
      //   await sendWelcomeEmail(
      //     savedUser.email,
      //     savedUser.fullName,
      //     ENV.CLIENT_URL
      //   );
      // } catch (error) {
      //   console.error('Error sending welcome email: ', error);
      // }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log('Error in signup controller: ', error);
    res.status(500).json({ message: 'Internal server error: ' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'Invalid credentails' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(404).json({ message: 'Invalid credentails' });

    generateToken(user.id, res);

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
    });
  } catch (error) {
    console.error('Error in login controller: ', error);
    res.status(500).json({ message: 'Internals server error' });
  }
};

export const logout = async (_, res) => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const updateProfile = async (req, res) => {
  try {
    const { avatar_url } = req.body;
    if (!avatar_url)
      return res.status(400).json({ message: 'Profile pic is required' });

    const userId = req.user.id;

    const uploadResponse = await cloudinary.uploader.upload(avatar_url, {
      folder: 'avatars',
    });

    const updatedUser = await UserModel.updateAvatar(
      userId,
      uploadResponse.secure_url
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in update profile: ', error);
    res.status(500).json({ message: 'Internals server error' });
  }
};
