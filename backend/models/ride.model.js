const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    origin: { type: String, required: true },
    originPlaceId: { type: String, required: true },
    destination: { type: String, required: true },
    destinationPlaceId: { type: String, required: true },
    departureTime: { type: Date, required: true },
    availableSeats: { type: Number, required: true, min: 1 },
    pricePerSeat: { type: Number, required: true, min: 0 },
    vehicle: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ride', rideSchema);
