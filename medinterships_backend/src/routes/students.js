const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes are protected and restricted to students
router.use(protect);
router.use(restrictTo('student','dean','service_chief'));

// Dashboard
router.get('/dashboard', studentController.getDashboard);

// Profile
router.route('/profile')
  .get(studentController.getProfile)
  .patch(upload.single('document'), studentController.updateProfile);

// Internships
router.get('/internships', studentController.getInternships);
router.get('/internships/:id', studentController.getInternshipDetails);
router.post('/internships/:id/apply', studentController.applyToInternship);

// Applications
router.get('/applications', studentController.getApplications);
router.patch('/applications/:id/cancel', studentController.cancelApplication);

// Evaluations
router.get('/evaluations', studentController.getEvaluations);
//////////// i need three functions the document functions
module.exports = router;