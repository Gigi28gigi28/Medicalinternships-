const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false,
    validate: { isEmail: true }
  },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM("student", "service_chief", "doctor", "dean"),
    allowNull: false,
  },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  phone: DataTypes.STRING,
  profilePhoto: DataTypes.STRING,
  establishmentId: { 
    type: DataTypes.UUID, 
    allowNull: true,
    references: {
      model: 'Establishments',
      key: 'id'
    }
  },
  departmentId: { 
    type: DataTypes.UUID, 
    allowNull: true,
    references: {
      model: 'Departments',
      key: 'id'
    }
  },
  // Student-specific fields
  level: {
    type: DataTypes.ENUM("2eme_annee", "3eme_annee", "4eme_annee", "5eme_annee", "6eme_annee"),
    allowNull: true,
  },
  specialty: DataTypes.STRING,
  registrationDate: DataTypes.DATE,
  
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  lastLogin: DataTypes.DATE,
}, {
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['role'] },
    { fields: ['establishmentId'] },
    { fields: ['departmentId'] }
  ]
});

const bcrypt = require('bcryptjs');

// Hash password before saving new user
User.beforeCreate(async (user, options) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});

// Hash password before updating user password
User.beforeUpdate(async (user, options) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});






/////////////////////////////////////////
const Establishment = sequelize.define("Establishment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  address: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    validate: { isEmail: true }
  },
  website: DataTypes.STRING,
  type: {
    type: DataTypes.ENUM("CHU", "Clinique", "Hopital", "Polyclinique"),
  },
  departmentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalStudents: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  timestamps: true
});










////////////////////////////////////
const Department = sequelize.define("Department", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  establishmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Establishments',
      key: 'id'
    }
  },
  chiefId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  totalPlaces: { type: DataTypes.INTEGER, defaultValue: 0 },
  availablePlaces: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  timestamps: true,
  indexes: [
    { fields: ['establishmentId'] },
    { fields: ['chiefId'] }
  ]
});










///////////////////////////////////////
const Internship = sequelize.define("Internship", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  departmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Departments',
      key: 'id'
    }
  },
  establishmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Establishments',
      key: 'id'
    }
  },
  totalPlaces: { type: DataTypes.INTEGER, allowNull: false },
  filledPlaces: { type: DataTypes.INTEGER, defaultValue: 0 },
  duration: DataTypes.STRING,
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
  requirements: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM("actif", "complet", "archive", "cloture"),
    defaultValue: "actif",
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Dean',
      key: 'id'
    }
  },
  chiefId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['departmentId'] },
    { fields: ['establishmentId'] },
    { fields: ['status'] },
    { fields: ['createdBy'] }
  ]
});










////////////////////////////////////////
const Application = sequelize.define("Application", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  internshipId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Internships',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM("en_attente", "acceptee", "refusee", "annulee"),
    defaultValue: "en_attente",
  },
  appliedDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  motivationLetter: DataTypes.TEXT,
  cv: DataTypes.STRING,
  responseDate: DataTypes.DATE,
  rejectionReason: DataTypes.TEXT,
}, {
  timestamps: true,
  indexes: [
    { fields: ['studentId'] },
    { fields: ['internshipId'] },
    { fields: ['status'] },
    { unique: true, fields: ['studentId', 'internshipId'] }
  ]
});











///////////////////////////////////////
const Evaluation = sequelize.define("Evaluation", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  internshipId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Internships',
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM("en_attente", "en_cours", "soumise"),
    defaultValue: "en_attente",
  },
  startDate: DataTypes.DATE,
  dueDate: DataTypes.DATE,
  submissionDate: DataTypes.DATE,
  score: { 
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 100 }
  },
  comments: DataTypes.TEXT,
  evaluationForm: DataTypes.JSON,
}, {
  timestamps: true,
  indexes: [
    { fields: ['studentId'] },
    { fields: ['internshipId'] },
    { fields: ['doctorId'] }
  ]
});







