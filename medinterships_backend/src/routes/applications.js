const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Protected applications API routes could go here
router.use(protect);

module.exports = router;