const Booking = require('../models/booking.model');
const Ride = require('../models/ride.model');

exports.createBooking = async (req, res) => {
  try {
    const { rideId, seatsBooked } = req.body;
    if (!rideId || !seatsBooked) {
      return res.status(400).json({ error: 'rideId and seatsBooked are required' });
    }
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.driver.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot book your own ride' });
    }
    if (ride.availableSeats < seatsBooked) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    const booking = await Booking.create({
      ride: rideId,
      rider: req.user.id,
      seatsBooked,
      totalCost: seatsBooked * ride.pricePerSeat,
      status: 'pending',
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ rider: req.user.id })
      .populate({
        path: 'ride',
        populate: { path: 'driver', select: 'name phone vehicle rating' },
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookingsForMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user.id }).select('_id');
    const rideIds = rides.map((r) => r._id);
    const bookings = await Booking.find({ ride: { $in: rideIds } })
      .populate('ride')
      .populate('rider', 'name email phone rating')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Driver updates a booking status to accepted / rejected.
 * On accept, decrement availableSeats atomically.
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id).populate('ride');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.ride.driver.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the driver can update this booking' });
    }

    if (status === 'accepted') {
      const ride = await Ride.findOneAndUpdate(
        { _id: booking.ride._id, availableSeats: { $gte: booking.seatsBooked } },
        { $inc: { availableSeats: -booking.seatsBooked } },
        { new: true }
      );
      if (!ride) {
        return res.status(400).json({ error: 'Not enough seats remaining' });
      }
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.rider.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the rider can cancel' });
    }
    if (booking.status === 'accepted') {
      // restore seats
      await Ride.findByIdAndUpdate(booking.ride, {
        $inc: { availableSeats: booking.seatsBooked },
      });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
