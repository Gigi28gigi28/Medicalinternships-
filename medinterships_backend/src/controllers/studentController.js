const { Op } = require("sequelize");
const { User, Student, Internship, Application, Evaluation, Department, Establishment, Doctor, ServiceChief, Document } = require("../models/models");

// Helper to get student by user ID
const getStudentByUserId = async (id) => {
  return await User.findOne({ where: { id } });
};

// Dashboard
exports.getDashboard = async (req, res) => {
  try {
    // 1. Get the student user
    const student = await User.findByPk(req.user.id, {
      include: [
        { model: Establishment, as: "establishment" },
        { model: Department, as: "department" }
      ]
    });

    if (!student)
      return res.status(404).json({ status: "error", message: "Profil étudiant non trouvé" });

    // 2. Get last 5 applications
    const applications = await Application.findAll({
      where: { studentId: student.id },
      include: [
        { model: Internship, as: "internship" }
      ],
      order: [["appliedDate", "DESC"]],
      limit: 5
    });

    // 3. Application statistics
    const stats = {
      pending: await Application.count({
        where: { studentId: student.id, status: "en_attente" }
      }),
      accepted: await Application.count({
        where: { studentId: student.id, status: "acceptee" }
      }),
      rejected: await Application.count({
        where: { studentId: student.id, status: "refusee" }
      }),
      total: await Application.count({
        where: { studentId: student.id }
      })
    };

    // 4. Recommended internships
    const recommendedInternships = await Internship.findAll({
      where: {
        status: "actif",
        startDate: { [Op.gte]: new Date() }
      },
      include: [
        { model: Department, as: "department" },
        { model: Establishment, as: "establishment" },
        { model: User, as: "creator" }
      ],
      limit: 3,
      order: [["startDate", "ASC"]]
    });

    // 5. Final response
    res.status(200).json({
      status: "success",
      data: {
        student,
        applications,
        stats,
        recommendedInternships
      }
    });

  } catch (error) {
    console.error("student dashboard error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const student = await getStudentByUserId(req.user.id);
    res.status(200).json({ status: "success", data: { student } });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ status: "error", message: "Erreur lors du chargement du profil" });
  }
};

