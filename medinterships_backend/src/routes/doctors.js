const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect, restrictTo } = require('../middleware/auth');

// All routes are protected and restricted to doctors
router.use(protect);
router.use(restrictTo('doctor'));

// Dashboard
router.get('/dashboard', doctorController.getDashboard);

// Students
router.get('/students', doctorController.getStudents);
router.get('/students/:id', doctorController.getStudentDetails);

// Evaluations
router.get('/evaluations', doctorController.getEvaluations);
router.post('/evaluations/:applicationId', doctorController.createEvaluation);
router.patch('/evaluations/:id/submit', doctorController.submitEvaluation);

module.exports = router;