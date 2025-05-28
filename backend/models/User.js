import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId:         { type: String, required: true, unique: true },
  coins:        { type: Number, default: 0 },
  invitedFriends: { type: Number, default: 0 }
}, { collection: 'users', timestamps: true });

export default mongoose.model('User', userSchema);
