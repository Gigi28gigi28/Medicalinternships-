const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');

const {
  getPublicInternships,
  getInternshipDetails
} = require('../controllers/intershipscontroller');

// ✅ Public internships list
router.get('/', getPublicInternships);

// ✅ Internship details
router.get('/:id', getInternshipDetails);

module.exports = router;
