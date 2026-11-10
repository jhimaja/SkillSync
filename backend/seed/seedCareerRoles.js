// This script fills the database with a starter list of career roles.
// Run it once using: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const CareerRole = require("../models/CareerRole");

const careerRoles = [
  {
    title: "Frontend Developer",
    category: "Web Development",
    description:
      "Builds the visual, interactive parts of websites and web applications that users see and click on.",
    requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Git", "Responsive Design"],
    averageSalaryINR: "4-8 LPA",
  },
  {
    title: "Backend Developer",
    category: "Web Development",
    description:
      "Builds the server, database and API logic that powers applications behind the scenes.",
    requiredSkills: ["Node.js", "Express.js", "MongoDB", "REST API", "JavaScript", "Git"],
    averageSalaryINR: "5-9 LPA",
  },
  {
    title: "Full Stack Developer",
    category: "Web Development",
    description:
      "Works across both frontend and backend, building complete end-to-end web applications.",
    requiredSkills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Git",
    ],
    averageSalaryINR: "6-12 LPA",
  },
  {
    title: "Data Analyst",
    category: "Data",
    description:
      "Collects, cleans and analyzes data to help organizations make better decisions.",
    requiredSkills: ["Excel", "SQL", "Python", "Data Visualization", "Statistics", "Power BI"],
    averageSalaryINR: "4-7 LPA",
  },
  {
    title: "Data Scientist",
    category: "Data",
    description:
      "Uses statistics, programming and machine learning to extract insights and build predictive models.",
    requiredSkills: ["Python", "Machine Learning", "Statistics", "SQL", "Pandas", "NumPy"],
    averageSalaryINR: "8-15 LPA",
  },
  {
    title: "Mobile App Developer",
    category: "Mobile Development",
    description:
      "Builds applications for Android and iOS devices using native or cross-platform frameworks.",
    requiredSkills: ["Java", "Kotlin", "React Native", "Flutter", "REST API", "Git"],
    averageSalaryINR: "5-10 LPA",
  },
  {
    title: "DevOps Engineer",
    category: "Infrastructure",
    description:
      "Automates and manages the deployment, scaling and monitoring of applications and servers.",
    requiredSkills: ["Linux", "Docker", "Kubernetes", "CI/CD", "AWS", "Git"],
    averageSalaryINR: "7-14 LPA",
  },
  {
    title: "UI/UX Designer",
    category: "Design",
    description:
      "Designs user interfaces and experiences that are easy, pleasant and intuitive to use.",
    requiredSkills: ["Figma", "Wireframing", "User Research", "Adobe XD", "Prototyping"],
    averageSalaryINR: "4-8 LPA",
  },
  {
    title: "QA / Test Engineer",
    category: "Quality Assurance",
    description:
      "Tests software applications to find bugs and ensure the product works as expected.",
    requiredSkills: ["Manual Testing", "Selenium", "Test Case Design", "SQL", "Postman"],
    averageSalaryINR: "4-7 LPA",
  },
  {
    title: "Cloud Engineer",
    category: "Infrastructure",
    description:
      "Designs, deploys and manages applications and infrastructure on cloud platforms.",
    requiredSkills: ["AWS", "Azure", "Linux", "Networking", "Docker", "Terraform"],
    averageSalaryINR: "6-12 LPA",
  },
  {
    title: "Machine Learning Engineer",
    category: "Data",
    description:
      "Builds and deploys machine learning models into real, production-ready applications.",
    requiredSkills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics", "Git"],
    averageSalaryINR: "8-16 LPA",
  },
  {
    title: "Cybersecurity Analyst",
    category: "Security",
    description:
      "Protects an organization's systems and data from cyber threats and security breaches.",
    requiredSkills: ["Networking", "Linux", "Ethical Hacking", "SIEM Tools", "Python"],
    averageSalaryINR: "5-10 LPA",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Remove old data first so we don't create duplicate entries every time
    // this script is run.
    await CareerRole.deleteMany();
    await CareerRole.insertMany(careerRoles);

    console.log(`Successfully seeded ${careerRoles.length} career roles!`);
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();
