const jobRoles = {

  Engineering: [
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Developer",
    "AI Engineer",
    "DevOps Engineer",
    "QA Engineer",
  ],

  Fashion: [
    "Fashion Designer",
    "Leather Product Designer",
    "Textile Designer",
    "Merchandiser",
  ],

  Finance: [
    "Financial Analyst",
    "Accountant",
    "Auditor",
    "Investment Analyst",
  ],

  Electronics: [
    "Embedded Engineer",
    "Hardware Engineer",
    "PCB Designer",
    "IoT Engineer",
  ],

  Biotech: [
    "Research Associate",
    "Lab Technician",
    "Bioinformatics Engineer",
    "Microbiologist",
  ],

};

function getDepartments() {
    return Object.keys(jobRoles);
}

function getJobRolesByDepartment(department) {
    return jobRoles[department] || [];
}

module.exports = {
    jobRoles,
    getDepartments,
    getJobRolesByDepartment,
};