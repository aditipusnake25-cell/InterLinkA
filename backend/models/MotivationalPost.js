const mongoose = require('mongoose');

const motivationalPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true, maxlength: 500 }
}, { timestamps: true });

module.exports = mongoose.model('MotivationalPost', motivationalPostSchema);