//////////////////////////////////////
const Document = sequelize.define("Document", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  name: { type: DataTypes.STRING, allowNull: false },
  fileUrl: { type: DataTypes.STRING, allowNull: false },
  fileSize: DataTypes.INTEGER,
  mimeType: DataTypes.STRING,
  uploadedDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  timestamps: true,
  indexes: [
    { fields: ['studentId'] }
  ]
});





////////////////////////////////////////
const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM("success", "warning", "error", "info"),
    defaultValue: "info",
  },
  title: DataTypes.STRING,
  message: { type: DataTypes.STRING, allowNull: false },
  relatedEntityType: DataTypes.STRING,
  relatedEntityId: DataTypes.UUID,
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  readAt: DataTypes.DATE,
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['isRead'] }
  ]
});





////////////////////////////////////////
const Admin = sequelize.define("Admin", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  permissions: DataTypes.JSON,
}, {
  timestamps: true
});


const Dean = sequelize.define("Dean", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  phone: DataTypes.STRING,
}, {
  timestamps: true
});
// Associations

// User associations
User.belongsTo(Establishment, { foreignKey: "establishmentId", as: "establishment" });
Establishment.hasMany(User, { foreignKey: "establishmentId", as: "users" });

User.belongsTo(Department, { foreignKey: "departmentId", as: "department" });
Department.hasMany(User, { foreignKey: "departmentId", as: "users" });

// Department chief
Department.belongsTo(User, { foreignKey: "chiefId", as: "chief" });
User.hasMany(Department, { foreignKey: "chiefId", as: "managedDepartments" });

// Establishment and Department
Establishment.hasMany(Department, { foreignKey: "establishmentId", as: "departments" });
Department.belongsTo(Establishment, { foreignKey: "establishmentId", as: "establishment" });

// Internship associations
Establishment.hasMany(Internship, { foreignKey: "establishmentId", as: "internships" });
Internship.belongsTo(Establishment, { foreignKey: "establishmentId", as: "establishment" });



Department.hasMany(Internship, { foreignKey: "departmentId", as: "internships" });
Internship.belongsTo(Department, { foreignKey: "departmentId", as: "department" });

Internship.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
User.hasMany(Internship, { foreignKey: "createdBy", as: "createdInternships" });

// Application associations
User.hasMany(Application, { foreignKey: "studentId", as: "applications" });
Application.belongsTo(User, { foreignKey: "studentId", as: "student" });

Internship.hasMany(Application, { foreignKey: "internshipId", as: "applications" });
Application.belongsTo(Internship, { foreignKey: "internshipId", as: "internship" });

// Evaluation associations
User.hasMany(Evaluation, { foreignKey: "studentId", as: "evaluationsReceived" });
Evaluation.belongsTo(User, { foreignKey: "studentId", as: "student" });

User.hasMany(Evaluation, { foreignKey: "doctorId", as: "evaluationsGiven" });
Evaluation.belongsTo(User, { foreignKey: "doctorId", as: "doctor" });

Internship.hasMany(Evaluation, { foreignKey: "internshipId", as: "evaluations" });
Evaluation.belongsTo(Internship, { foreignKey: "internshipId", as: "internship" });

// Document associations
User.hasMany(Document, { foreignKey: "studentId", as: "documents" });
Document.belongsTo(User, { foreignKey: "studentId", as: "student" });

// Notification associations
User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

// Admin associations
Admin.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Admin, { foreignKey: "userId", as: "adminProfile" });

Dean.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Dean, { foreignKey: "userId", as: "deanProfile" });

Dean.hasMany(Internship, { foreignKey: "createdBy", as: "createdInternships" });
Internship.belongsTo(Dean, { foreignKey: "createdBy", as: "creatorDean" });

// Compare password with hashed password
User.prototype.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update lastLogin timestamp
User.prototype.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};



module.exports = {
  sequelize,
  User,
  Establishment,
  Department,
  Internship,
  Application,
  Evaluation,
  Document,
  Notification,
  Admin,
  Dean,
};