const express = require('express');
const router = express.Router();
const serviceChiefController = require('../controllers/serviceChiefController');
const { protect, restrictTo } = require('../middleware/auth');

// All routes are protected and restricted to service chiefs
router.use(protect);
router.use(restrictTo('service_chief'));

// Dashboard
router.get('/dashboard', serviceChiefController.getDashboard);

// Internships
router.route('/internships')
  .get(serviceChiefController.getInternships)


// Applications
router.get('/applications', serviceChiefController.getApplications);
router.patch('/applications/:id/status', serviceChiefController.updateApplicationStatus);

// Evaluations
router.get('/evaluations', serviceChiefController.getEvaluations);
router.patch('/evaluations/:id/validate', serviceChiefController.validateEvaluation);

module.exports = router;