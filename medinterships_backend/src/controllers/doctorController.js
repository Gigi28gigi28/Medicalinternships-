const { Op } = require("sequelize");
const { User, Doctor, Student, Evaluation, Application, Internship, Department, Establishment } = require("../models/models");

exports.getDashboard = async (req, res) => {
  try {
    const doctor = await User.findOne({
      where: { id: req.user.id },
      include: [
        { model: Department, as: "department" },
        { model: Establishment, as: "establishment" }
      ]
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: "Profil médecin non trouvé"
      });
    }

    // Students supervised by this doctor
    const supervisedStudents = await User.findAll({
      where: { role: "student" },
      include: [
        {
          model: Evaluation,
          as: "evaluationsReceived",
          where: { doctorId: doctor.id },
          required: false
        }
      ]
    });

    // Pending evaluations
    const pendingEvaluations = await Evaluation.findAll({
      where: {
        doctorId: doctor.id,
        status: "En attente"
      },
      include: [
        { model: User, as: "student" },
        { model: User, as: "doctor" },
        { model: Internship, as: "internship" }
      ],
      limit: 5
    });

    // Completed evaluations
    const completedEvaluations = await Evaluation.findAll({
      where: {
        doctorId: doctor.id,
        status: "Soumise"
      },
      include: [
        { model: User, as: "student" },
        { model: User, as: "doctor" },
        { model: Internship, as: "internship" }
      ]
    });

    res.status(200).json({
      status: "success",
      data: {
        doctor,
        supervisedStudents,
        pendingEvaluations,
        completedEvaluations,
        title: "Tableau de Bord Médecin Superviseur"
      }
    });

  } catch (error) {
    console.error("doctor dashboard error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.getStudents = async (req, res) => {
  try {
    const doctor = await User.findOne({ where: { id: req.user.id } });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: "Doctor profile not found",
      });
    }

    // 1. Find internships supervised by the doctor
    const internships = await Internship.findAll({
      where: {
        departmentId: doctor.departmentId,
        establishmentId: doctor.establishmentId,
      },
    });

    const internshipIds = internships.map(i => i.id);

    if (internshipIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No internships found for this doctor",
      });
    }

    // 2. Get accepted applications with correct includes
    const applications = await Application.findAll({
      where: {
        internshipId: { [Op.in]: internshipIds },
        status: "Acceptée",
      },
      include: [
        { model: User, as: "student" },        // Correct association
        { model: Internship, as: "internship" } // FIXED alias
      ],
      order: [["appliedDate", "DESC"]],
    });

    // 3. Build JSON response
    const students = applications.map(app => ({
      student: app.student,       // FIX: lowercase because alias is "student"
      internship: app.internship, // FIX: matches alias "internship"
      application: app,
    }));

    return res.status(200).json({
      success: true,
      data: students,
      title: "Étudiants Supervisés",
    });

  } catch (error) {
    console.error("Students error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


exports.getStudentDetails = async (req, res) => {
  try {
    // Find the student by ID
    const student = await User.findByPk(req.params.id);

    if (!student || student.role !== "student") {
      return res.status(404).json({
        success: false,
        message: "Étudiant non trouvé",
      });
    }

    // Find the current accepted internship for this student
    const application = await Application.findOne({
      where: { studentId: student.id, status: "Acceptée" },
      include: [
        {
          model: Internship,
          as: "internship",  // <-- use the correct alias
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        student,
        internship: application ? application.internship : null,
      },
      title: `Profil de ${student.firstName} ${student.lastName}`,
    });
  } catch (error) {
    console.error("Student details error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du chargement du profil étudiant",
      error: error.message,
    });
  }
};

exports.getEvaluations = async (req, res) => {
  try {
    const doctor = await User.findOne({ where: { id: req.user.id } });
    const { status } = req.query;

    const filter = { doctorId: doctor.id };
    if (status) filter.status = status;

    const evaluations = await Evaluation.findAll({
      where: filter,
      include: [
        { model: User, as: "student" },       // Use the alias defined in your association
        { model: Internship, as: "internship" } // Correct alias
      ],
      order: [["submissionDate", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: evaluations,
      filters: { status },
      title: "Mes Évaluations",
    });
  } catch (error) {
    console.error("Evaluations error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du chargement des évaluations",
      error: error.message,
    });
  }
};

// Controller: doctorController.js

exports.createEvaluation = async (req, res) => {
  try {
  const doctor = await User.findByPk(req.user.id);
  
 
  const { applicationId } = req.params;
  
  // Include correct aliases: Student and Internship
  const application = await Application.findByPk(applicationId, {
    include: [
      { model: User, as: "student" },
      { model: Internship, as: "internship" },
    ],
  });
  
  if (!application || application.status !== "acceptee") {
    return res.status(404).json({
      success: false,
      error: "Candidature non trouvée ou non acceptée",
    });
  }
  
  // Check if evaluation already exists
  let evaluation = await Evaluation.findOne({
    where: {
      studentId: application.studentId,
      internshipId: application.internshipId,
      doctorId: doctor.id,
    },
  });
  
  if (!evaluation) {
    evaluation = await Evaluation.create({
      studentId: application.studentId,
      internshipId: application.internshipId,
      doctorId: doctor.id,
      status: "en_attente",
    });
  }
  
  res.json({
    success: true,
    data: {
      evaluation,
      student: application.student,
      internship: application.internship,
    },
    message: "Évaluation créée avec succès",
  });

  
  } catch (error) {
  console.error("Create evaluation error:", error);
  res.status(500).json({ success: false, error: error.message });
  }
  };
  
  exports.submitEvaluation = async (req, res) => {
  try {
  const doctor = await User.findByPk(req.user.id);
  const { id } = req.params;
  const { attendance, practicalSkills, professionalBehavior, doctorComments } = req.body;
  
 
  const evaluation = await Evaluation.findOne({
    where: { id, doctorId: doctor.id },
  });
  
  if (!evaluation) {
    return res.status(404).json({ success: false, error: "Évaluation non trouvée" });
  }
  
evaluation.attendance = parseFloat(attendance);
evaluation.practicalSkills = parseFloat(practicalSkills);
evaluation.professionalBehavior = parseFloat(professionalBehavior);
evaluation.comments = doctorComments;
evaluation.status = null;;
evaluation.submissionDate = new Date();
evaluation.score = (evaluation.attendance + evaluation.practicalSkills + evaluation.professionalBehavior) / 3;

await evaluation.save();
  res.json({ success: true, message: "Évaluation soumise avec succès" });
 
  
  } catch (error) {
  console.error("Submit evaluation error:", error);
  res.status(500).json({ success: false, error: error.message });
  }
  };
  