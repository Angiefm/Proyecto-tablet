const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomType: {
      type: String,
      enum: ['single-1', 'single-2', 'single-3', 'suite', 'suite-kid'],
      required: true
    },
    pricePerNight: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    capacity: { type: Number, required: true },
    bedDetails: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);