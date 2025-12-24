require('dotenv').config({ path: __dirname + '/../../.env' });

const { User, Student, Doctor, ServiceChief, Dean } = require('../models/models');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  delete user.password; // remove password

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};

exports.refreshToken = async (req, res) => {
  try {
    const refresh = req.cookies.refreshToken;

    if (!refresh) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(
      refresh,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      status: "success",
      token: accessToken
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, matricule } = req.body;

    
    if (matricule) {
      console.log("Student login with matricule:", matricule);
      const student = await User.findOne({ where: { matricule } });
      if (!student || !(await student.correctPassword(password))) {
        return res.status(401).json({ status: 'error', message: 'Matricule ou mot de passe incorrect' });
      }
      
      if (!student.isActive) {
        return res.status(401).json({ status: 'error', message: 'Compte désactivé' });
      }
      
      await student.updateLastLogin();
      createSendToken(student, 200, res);
      return;
    }      

    // Other users login
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({ status: 'error', message: 'Email ou mot de passe incorrect' });
    }

    if (!user.isActive) {
      return res.status(401).json({ status: 'error', message: 'Compte désactivé' });
    }

    await user.updateLastLogin();
    createSendToken(user, 200, res);

  } catch (err) {
    console.error("Students error:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ status: 'success', message: 'Déconnexion réussie' });
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!(await user.correctPassword(currentPassword))) {
      return res.status(400).json({ status: 'error', message: 'Mot de passe actuel incorrect' });
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    res.status(200).json({ status: 'success', message: 'Mot de passe modifié avec succès' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ status: 'error', message: 'Erreur lors du changement de mot de passe' });
  }
};

exports.getMe = async (req, res) => {
  try {
    let userData;
    switch(req.user.role) {
      case 'student':
        userData = await Student.findOne({ where: { userId: req.user.id }, include: User });
        break;
      case 'doctor':
        userData = await Doctor.findOne({ where: { userId: req.user.id }, include: User });
        break;
      case 'service_chief':
        userData = await ServiceChief.findOne({ where: { userId: req.user.id }, include: User });
        break;
      case 'dean':
        userData = await Dean.findOne({ where: { userId: req.user.id }, include: User });
        break;
      default:
        userData = await User.findByPk(req.user.id);
    }

    res.status(200).json({ status: 'success', data: { user: userData } });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ status: 'error', message: 'Erreur lors de la récupération du profil' });
  }
};
