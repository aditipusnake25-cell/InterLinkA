const express = require('express');
const { listNotifications, markRead } = require('../controllers/notificationController');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);
router.get('/', listNotifications);
router.patch('/read', markRead);

module.exports = router;
