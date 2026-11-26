const Story = require('../models/Story');
const DailyExperience = require('../models/DailyExperience');
const MotivationalPost = require('../models/MotivationalPost');

async function listStories(req, res, next) {
  try {
    const stories = await Story.find({ expiresAt: { $gt: new Date() } })
      .populate('author', 'name username profilePicture').sort({ createdAt: -1 }).limit(100);
    return res.json({ stories });
  } catch (error) {
    return next(error);
  }
}

async function createStory(req, res, next) {
  try {
    if (!req.file || !req.file.mimetype.startsWith('image/') && !req.file.mimetype.startsWith('video/')) {
      return res.status(400).json({ message: 'Choose a photo or video for your story.' });
    }
    const story = await Story.create({
      author: req.userId,
      mediaUrl: `/uploads/${req.file.filename}`,
      mediaType: req.file.mimetype.startsWith('video/') ? 'video' : 'image',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    await story.populate('author', 'name username profilePicture');
    return res.status(201).json({ story });
  } catch (error) {
    return next(error);
  }
}

async function listExperiences(req, res, next) {
  try {
    const experiences = await DailyExperience.find().populate('author', 'name username profilePicture')
      .sort({ createdAt: -1 }).limit(50);
    return res.json({ experiences });
  } catch (error) {
    return next(error);
  }
}

async function createExperience(req, res, next) {
  try {
    const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
    if (!text || text.length > 1000) return res.status(400).json({ message: 'Experience must be between 1 and 1,000 characters.' });
    const experience = await DailyExperience.create({ author: req.userId, text });
    await experience.populate('author', 'name username profilePicture');
    return res.status(201).json({ experience });
  } catch (error) {
    return next(error);
  }
}

async function listMotivation(req, res, next) {
  try {
    const thoughts = await MotivationalPost.find().populate('author', 'name username profilePicture')
      .sort({ createdAt: -1 }).limit(50);
    return res.json({ thoughts });
  } catch (error) {
    return next(error);
  }
}

async function createMotivation(req, res, next) {
  try {
    const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
    if (!text || text.length > 500) return res.status(400).json({ message: 'Thought must be between 1 and 500 characters.' });
    const thought = await MotivationalPost.create({ author: req.userId, text });
    await thought.populate('author', 'name username profilePicture');
    return res.status(201).json({ thought });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listStories, createStory, listExperiences, createExperience, listMotivation, createMotivation };
