import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: String,
  balance: { type: Number, default: 0 },
  invitedFriends: { type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
