const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  billingFrequency: { type: String, enum: ['monthly', 'annual'], required: true },
  renewalDate: { type: Date, required: true },
  category: { type: String, required: true },
  notes: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);