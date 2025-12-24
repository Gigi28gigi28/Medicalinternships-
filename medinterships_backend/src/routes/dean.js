const express = require('express');
const router = express.Router();
const deanController = require('../controllers/deanController');
const { protect, restrictTo } = require('../middleware/auth');
const { route } = require('./auth');

// All routes are protected and restricted to dean
router.use(protect);
router.use(restrictTo('dean'));

// Dashboard
router.get('/dashboard', deanController.getDashboard);

// User Management
router.route('/users')
  .get(deanController.getUsers)
  .post(deanController.createUser);

router.patch('/users/:id/modify', deanController.modifyUser);
router.delete('/users/:id/delete', deanController.deleteUser);
router.patch('/users/:id/toggle-status', deanController.toggleUserStatus);

// Establishments Management
router.route('/establishments')
  .get(deanController.getEstablishments)
  .post(deanController.createEstablishment);

router.patch('/establishments/:id/modify',deanController.modifyEstablishment);
router.delete('/establishments/:id/delete',deanController.deleteestablishments);

// Services Management
router.route('/services')
  .get(deanController.getServices)
  .post(deanController.createService);
router.patch('/services/:id/modify', deanController.modifyservice );
router.delete('/services/:id/modify',deanController.deleteservice);


  
router.route('/interships')
  .post(deanController.storeInternship);
router.patch('/interships/:id/modify',deanController.modifyInternship);

router.delete('/interships/:id/delete' ,deanController.deleteintership);
  
// Statistics and Reports
router.get('/statistics', deanController.getStatistics);
router.get('/reports/export', deanController.exportReport);

module.exports = router;