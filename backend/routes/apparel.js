const express = require('express');
const multer = require('multer');
const Apparel = require('../models/Apparel');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { uploadToS3 } = require('../utils/s3');
const { sendEmail } = require('../utils/email');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { type, condition, size, description, latitude, longitude } = req.body;
    const imageUrl = await uploadToS3(req.file);

    const apparel = new Apparel({
      type,
      condition,
      size,
      description,
      imageUrl,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      user: req.user._id,
    });

    const savedApparel = await apparel.save();

    // Update user points and badges
    const user = await User.findById(req.user._id);
    user.points += 10;
    if (user.points >= 100 && !user.badges.includes('Recycling Enthusiast')) {
      user.badges.push('Recycling Enthusiast');
      sendEmail(
        user.email,
        'New Badge Earned!',
        'Congratulations! You\'ve earned the Recycling Enthusiast badge.',
        '<h1>New Badge Earned!</h1><p>Congratulations! You\'ve earned the Recycling Enthusiast badge.</p>'
      );
    }
    await user.save();

    res.status(201).json(savedApparel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const apparel = await Apparel.find({ user: req.user._id }).sort('-createdAt');
    res.json(apparel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/nearby', protect, async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;
    const apparel = await Apparel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    }).limit(20);
    res.json(apparel);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;