// Update Profile + Upload Document
exports.updateProfile = async (req, res) => {
  try {
    // 1. Get logged-in user (student)
    const student = await getStudentByUserId(req.user.id);

    if (!student) {
      return res.status(404).json({
        status: "error",
        message: "Profil étudiant non trouvé"
      });
    }

    // 2. Update basic fields
    const { phone } = req.body;

    if (phone) student.phone = phone;

    await student.save();

    // 3. If a file was uploaded, store it
    let uploadedDocument = null;

    if (req.file) {
      uploadedDocument = await Document.create({
        studentId: student.id,
        name: req.body.documentName || "Document",
        fileUrl: `/uploads/${req.file.filename}`,   
        originalName: req.file.originalname,
        fileSize: req.file.size
      });
      
    }

    // 4. Response
    res.status(200).json({
      status: "success",
      message: "Profil mis à jour avec succès",
      data: {
        student,
        document: uploadedDocument
      }
    });

  } catch (error) {
    console.error("doctor dashboard error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Other endpoints: getInternships, getInternshipDetails, applyToInternship, getApplications, cancelApplication, getEvaluations
// ... Keep your previous code for these, they are fine

exports.getInternships = async (req, res) => {
  try {
    const { departmentId, establishmentId, search, page = 1, limit = 10 } = req.query;
    const filter = { status: 'actif',  startDate: { [Op.gte]: new Date() } };

    if (departmentId) filter.departmentId = departmentId;
    if (establishmentId) filter.establishmentId = establishmentId;
    if (search) {
      filter[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const internships = await Internship.findAll({
      where: filter,
      include: [
        { model: Department, as: "department" },
        { model: Establishment, as: "establishment" },
        { model: User, as: "creator" } // correct alias
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });
    
    
    const total = await Internship.count({ where: filter });

    res.status(200).json({
      status: "success",
      data: {
        internships,
        pagination: { current: parseInt(page), pages: Math.ceil(total / limit), total },
      },
    });
  } catch (error) {
    console.error("doctor dashboard error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getInternshipDetails = async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id, {
      include: [
        { model: Department, as: "department" },
        { model: Establishment, as: "establishment" },
        { model: User, as: "creator" }, // the user who created the internship
      ],
    });

    if (!internship) 
      return res.status(404).json({ status: "error", message: "Stage non trouvé" });

    const student = await getStudentByUserId(req.user.id);
    if (!student)
      return res.status(404).json({ status: "error", message: "Profil étudiant non trouvé" });

    const existingApplication = await Application.findOne({
      where: { studentId: student.id, internshipId: internship.id },
    });

    res.status(200).json({ 
      status: "success", 
      data: { internship, hasApplied: !!existingApplication } 
    });
  } catch (error) {
    console.error("Internship details error:", error);
    res.status(500).json({ status: "error", message: "Erreur lors du chargement du stage" });
  }
};


exports.applyToInternship = async (req, res) => {
  try {
    const student = await getStudentByUserId(req.user.id);
    if (!student) 
      return res.status(404).json({ status: "error", message: "Profil étudiant non trouvé" });

    const { id } = req.params;

    const internship = await Internship.findByPk(id);
    if (!internship || !internship.status == 'actif' || internship.filledPlaces >= internship.totalPlaces) {
      return res.status(400).json({ status: "error", message: "Ce stage n'est plus disponible" });
    }

    const existingApplication = await Application.findOne({ 
      where: { studentId: student.id, internshipId: id } 
    });
    if (existingApplication) 
      return res.status(400).json({ status: "error", message: "Vous avez déjà postulé à ce stage" });

    const application = await Application.create({ 
      studentId: student.id, 
      internshipId: id, 
      status: "en_attente" // match enum in Application model
    });

    res.status(201).json({ status: "success", data: { application } });
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ status: "error", message: "Erreur lors de la candidature" });
  }
};


exports.getApplications = async (req, res) => {
  try {
    const student = await getStudentByUserId(req.user.id);
    if (!student) return res.status(404).json({ status: "error", message: "Profil étudiant non trouvé" });

    const { status, page = 1, limit = 10 } = req.query;

    const filter = { studentId: student.id };
    if (status) filter.status = status; // make sure status matches enum

    const applications = await Application.findAll({
      where: filter,
      include: [{ model: Internship, as: "internship" }],
      order: [["appliedDate", "DESC"]],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    const total = await Application.count({ where: filter });

    res.status(200).json({ 
      status: "success", 
      data: { 
        applications, 
        pagination: { current: parseInt(page), pages: Math.ceil(total / limit), total } 
      } 
    });
  } catch (error) {
    console.error("Applications error:", error);
    res.status(500).json({ status: "error", message: "Erreur lors du chargement des candidatures" });
  }
};

exports.cancelApplication = async (req, res) => {
  try {
    const student = await getStudentByUserId(req.user.id);
    if (!student) return res.status(404).json({ status: "error", message: "Profil étudiant non trouvé" });

    const { id } = req.params;

    const application = await Application.findOne({ 
      where: { id, studentId: student.id, status: "en_attente" } 
    });
    if (!application) 
      return res.status(404).json({ status: "error", message: "Candidature non trouvée ou ne peut pas être annulée" });

    application.status = "annulee"; // match enum
    await application.save();

    res.status(200).json({ status: "success", message: "Candidature annulée avec succès" });
  } catch (error) {
    console.error("Cancel application error:", error);
    res.status(500).json({ status: "error", message: "Erreur lors de l'annulation" });
  }
};

exports.getEvaluations = async (req, res) => {
  try {
    const student = await getStudentByUserId(req.user.id);
    if (!student) return res.status(404).json({ status: "error", message: "Profil étudiant non trouvé" });

    const evaluations = await Evaluation.findAll({
      where: { studentId: student.id },
      include: [
        { model: Internship, as: "internship" },
        { model: User, as: "doctor" } // only doctor exists in associations
      ],
      order: [["submissionDate", "DESC"]],
    });

    res.status(200).json({ status: "success", data: { evaluations } });
  } catch (error) {
    console.error("Evaluations error:", error);
    res.status(500).json({ status: "error", message: "Erreur lors du chargement des évaluations" });
  }
};
