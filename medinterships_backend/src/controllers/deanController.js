const { Dean,Department, User, Establishment, Internship, Application } = require('../models/models');
const { Op, fn, col, literal } = require('sequelize');

exports.getDashboard = async (req, res) => {
  try {
    // Get admin  profile
    const dean = await Dean.findOne({ where: { userId: req.user.id }, include: { model: User, as: "user" } });

    if (!dean) {
      return res.status(404).json({ status: "error", message: "Profil doyen non trouvé" });
    }

    // Basic stats
    const totalStudents = await User.count({ where: { role: "student" } });
    const studentsWithInternship = await Application.count({ 
      include: [{ model: User, as: "student", where: { role: "student" } }],
      where: { status: "acceptee" } 
    });
    const totalDoctors = await User.count({ where: { role: "doctor" } });
    const totalServiceChiefs = await User.count({ where: { role: "service_chief" } });
    const totalEstablishments = await Establishment.count();
    const activeInternships = await Internship.count({ where: { status: "actif" } });

    const placementRate = totalStudents > 0 ? ((studentsWithInternship / totalStudents) * 100).toFixed(1) : 0;

    // Recent students
    const recentStudents = await User.findAll({
      where: { role: "student" },
      order: [["createdAt", "DESC"]],
      limit: 5,
      attributes: ["id", "firstName", "lastName", "email", "createdAt"]
    });

    // Recent establishments
    const recentEstablishments = await Establishment.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
      attributes: ["id", "name", "city", "createdAt"]
    });

    // Alerts
    const studentsWithoutInternship = totalStudents - studentsWithInternship;

    const servicesWithInternships = await Internship.findAll({
      attributes: ["establishmentId"],
      where: { status: "actif" },
      group: ["establishmentId"],
    });

    const establishmentIdsWithInternships = servicesWithInternships.map(i => i.establishmentId);

    const establishmentsWithoutInternships = await Establishment.count({
      where: { id: { [Op.notIn]: establishmentIdsWithInternships } }
    });

    res.status(200).json({
      status: "success",
      data: {
        dean,
        stats: {
          totalStudents,
          studentsWithInternship,
          totalDoctors,
          totalServiceChiefs,
          totalEstablishments,
          activeInternships,
          placementRate,
        },
        recentStudents,
        recentEstablishments,
        alerts: {
          studentsWithoutInternship,
          establishmentsWithoutInternships,
        },
      },
    });
  } catch (error) {
    console.error("Dean dashboard error:", error);
    res.status(500).json({ status: "error", message: "Erreur lors du chargement du tableau de bord" });
  }
};

// User Management
exports.getUsers = async (req, res) => {
  try {
  const { role, search } = req.query;
  const where = {};
  
  if (role) where.role = role;
  if (search) {
    // MySQL: [Op.like], PostgreSQL: [Op.iLike]
    where.email = { [Op.like]: `%${search}%` };
  }
  
  const users = await User.findAll({
    where,
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
  });
  
  res.status(200).json({
    status: "success",
    data: users,
    filters: { role: role || null, search: search || null },
  });
  
  } catch (error) {
  console.error("Users error:", error);
  res.status(500).json({
  status: "error",
  message: "Erreur lors du chargement des utilisateurs",
  });
  }
  };
exports.createUserForm = async (req, res) => {
  res.render('dean/create-user', { title: 'Créer un Utilisateur' });
};

exports.createUser = async (req, res) => {
  try {
    const { email , role,  firstName, lastName, level, phone, specialty, licenseNumber, service, establishment } = req.body;
    let user;
    if ( role != 'student') {
      user = await User.create({
      email: req.body.email,
      password: req.body.password, // or hashedPassword if you hash it before
      role,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone || null
    });}

    switch (role) {
      case 'student': {
        const upperEmail = email.toUpperCase();
        console.log(upperEmail);
        const existingStudent = await User.findOne({ where: {email: upperEmail } });
      
        if (existingStudent) {
          await user.destroy();
          return res.status(400).json({ status: 'error', message: 'Un étudiant avec cet email existe déjà' });
        }else{
          user = await User.create({
            email: req.body.email,
            password: req.body.password, 
            role: req.body.role,
            level: req.body.level,
            specialty: req.body.specialty,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone || null
          });
          console.log('wash zin')
        }
      
        await user.update({ firstName, lastName, phone, email: req.body.email, level });
        break;
      }
      

      case 'doctor':
        await user.update({ firstName, lastName, phone, specialty, licenseNumber, departmentId: service, establishmentId: establishment });
        break;

      case 'service_chief':
        await user.update({ firstName, lastName, phone, departmentId: service, establishmentId: establishment });
        break;

      case 'dean':
        await user.update({ firstName, lastName, phone });
        await Dean.create({ userId: user.id, firstName, lastName, phone });
        break;

      default:
        throw new Error('Role non reconnu');
    }

    return res.status(201).json({ status: 'success', message: 'Utilisateur créé avec succès', user });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Erreur interne du serveur', error: error.message });
  }
};


exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, message: `Utilisateur ${user.isActive ? 'activé' : 'désactivé'} avec succès`, isActive: user.isActive });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la modification du statut' });
  }
};



