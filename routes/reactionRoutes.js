const router = require('express').Router();
const { Reaction } = require('../models');

// Get all reactions (if needed)
router.get('/reactions', async (req, res) => {
  try {
    const reactions = await Reaction.find();
    res.json(reactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single reaction by _id (if needed)
router.get('/reactions/:reactionId', async (req, res) => {
  const { reactionId } = req.params;
  try {
    const reaction = await Reaction.findById(reactionId);
    if (!reaction) {
      return res.status(404).json({ message: 'Reaction not found' });
    }
    res.json(reaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new reaction (if needed)
router.post('/reactions', async (req, res) => {
  const reactionData = req.body;
  try {
    const newReaction = await Reaction.create(reactionData);
    res.status(201).json(newReaction);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid reaction data' });
  }
});

// Update a reaction by _id (if needed)
router.put('/reactions/:reactionId', async (req, res) => {
  const { reactionId } = req.params;
  const reactionData = req.body;
  try {
    const updatedReaction = await Reaction.findByIdAndUpdate(reactionId, reactionData, { new: true });
    if (!updatedReaction) {
      return res.status(404).json({ message: 'Reaction not found' });
    }
    res.json(updatedReaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a reaction by _id (if needed)
router.delete('/reactions/:reactionId', async (req, res) => {
  const { reactionId } = req.params;
  try {
    const deletedReaction = await Reaction.findByIdAndRemove(reactionId);
    if (!deletedReaction) {
      return res.status(404).json({ message: 'Reaction not found' });
    }
    res.json(deletedReaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
