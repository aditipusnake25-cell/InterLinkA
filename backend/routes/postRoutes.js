const express = require('express');
const { listPosts, createPost, toggleLike, addComment, deletePost } = require('../controllers/postController');
const requireAuth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
router.use(requireAuth);
router.get('/', listPosts);
router.post('/', upload.single('media'), createPost);
router.post('/:postId/like', toggleLike);
router.post('/:postId/comments', addComment);
router.delete('/:postId', deletePost);

module.exports = router;
