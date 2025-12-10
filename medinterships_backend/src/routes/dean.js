const express = require('express');
const router = express.Router();
const deanController = require('../controllers/deanController');
const { protect, restrictTo } = require('../middleware/auth');

// All routes are protected and restricted to dean
router.use(protect);
router.use(restrictTo('dean'));

// Dashboard
router.get('/dashboard', deanController.getDashboard);

// User Management
router.route('/users')
  .get(deanController.getUsers)
  .post(deanController.createUser);

router.patch('/users/:id/toggle-status', deanController.toggleUserStatus);

// Establishments Management
router.route('/establishments')
  .get(deanController.getEstablishments)
  .post(deanController.createEstablishment);

// Services Management
router.route('/services')
  .get(deanController.getServices)
  .post(deanController.createService);
router.route('/interships')
  .post(deanController.storeInternship);
  
// Statistics and Reports
router.get('/statistics', deanController.getStatistics);
router.get('/reports/export', deanController.exportReport);

module.exports = router;