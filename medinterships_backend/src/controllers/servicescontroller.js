const { Department } = require('../models/models');

// ✅ Get public services list
exports.getPublicServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate('establishment')
      .sort({ name: 1 });

    res.status(200).json({
      status: 'success',
      data: { Department }
    });

  } catch (error) {
    console.error('Services API error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors du chargement des services'
    });
  }
};
