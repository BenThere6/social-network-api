const router = require('express').Router();
const { Thought, User } = require('../models');

// Get all thoughts
router.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single thought by _id
router.get('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new thought
router.post('/thoughts', async (req, res) => {
  const thoughtData = req.body;
  try {
    const newThought = await Thought.create(thoughtData);
    // Add the created thought's _id to the associated user's thoughts array
    await User.findByIdAndUpdate(newThought.userId, { $push: { thoughts: newThought._id } });
    res.status(201).json(newThought);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid thought data' });
  }
});

// Update a thought by _id
router.put('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;
  const thoughtData = req.body;
  try {
    const updatedThought = await Thought.findByIdAndUpdate(thoughtId, thoughtData, { new: true });
    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a thought by _id
router.delete('/thoughts/:thoughtId', async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const deletedThought = await Thought.findByIdAndRemove(thoughtId);
    if (!deletedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    // Remove the thought's _id from the associated user's thoughts array
    await User.findByIdAndUpdate(deletedThought.userId, { $pull: { thoughts: thoughtId } });
    res.json(deletedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a reaction and add it to a thought's reactions array
router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
  const { thoughtId } = req.params;
  const reactionData = req.body;
  try {
    const thought = await Thought.findByIdAndUpdate(thoughtId, { $push: { reactions: reactionData } }, { new: true });
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Remove a reaction from a thought's reactions array
router.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
  const { thoughtId, reactionId } = req.params;
  try {
    const thought = await Thought.findByIdAndUpdate(thoughtId, { $pull: { reactions: { _id: reactionId } } }, { new: true });
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