// Establishments Management
exports.getEstablishments = async (req, res) => {
  try {
    const establishments = await Establishment.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: establishments
    });
  } catch (error) {
    console.error('Establishments error:', error.message);
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};



exports.createEstablishment = async (req, res) => {
  try {
    const { name, address, city, phone, email, type } = req.body;

    // Create the establishment
    const newEstablishment = await Establishment.create({
      name,
      address,
      city,
      phone,
      email,
      type
    });

    res.status(201).json({
      success: true,
      message: 'Établissement créé avec succès',
      data: newEstablishment
    });
  } catch (error) {
    console.error('Create establishment error:', error); // <-- log full error
    res.status(500).json({
      success: false,
      error: error.message // <-- send full error message in response
    });
  }
};


// Services Management
exports.getServices = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [
        { model: Establishment, as: 'establishment' },
        { model: User, as: 'chief' } // assuming chief is a User
      ],
      order: [['createdAt', 'DESC']]
    });

    const establishments = await Establishment.findAll({ where: { isActive: true } });

    res.status(200).json({
      success: true,
      data: {
        departments,
        establishments
      }
    });
  } catch (error) {
    console.error('Create establishment error:', error); // <-- log full error
    res.status(500).json({
      success: false,
      error: error.message // <-- send full error message in response
    });
  }
};

// Create a new department
exports.createService = async (req, res) => {
  try {
    const { name, description, establishmentId, chiefId, totalPlaces, availablePlaces } = req.body;

    // Optional: check if department with same name exists in this establishment
    const existingDept = await Department.findOne({ 
      where: { name, establishmentId } 
    });
    if (existingDept) {
      return res.status(400).json({
        success: false,
        error: 'Un département avec ce nom existe déjà dans cet établissement'
      });
    }

    const department = await Department.create({
      name,
      description,
      establishmentId,
      chiefId: chiefId || null,
      totalPlaces: totalPlaces || 0,
      availablePlaces: availablePlaces || 0
    });

    res.status(201).json({
      success: true,
      message: 'Département créé avec succès',
      data: department
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du département'
    });
  }
};
// create and store internship
exports.storeInternship = async (req, res) => {
  try {
  // Get the logged-in service chief
  const dean = await User.findOne({ where: { id: req.user.id } });
  if (!dean) {
  return res.status(404).json({ error: "Chef de service non trouvé" });
  }
  const {
    title,
    description,
    departmentId,
    establishmentId,
    chiefId,
    createdBy,  
    duration,
    startDate,
    endDate,
    totalPlaces,
    requirements
  } = req.body;


  const newInternship = await Internship.create({
    title,
    description,
    departmentId,
    establishmentId,
    chiefId,
    createdBy,   
    duration,
    startDate,
    endDate,
    totalPlaces: parseInt(totalPlaces),
    filledPlaces: 0,
    requirements: requirements
      ? JSON.stringify(requirements.split(",").map(r => r.trim()))
      : null,
    status: "actif",
  });
  
  return res.json({
    success: true,
    message: "Stage créé avec succès",
    internship: newInternship,
  });
  
  } catch (error) {
    console.error("Submit evaluation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
  };

exports.getStatistics = async (req, res) => {
  try {
    const byLevel = await User.findAll( {where : {role : "student"}} , {
      attributes: ['level', [fn('COUNT', col('id')), 'count']],
      group: ['level']
    });

    const withInternship = await Application.count({ where: { status: 'accepted' } });
    const withoutInternship = await User.count({where: {role: "student"}}) - withInternship;

    // Establishment statistics
    const establishmentStats = await Establishment.findAll({
      include: [{
        model: Internship,
        attributes: ['id'],
      }],
    });

    // Service statistics
    const serviceStats = await Department.findAll({
      include: [{
        model: Internship,
        attributes: ['id'],
        where: { isActive: true, isPublished: true },
        required: false
      }],
    });

    // Monthly internship trends
    const internships = await Internship.findAll({
      where: { createdAt: { [Op.gte]: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } },
      attributes: [
        [fn('YEAR', col('createdAt')), 'year'],
        [fn('MONTH', col('createdAt')), 'month'],
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['year', 'month'],
      order: [['year', 'ASC'], ['month', 'ASC']]
    });
    res.status(201).json({
      status: "success",
      message: "you cooking",
      data: { 
        withInternship,
        withoutInternship,
        internships,
        serviceStats
      }
    });
    
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).render('error', { error: 'Erreur lors du chargement des statistiques', user: req.user });
  }
};

exports.exportReport = async (req, res) => {
  try {
    const totalStudents = await User.count({ where: { role: "student" } });
    const totalInternships = await Internship.count();
    const placementRate = totalStudents > 0 ? ((await Application.count({ where: { status: 'accepted' } }) / totalStudents) * 100).toFixed(1) : 0;
    const activeEstablishments = await Establishment.count({ where: { isActive: true } });
    const activeServices = await Establishment.count({ where: { isActive: true } });

    res.json({
      success: true,
      data: { generatedAt: new Date(), totalStudents, totalInternships, placementRate, activeEstablishments, activeServices },
      message: 'Rapport généré avec succès'
    });
  } catch (error) {
    console.error('Create establishment error:', error); // <-- log full error
    res.status(500).json({
      success: false,
      error: error.message // <-- send full error message in response
    });
  }
};


