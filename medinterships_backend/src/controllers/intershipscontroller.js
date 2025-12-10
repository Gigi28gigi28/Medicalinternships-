const { Internship } = require('../models/models');

// ✅ Get public internships list
exports.getPublicInternships = async (req, res) => {
  try {
    const { service, establishment, search, page = 1, limit = 10 } = req.query;

    let filter = { 
      isActive: true, 
      isPublished: true 
    };

    if (service) filter.service = service;
    if (establishment) filter.establishment = establishment;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const internships = await Internship.find(filter)
      .populate('service')
      .populate('establishment')
      .populate('chief')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Internship.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        internships,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Public internships error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors du chargement des stages'
    });
  }
};

// ✅ Get internship details
exports.getInternshipDetails = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('service')
      .populate('establishment')
      .populate('chief');

    if (!internship) {
      return res.status(404).json({
        status: 'error',
        message: 'Stage non trouvé'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { internship }
    });

  } catch (error) {
    console.error('Internship details error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors du chargement du stage'
    });
  }
};
