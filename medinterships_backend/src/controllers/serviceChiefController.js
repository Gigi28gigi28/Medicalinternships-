const { Op } = require("sequelize");
const { User, Department, Internship, Application, Evaluation, Establishment } = require("../models/models");

exports.getDashboard = async (req, res) => {
  try {
  const chief = await User.findOne({
  where: { id: req.user.id },
  include: [
  { model: Department, as: "department" },
  { model: Establishment, as: "establishment" },
  ],
  });
  
  if (!chief) {
    return res.status(404).json({ error: "Profil chef de service non trouvé", user: req.user });
  }
  
  const internships = await Internship.findAll({
    where: {
      departmentId: chief.departmentId,
      establishmentId: chief.establishmentId,
    },
  });
  
  const internshipIds = internships.map(i => i.id);
  
  const stats = {
    pendingApplications: await Application.count({
      where: { internshipId: { [Op.in]: internshipIds }, status: "en_attente" },
    }),
    activeInternships: await Internship.count({
      where: { id: { [Op.in]: internshipIds }, status: "actif" },
    }),
    pendingEvaluations: await Evaluation.count({
      where: { internshipId: { [Op.in]: internshipIds }, status: "soumise" },
    }),
    totalStudents: await Application.count({
      where: { internshipId: { [Op.in]: internshipIds }, status: "acceptee" },
    }),
  };
  
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const urgentApplications = await Application.findAll({
    where: {
      internshipId: { [Op.in]: internshipIds },
      status: "en_attente",
      appliedDate: { [Op.lte]: sevenDaysAgo },
    },
    include: [
      { model: User, as: "student" },
      { model: Internship, as: "internship" }
    ],
    limit: 5,
    order: [["appliedDate", "ASC"]],
  });
  
  const activeInternships = await Internship.findAll({
    where: { id: { [Op.in]: internshipIds }, status: "actif" },
    include: [
      { model: Department, as: "department" },
      { model: Establishment, as: "establishment" }
    ]
  });
  
  const pendingEvaluations = await Evaluation.findAll({
    where: { internshipId: { [Op.in]: internshipIds }, status: "soumise" },
    include: [
      { model: User, as: "student" },
      { model: Internship, as: "internship" },
      { model: User, as: "doctor" }
    ],
    limit: 5,
    order: [["submissionDate", "DESC"]],
  });
  
  return res.json({
    chief,
    stats,
    urgentApplications,
    activeInternships,
    pendingEvaluations,
    title: "Tableau de Bord Chef de Service",
  });
  
  } catch (error) {
  console.error("Chief dashboard error:", error);
  return res.status(500).json({
  error: "Erreur lors du chargement du tableau de bord",
  user: req.user,
  });
  }
  };

  exports.getInternships = async (req, res) => {
    try {
    const chief = await User.findOne({ where: { id: req.user.id } });
    if (!chief) return res.status(404).json({ error: "Chef de service non trouvé" });
    
    const internships = await Internship.findAll({
      where: {
        departmentId: chief.departmentId,
        establishmentId: chief.establishmentId,
      },
      include: [
        { model: Department, as: "department" }, // use alias
        { model: Establishment, as: "establishment" }, // use alias
        { model: User, as: "creator" } // include the creator if needed
      ],
      order: [["startDate", "DESC"]],
    });
    
    return res.json({
      success: true,
      internships,
      title: "Stages du Chef de Service",
    });
    
    } catch (error) {
    console.error("getInternships error:", error);
    return res.status(500).json({
    success: false,
    error: "Erreur lors du chargement des stages",
    user: req.user,
    });
    }
    };


  exports.getApplications = async (req, res) => {
    try {
      const chief = await User.findOne({ where: { id: req.user.id } });
      if (!chief) {
        return res.status(404).json({ success: false, error: "Chef de service non trouvé" });
      }
  
      const { status, internshipId } = req.query;
  
      const internships = await Internship.findAll({ where: { createdBy: chief.id } });
      const internshipIds = internships.map(i => i.id);
  
      const filter = { internshipId: { [Op.in]: internshipIds } };
      if (status) filter.status = status.toLowerCase();
      if (internshipId) filter.internshipId = internshipId;
  
      const applications = await Application.findAll({
        where: filter,
        include: [
          { model: User, as: "student" },
          { model: Internship, as: "internship" }
        ],
        order: [["appliedDate", "DESC"]],
      });
  
      // Attach the chief as reviewer for all applications
      const applicationsWithReviewer = applications.map(app => {
        return {
          ...app.toJSON(),
          reviewer: {
            id: chief.id,
            firstName: chief.firstName,
            lastName: chief.lastName,
            email: chief.email,
            role: chief.role
          }
        };
      });
  
      const stats = {
        pending: await Application.count({ where: { ...filter, status: "en_attente" } }),
        accepted: await Application.count({ where: { ...filter, status: "acceptee" } }),
        rejected: await Application.count({ where: { ...filter, status: "refusee" } }),
      };
  
      return res.json({
        success: true,
        applications: applicationsWithReviewer,
        stats,
        filters: { status, internshipId },
        title: "Gestion des Candidatures",
      });
  
    } catch (error) {
      console.error("Applications error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  exports.updateApplicationStatus = async (req, res) => {
    try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    
  
    const chief = await User.findOne({ where: { id: req.user.id } });
    if (!chief) {
      return res.status(404).json({ success: false, error: "Chef de service non trouvé" });
    }
    
    // Ensure the application belongs to an internship created by this chief
    const application = await Application.findOne({
      where: { id },
      include: [
        {
          model: Internship,
          as: "internship", // ✅ specify the alias
          where: { chiefId: chief.id },
        },
      ],
    });
    if (1==1){
      console.log(id);
      console.log(application);
    }
    
    if (!application) {
      return res.status(404).json({ success: false, error: "Candidature non trouvée ou pas supervisée par ce chef" });
    }
    
    // Update status
    application.status = status;
    if (status.toLowerCase() === "refusee" && rejectionReason) {
      application.rejectionReason = rejectionReason;
    }
    
    await application.save();
    
    // If accepted → increment filled places
    if (status.toLowerCase() === "acceptee") {
      const internship = await Internship.findByPk(application.internshipId);
      internship.filledPlaces += 1;
      await internship.save();
    }
    
    // Attach reviewer info in memory (not in DB)
    application.dataValues.reviewer = chief;
    
    return res.json({
      success: true,
      message: "Statut mis à jour avec succès",
      application,
    });
    
    
    } catch (error) {
    console.error("Update application status error:", error);
    return res.status(500).json({ success: false, error: "Erreur lors de la mise à jour" });
    }
    };
    

exports.getEvaluations = async (req, res) => {
  try {
    const chief = await User.findOne({ where: { id: req.user.id } });
    const { status } = req.query;

    // Internships supervised by this chief
    const internships = await Internship.findAll({
      where: { chiefId: chief.id },
    });
    const internshipIds = internships.map(i => i.id);

    // Filters
    const filter = { internshipId: { [Op.in]: internshipIds } };
    if (status) filter.status = status;

    // Fetch evaluations
    const evaluations = await Evaluation.findAll({
      where: filter,
      include: [
        { model: User, as: "student" },
        { model: Internship, as: "internship" }, // use the alias
        { model: User, as: "doctor" }
      ],
      order: [["submissionDate", "DESC"]],
    });
    
    

    return res.json({
      evaluations,
      filters: { status },
      title: "Évaluations des Stages"
    });

  } catch (error) {
    console.error("Submit evaluation error:", error);
  res.status(500).json({ success: false, error: error.message });
 
  }
};


exports.validateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { chiefComments } = req.body;

    // Find the evaluation that is "soumise"
    const evaluation = await Evaluation.findOne({ where: { id} });

    if (!evaluation) {
      return res.status(404).json({ success: false, error: "Évaluation non trouvée" });
    }

    // Update status in DB
    evaluation.status = "soumise"; // or another allowed value

    await evaluation.save();

    // Attach chief info/comments in memory only
    evaluation.dataValues.chiefComments = chiefComments;
    evaluation.dataValues.chiefValidation = true;

    return res.json({
      success: true,
      message: "Évaluation validée avec succès",
      evaluation
    });

  } catch (error) {
    console.error("Submit evaluation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
