const express = require('express');
const router = express.Router();

const {
  getPublicEstablishments
} = require('../controllers/establishmentscontroller');

// ✅ Public establishments list
router.get('/', getPublicEstablishments);

module.exports = router;
