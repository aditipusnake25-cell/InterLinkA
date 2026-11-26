const express = require('express');
const {
  listStories, createStory, listExperiences, createExperience, listMotivation, createMotivation
} = require('../controllers/communityController');
const requireAuth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
router.use(requireAuth);
router.get('/stories', listStories);
router.post('/stories', upload.single('media'), createStory);
router.get('/experiences', listExperiences);
router.post('/experiences', createExperience);
router.get('/motivation', listMotivation);
router.post('/motivation', createMotivation);

module.exports = router;
