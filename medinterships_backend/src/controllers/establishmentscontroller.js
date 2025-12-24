const { Establishment } = require('../models/models');

// ✅ Get public establishments list


exports.getPublicEstablishments = async (req, res) => {
  try {
    const establishments = await Establishment.findAll();

    res.status(200).json({
      status: 'success',
      data: establishments
    });
  } catch (error) {
    console.error('Establishments API error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors du chargement des établissements'
    });
  }
};
