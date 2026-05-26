const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const c = require('../controllers/user.controller');

router.post('/register', c.register);
router.post('/login', c.login);
router.get('/:id', auth, c.getProfile);
router.put('/:id', auth, c.updateProfile);

module.exports = router;
