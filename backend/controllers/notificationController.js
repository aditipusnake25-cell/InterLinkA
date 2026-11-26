const Notification = require('../models/Notification');

async function listNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .populate('actor', 'name username profilePicture')
      .populate('post', 'caption mediaUrl')
      .sort({ createdAt: -1 }).limit(50);
    return res.json({ notifications });
  } catch (error) {
    return next(error);
  }
}

async function markRead(req, res, next) {
  try {
    await Notification.updateMany({ recipient: req.userId, read: false }, { read: true });
    return res.json({ message: 'Notifications marked as read.' });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listNotifications, markRead };
