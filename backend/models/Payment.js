import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId:      { type: String, required: true, index: true },
  type:        { type: String, required: true, enum: ['payment'] },
  coins:       { type: Number, required: true },
  usdPrice:    { type: Number, required: true },
  status:      { type: String, required: true, enum: ['success','failure'] },
  errorMsg:    { type: String, default: '' },
  timestamp:   { type: Date,   default: () => new Date() },
}, { collection: 'payments', timestamps: false });

export default mongoose.model('Payment', paymentSchema);
