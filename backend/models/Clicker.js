import mongoose from 'mongoose';

const clickerSchema = new mongoose.Schema({
  userId: String,
  coins: { type: Number, default: 0 },
  total: { type: Number, default: 500 },
  power: { type: Number, default: 500 },
});

export default mongoose.models.Clicker || mongoose.model('Clicker', clickerSchema);
