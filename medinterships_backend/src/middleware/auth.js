require('dotenv').config({ path: __dirname + '/../../.env' });
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findByPk(decoded.id);

    if (!currentUser || !currentUser.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'L\'utilisateur associé à ce token n\'existe plus.'
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Token invalide ou expiré.'
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Vous n\'avez pas la permission d\'effectuer cette action.'
      });
    }
    next();
  };
};
