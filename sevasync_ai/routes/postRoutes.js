const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { generateDescription } = require('../utils/gemini');

// 1. GET: Fetch all tasks (Normal & SOS)
// Sorts by newest first so SOS alerts appear at the top
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST: Report Normal Issue (Step 4A)
// Uses Gemini AI to generate professional descriptions
router.post('/', async (req, res) => {
  const { title, category } = req.body;
  
  try {
    // Step 7: AI Understanding (Gemini)
    const description = await generateDescription(title);
    
    const newPost = new Post({ 
      title, 
      category, 
      description,
      isEmergency: false,
      status: 'Reported' 
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. POST: Trigger Emergency SOS (Step 4B)
// Captures GPS coordinates and marks as high-priority
router.post('/sos', async (req, res) => {
  const { lat, lng } = req.body;
  
  const newSOS = new Post({
    title: "🚨 EMERGENCY SOS TRIGGERED",
    category: "Emergency",
    description: `IMMEDIATE ASSISTANCE REQUIRED. Location captured at coordinates: ${lat}, ${lng}`,
    isEmergency: true,
    status: 'Reported',
    location: { lat, lng }
  });

  try {
    const savedSOS = await newSOS.save();
    res.status(201).json(savedSOS);
  } catch (err) {
    res.status(400).json({ message: "SOS ingestion failed" });
  }
});

// 4. PATCH: Update Issue Status (Step 14)
// Allows moving from Reported -> In Progress -> Completed
router.patch('/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: "Status update failed" });
  }
});

// 5. DELETE: Admin Coordination (Step 12)
// Removes resolved or invalid tasks from the dashboard
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Task removed from system" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;