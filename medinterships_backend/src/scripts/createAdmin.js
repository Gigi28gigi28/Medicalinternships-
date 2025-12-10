require('dotenv').config({ path: __dirname + '/../../.env' });

const { sequelize, User, Establishment, Department, Internship, Application, Evaluation, Document, Admin ,Dean} = require("../models/models");

async function seedAll() {
try {
console.log("🔹 Connecting to database...");
await sequelize.authenticate();
console.log("✅ Database connected");

/*
const Admin = User.create({ "email": "admin@gmail.com", "password": "admin123", "role": "dean", "firstName": "Admin", "lastName": "User" });
await Admin;
console.log("👑 Admin user created.");
console.log("🎉 Seeding complete!"); 

console.log("creating students");
const student = User.create({ "email": "student2@gmail.com", "password": "student123", "role": "student", "firstName": "Student2", "lastName": "User2" });
await student;
*/

/*
console.log("creating students");
const student1 = User.create({ "email": "student1@gmail.com", "password": "student123", "role": "student", "firstName": "Student1", "lastName": "User1" });
await student1;
console.log("👨‍🎓 Student user created.");
*/
/*
const doctor = User.create({ "email": "doctor@gmail.com", "password": "doctor123", "role": "doctor", "firstName": "Doctor", "lastName": "User" });
await doctor;
console.log("👨‍⚕️ Doctor user created.");

async function seedDean() {
    const [user, created] = await User.findOrCreate({
      where: { email: "admin@gmail.com" },
      defaults: {
        firstName: "Admin",
        lastName: "User",
        email: "admin@gmail.com",
        password: "admin123", // will be hashed by beforeCreate hook
        role: "dean",
        isActive: true
      }
    });
  
    console.log(`Admin user ${created ? "created" : "already exists"}`);
  
    // Then create the Dean profile
    const [dean, deanCreated] = await Dean.findOrCreate({
      where: { userId: user.id },
      defaults: {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: null
      }
    });
  
    console.log(`Dean profile ${deanCreated ? "created" : "already exists"}`);
  }*/
 // seedDean().then(() => process.exit()).catch(console.error);


 // Sync database (ONLY alter, NOT force)


 console.log("Creating Establishments...");
 // --- Create Establishments ---
 const est1 = await Establishment.create({
   name: "CHU Constantine",
   city: "Constantine",
   address: "Route Ain El Bey",
   phone: "031123456",
   email: "contact@chu-constantine.dz",
   website: "https://chu-constantine.dz",
   type: "CHU",
 });

 const est2 = await Establishment.create({
   name: "Clinique Ibn Sina",
   city: "Alger",
   address: "Hydra, Alger",
   phone: "021123456",
   email: "contact@ibnsina.dz",
   website: "https://ibnsina.dz",
   type: "Clinique",
 });

 console.log("Establishments created!");

 console.log("Creating Departments...");

 // --- Departments for Establishment 1 ---
 await Department.bulkCreate([
   {
     name: "Cardiologie",
     description: "Département de cardiologie",
     establishmentId: est1.id,
     totalPlaces: 20,
     availablePlaces: 20,
   },
   {
     name: "Chirurgie",
     description: "Département de chirurgie générale",
     establishmentId: est1.id,
     totalPlaces: 15,
     availablePlaces: 15,
   }
 ]);

 // --- Departments for Establishment 2 ---
 await Department.bulkCreate([
   {
     name: "Pédiatrie",
     description: "Département pour enfants",
     establishmentId: est2.id,
     totalPlaces: 25,
     availablePlaces: 25,
   },
   {
     name: "Dermatologie",
     description: "Département de peau et allergies",
     establishmentId: est2.id,
     totalPlaces: 10,
     availablePlaces: 10,
   }
 ]);

 console.log("Departments created successfully!");

 process.exit();


} catch (err) {
console.error("❌ Seeding error:", err);
process.exit(1);
}
}

seedAll();
