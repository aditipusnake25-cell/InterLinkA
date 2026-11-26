const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

async function listPosts(req, res, next) {
  try {
    const posts = await Post.find().populate('author', 'name username profilePicture').sort({ createdAt: -1 }).limit(50);
    const comments = await Comment.find({ post: { $in: posts.map(post => post._id) } })
      .populate('author', 'name username profilePicture').sort({ createdAt: 1 });
    return res.json({ posts: posts.map(post => ({
      ...post.toObject(),
      comments: comments.filter(comment => String(comment.post._id || comment.post) === String(post._id))
    })) });
  } catch (error) {
    return next(error);
  }
}

async function createPost(req, res, next) {
  try {
    const caption = typeof req.body.caption === 'string' ? req.body.caption.trim() : '';
    if (!caption && !req.file) return res.status(400).json({ message: 'Add a caption or choose a photo or video.' });
    if (caption.length > 2000) return res.status(400).json({ message: 'Caption must be 2,000 characters or fewer.' });
    const isVideo = req.file && req.file.mimetype.startsWith('video/');
    const post = await Post.create({
      author: req.userId,
      caption,
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : '',
      mediaType: req.file ? (isVideo ? 'video' : 'image') : 'text'
    });
    await post.populate('author', 'name username profilePicture');
    return res.status(201).json({ post: { ...post.toObject(), comments: [] } });
  } catch (error) {
    return next(error);
  }
}

async function toggleLike(req, res, next) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    const alreadyLiked = post.likes.some(id => String(id) === String(req.userId));
    if (alreadyLiked) {
      post.likes.pull(req.userId);
      await Notification.deleteOne({ recipient: post.author, actor: req.userId, post: post._id, type: 'like' });
    } else {
      post.likes.addToSet(req.userId);
      if (String(post.author) !== String(req.userId)) {
        await Notification.create({ recipient: post.author, actor: req.userId, type: 'like', post: post._id });
      }
    }
    await post.save();
    return res.json({ liked: !alreadyLiked, likes: post.likes });
  } catch (error) {
    return next(error);
  }
}

async function addComment(req, res, next) {
  try {
    const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
    if (!text || text.length > 500) return res.status(400).json({ message: 'Comment must be between 1 and 500 characters.' });
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    const comment = await Comment.create({ post: post._id, author: req.userId, text });
    await comment.populate('author', 'name username profilePicture');
    if (String(post.author) !== String(req.userId)) {
      await Notification.create({ recipient: post.author, actor: req.userId, type: 'comment', post: post._id });
    }
    return res.status(201).json({ comment });
  } catch (error) {
    return next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    if (String(post.author) !== String(req.userId)) return res.status(403).json({ message: 'You can only delete your own posts.' });
    await Promise.all([
      post.deleteOne(),
      Comment.deleteMany({ post: post._id }),
      Notification.deleteMany({ post: post._id })
    ]);
    return res.json({ message: 'Post deleted.' });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listPosts, createPost, toggleLike, addComment, deletePost };
