const express = require('express');
const { listUsers, getProfile, updateProfile, toggleFollow } = require('../controllers/userController');
const requireAuth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
router.use(requireAuth);
router.get('/', listUsers);
router.patch('/me', upload.single('profilePicture'), updateProfile);
router.get('/:username', getProfile);
router.post('/:userId/follow', toggleFollow);

module.exports = router;
