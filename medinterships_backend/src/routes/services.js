const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicescontroller');


router.get('/', servicesController.getPublicServices);

module.exports = router;
