const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomBytes(16).toString('hex')}${extension}`);
  }
});

function fileFilter(req, file, callback) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
  const isProfilePhoto = file.fieldname === 'profilePicture';
  if (!allowedTypes.includes(file.mimetype) || (isProfilePhoto && !file.mimetype.startsWith('image/'))) {
    return callback(new Error(isProfilePhoto
      ? 'Profile photos must be JPG, PNG, or WebP images.'
      : 'Choose a JPG, PNG, WebP, MP4, or WebM file.'));
  }
  return callback(null, true);
}

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }
});
