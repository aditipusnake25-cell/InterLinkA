const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(userId) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing from backend/.env.');
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilePicture: user.profilePicture
  };
}

async function register(req, res, next) {
  try {
    const { name, username, email, password } = req.body;
    if (![name, username, email, password].every(value => typeof value === 'string' && value.trim())) {
      return res.status(400).json({ message: 'Name, username, email, and password are required.' });
    }
    if (password.length < 8) return res.status(400).json({ message: 'Use a password with at least 8 characters.' });
    if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
      return res.status(400).json({ message: 'Username must be 3–24 letters, numbers, or underscores.' });
    }
    const existing = await User.findOne({ $or: [{ email: email.toLowerCase().trim() }, { username: username.toLowerCase().trim() }] });
    if (existing) return res.status(409).json({ message: 'That email or username is already in use.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: passwordHash
    });
    return res.status(201).json({ token: createToken(user._id.toString()), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Enter your email and password.' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }
    return res.json({ token: createToken(user._id.toString()), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Account not found.' });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login, me, publicUser };
