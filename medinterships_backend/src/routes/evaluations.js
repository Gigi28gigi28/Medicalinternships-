const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Protected evaluations API routes could go here
router.use(protect);

module.exports = router;