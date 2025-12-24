const { Department } = require('../models/models');

// ✅ Get public services list
exports.getPublicServices = async (req, res) => {
  try {
    const services = await Department.findAll();

    res.status(200).json({
      status: 'success',
      data: services
    });

  } catch (error) {
    console.error('Services API error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors du chargement des services'
    });
  }
};
