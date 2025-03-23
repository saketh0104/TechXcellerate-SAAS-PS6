const express = require('express');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user }); 
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, cost, billingFrequency, renewalDate, category, notes } = req.body;

    const subscription = new Subscription({
      name,
      cost,
      billingFrequency,
      renewalDate,
      category,
      notes,
      user: req.user, 
    });

    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create subscription' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const subscription = await Subscription.findOneAndUpdate(
      { _id: id, user: req.user }, 
      updatedData,
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update subscription' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findOneAndDelete({
      _id: id,
      user: req.user, 
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete subscription' });
  }
});

module.exports = router;