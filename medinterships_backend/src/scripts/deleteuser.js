require('dotenv').config({ path: __dirname + '/../../.env' });

const {
  sequelize,
  User,
  Establishment,
  Department,
  Internship,
  Application,
  Evaluation,
  Document,
  Admin,
  Dean
} = require("../models/models");

async function deleteAll() {
  try {
    console.log("🔹 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connected");

    console.log("🗑️ Deleting ALL data from all tables...");
    await Dean.destroy({where : {}});
    await Application.destroy({ where: {} });
    await Evaluation.destroy({ where: {} });
    await Document.destroy({ where: {} });
    await Internship.destroy({ where: {} });
    await Department.destroy({ where: {} });
    await Establishment.destroy({ where: {} });
    await Admin.destroy({ where: {} });
    await User.destroy({ where: {} });
    

    console.log("🧹 All tables cleared successfully!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Delete error:", err);
    process.exit(1);
  }
}

deleteAll();
