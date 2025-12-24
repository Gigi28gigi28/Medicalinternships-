const express = require('express');
const router = express.Router();
const establishmentsController = require('../controllers/establishmentscontroller');


// ✅ Public establishments list
router.get('/', establishmentsController.getPublicEstablishments);

module.exports = router;
