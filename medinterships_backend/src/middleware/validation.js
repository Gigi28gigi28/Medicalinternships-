const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }
  next();
};

// Login validation: either email or matricule is required
exports.loginValidation = [
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('matricule')
    .optional({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage('Matricule requis'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body().custom(body => {
    if (!body.email && !body.matricule) {
      throw new Error('Email ou matricule requis');
    }
    return true;
  })
];

// Student profile validation
exports.studentProfileValidation = [
  body('firstName')
    .notEmpty()
    .trim()
    .withMessage('Le prénom est requis'),
  body('lastName')
    .notEmpty()
    .trim()
    .withMessage('Le nom est requis'),
  body('level')
    .isIn(['L1', 'L2', 'L3', 'M1', 'M2'])
    .withMessage('Niveau invalide'),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .isMobilePhone()
    .withMessage('Numéro de téléphone invalide')
];

// Internship validation
exports.internshipValidation = [
  body('title')
    .notEmpty()
    .trim()
    .withMessage('Le titre est requis'),
  body('description')
    .notEmpty()
    .trim()
    .withMessage('La description est requise'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('La durée doit être un nombre positif'),
  body('availablePlaces')
    .isInt({ min: 1 })
    .withMessage('Le nombre de places doit être un nombre positif'),
  body('startDate')
    .isISO8601()
    .toDate()
    .withMessage('Date de début invalide'),
  body('endDate')
    .isISO8601()
    .toDate()
    .withMessage('Date de fin invalide')
];
