const express = require('express');
const router = express.Router();

const {
  getPublicServices
} = require('../controllers/servicescontroller');

// ✅ Public services list
router.get('/', getPublicServices);

module.exports = router;
