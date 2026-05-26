const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const c = require('../controllers/ride.controller');

router.get('/', c.getAllRides);
router.post('/', auth, c.createRide);
router.post('/match', auth, c.matchRides);
router.get('/user/:userId', auth, c.getRidesForUser);
router.get('/:id', c.getRideById);
router.delete('/:rideId', auth, c.deleteRide);

module.exports = router;
