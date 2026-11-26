const User = require('../models/User');
const Follow = require('../models/Follow');
const Notification = require('../models/Notification');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

async function listUsers(req, res, next) {
  try {
    const query = String(req.query.q || '').trim();
    const filter = { _id: { $ne: req.userId } };
    if (query) filter.$or = [
      { username: { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
      { name: { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
    ];
    const users = await User.find(filter).select('name username bio profilePicture').sort({ createdAt: -1 }).limit(24);
    const follows = await Follow.find({ follower: req.userId }).select('following');
    const followedIds = new Set(follows.map(item => String(item.following)));
    return res.json({ users: users.map(user => ({ ...user.toObject(), id: user._id, isFollowing: followedIds.has(String(user._id)) })) });
  } catch (error) {
    return next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('name username bio profilePicture createdAt');
    if (!user) return res.status(404).json({ message: 'Profile not found.' });
    const [posts, followerCount, followingCount, isFollowing] = await Promise.all([
      Post.find({ author: user._id }).populate('author', 'name username profilePicture').sort({ createdAt: -1 }).limit(30),
      Follow.countDocuments({ following: user._id }),
      Follow.countDocuments({ follower: user._id }),
      Follow.exists({ follower: req.userId, following: user._id })
    ]);
    const comments = await Comment.find({ post: { $in: posts.map(post => post._id) } })
      .populate('author', 'name username profilePicture').sort({ createdAt: 1 });
    const postsWithComments = posts.map(post => ({
      ...post.toObject(),
      comments: comments.filter(comment => String(comment.post) === String(post._id))
    }));
    return res.json({
      user: { ...user.toObject(), id: user._id, isFollowing: Boolean(isFollowing) },
      posts: postsWithComments,
      followerCount,
      followingCount
    });
  } catch (error) {
    return next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const updates = {};
    for (const field of ['name', 'bio']) {
      if (typeof req.body[field] === 'string') updates[field] = req.body[field].trim();
    }
    if (updates.name !== undefined && (!updates.name || updates.name.length > 60)) {
      return res.status(400).json({ message: 'Name must be between 1 and 60 characters.' });
    }
    if (updates.bio && updates.bio.length > 180) return res.status(400).json({ message: 'Bio must be 180 characters or fewer.' });
    if (req.file) updates.profilePicture = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'Account not found.' });
    return res.json({ user: { id: user._id, name: user.name, username: user.username, email: user.email, bio: user.bio, profilePicture: user.profilePicture } });
  } catch (error) {
    return next(error);
  }
}

async function toggleFollow(req, res, next) {
  try {
    const target = await User.findById(req.params.userId);
    if (!target) return res.status(404).json({ message: 'User not found.' });
    if (String(target._id) === String(req.userId)) return res.status(400).json({ message: 'You cannot follow yourself.' });
    const existing = await Follow.findOne({ follower: req.userId, following: target._id });
    if (existing) {
      await existing.deleteOne();
      return res.json({ isFollowing: false });
    }
    await Follow.create({ follower: req.userId, following: target._id });
    await Notification.create({ recipient: target._id, actor: req.userId, type: 'follow' });
    return res.json({ isFollowing: true });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listUsers, getProfile, updateProfile, toggleFollow };
