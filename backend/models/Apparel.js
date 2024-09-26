const mongoose = require('mongoose');

const apparelSchema = new mongoose.Schema({
  type: { type: String, required: true },
  condition: { type: String, required: true },
  size: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

apparelSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Apparel', apparelSchema);