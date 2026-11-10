/**
 * SKILL CATALOG
 * ---------------------------------------------------------------------------
 * For every skill SkillSync knows about, this file stores the information the
 * ROADMAP BUILDER needs:
 *
 *   hours          - rough number of study hours to reach "job-ready basics"
 *   prerequisites  - skills that are best learned BEFORE this one
 *   project        - a small practical project that proves the skill
 *   resources      - free places to learn it
 *
 * To support a new skill, just add one more entry here (and, if you want it
 * to be verifiable, add questions for it in challengeBank.js).
 *
 * NOTE: resources with type "Search" are search links instead of a fixed
 * course, because good free material for those topics changes often.
 */

const search = (q) => ({
  title: `Search: ${q}`,
  url: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
  type: "Search",
});

const skillCatalog = {
  // ---------- WEB ----------
  HTML: {
    hours: 10,
    prerequisites: [],
    project: "Build a multi-section personal portfolio page using semantic HTML only.",
    resources: [{ title: "MDN: Learn HTML", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML", type: "Docs" }],
  },
  CSS: {
    hours: 15,
    prerequisites: ["HTML"],
    project: "Style your portfolio page with Flexbox and Grid, and add a dark mode.",
    resources: [{ title: "MDN: Learn CSS", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS", type: "Docs" }],
  },
  JavaScript: {
    hours: 30,
    prerequisites: ["HTML"],
    project: "Build a to-do app with add, delete, filter and local persistence.",
    resources: [{ title: "The Modern JavaScript Tutorial", url: "https://javascript.info/", type: "Tutorial" }],
  },
  React: {
    hours: 25,
    prerequisites: ["JavaScript", "CSS"],
    project: "Build a weather or movie-search app that calls a public API and uses hooks.",
    resources: [{ title: "React: Learn", url: "https://react.dev/learn", type: "Docs" }],
  },
  Git: {
    hours: 6,
    prerequisites: [],
    project: "Create a GitHub repo, make 10+ meaningful commits, and merge a feature branch with a pull request.",
    resources: [{ title: "Pro Git (free book)", url: "https://git-scm.com/book/en/v2", type: "Book" }],
  },
  "Responsive Design": {
    hours: 8,
    prerequisites: ["CSS"],
    project: "Make your portfolio look great on a phone, tablet and laptop using media queries.",
    resources: [{ title: "web.dev: Learn Responsive Design", url: "https://web.dev/learn/design", type: "Course" }],
  },
  "Node.js": {
    hours: 20,
    prerequisites: ["JavaScript"],
    project: "Write a command-line tool in Node.js that reads a file and prints statistics about it.",
    resources: [{ title: "Node.js: Learn", url: "https://nodejs.org/en/learn", type: "Docs" }],
  },
  "Express.js": {
    hours: 15,
    prerequisites: ["Node.js"],
    project: "Build a notes API with routes, middleware and error handling.",
    resources: [{ title: "Express: Getting started", url: "https://expressjs.com/en/starter/installing.html", type: "Docs" }],
  },
  MongoDB: {
    hours: 12,
    prerequisites: [],
    project: "Model a blog (users, posts, comments) and write queries with filters and sorting.",
    resources: [{ title: "MongoDB University", url: "https://learn.mongodb.com/", type: "Course" }],
  },
  "REST API": {
    hours: 10,
    prerequisites: [],
    project: "Design the endpoints for a library system, then document them in a README.",
    resources: [{ title: "REST API Tutorial", url: "https://restfulapi.net/", type: "Tutorial" }],
  },

  // ---------- DATA ----------
  Excel: {
    hours: 15,
    prerequisites: [],
    project: "Clean a messy sales sheet and build a PivotTable summary with a chart.",
    resources: [{ title: "Microsoft Excel help & learning", url: "https://support.microsoft.com/en-us/excel", type: "Docs" }],
  },
  SQL: {
    hours: 18,
    prerequisites: [],
    project: "Answer 15 business questions on a sample database using JOIN, GROUP BY and subqueries.",
    resources: [{ title: "SQLBolt interactive lessons", url: "https://sqlbolt.com/", type: "Interactive" }],
  },
  Python: {
    hours: 30,
    prerequisites: [],
    project: "Write a script that reads a CSV file and prints a summary report.",
    resources: [{ title: "The Python Tutorial", url: "https://docs.python.org/3/tutorial/", type: "Docs" }],
  },
  "Data Visualization": {
    hours: 10,
    prerequisites: ["Python"],
    project: "Create 5 different charts from a public dataset and explain what each one shows.",
    resources: [{ title: "Matplotlib tutorials", url: "https://matplotlib.org/stable/tutorials/index.html", type: "Docs" }],
  },
  Statistics: {
    hours: 20,
    prerequisites: [],
    project: "Analyse a small dataset: mean, median, spread, and one hypothesis test.",
    resources: [{ title: "Khan Academy: Statistics & Probability", url: "https://www.khanacademy.org/math/statistics-probability", type: "Course" }],
  },
  "Power BI": {
    hours: 15,
    prerequisites: ["Excel"],
    project: "Build an interactive sales dashboard with slicers and a DAX measure.",
    resources: [{ title: "Microsoft Learn: Power BI", url: "https://learn.microsoft.com/en-us/power-bi/", type: "Docs" }],
  },
  "Machine Learning": {
    hours: 40,
    prerequisites: ["Python", "Statistics"],
    project: "Train and evaluate a model that predicts house prices, then report its error.",
    resources: [{ title: "scikit-learn tutorials", url: "https://scikit-learn.org/stable/tutorial/index.html", type: "Docs" }],
  },
  Pandas: {
    hours: 12,
    prerequisites: ["Python"],
    project: "Clean a real-world dataset: handle missing values, fix types, and group results.",
    resources: [{ title: "pandas: Getting started", url: "https://pandas.pydata.org/docs/getting_started/index.html", type: "Docs" }],
  },
  NumPy: {
    hours: 8,
    prerequisites: ["Python"],
    project: "Re-implement mean, standard deviation and normalisation using only NumPy arrays.",
    resources: [{ title: "NumPy: Learn", url: "https://numpy.org/learn/", type: "Docs" }],
  },
  TensorFlow: {
    hours: 25,
    prerequisites: ["Machine Learning"],
    project: "Train an image classifier on a small dataset and save the model.",
    resources: [{ title: "TensorFlow tutorials", url: "https://www.tensorflow.org/tutorials", type: "Docs" }],
  },

  // ---------- MOBILE ----------
  Java: {
    hours: 35,
    prerequisites: [],
    project: "Build a console-based bank account app with classes, interfaces and collections.",
    resources: [{ title: "Dev.java: Learn", url: "https://dev.java/learn/", type: "Docs" }],
  },
  Kotlin: {
    hours: 20,
    prerequisites: ["Java"],
    project: "Rebuild your Java console app in Kotlin using data classes and null safety.",
    resources: [{ title: "Kotlin docs: Getting started", url: "https://kotlinlang.org/docs/getting-started.html", type: "Docs" }],
  },
  "React Native": {
    hours: 25,
    prerequisites: ["React"],
    project: "Build a two-screen mobile app with navigation and a list loaded from an API.",
    resources: [{ title: "React Native: Getting started", url: "https://reactnative.dev/docs/getting-started", type: "Docs" }],
  },
  Flutter: {
    hours: 30,
    prerequisites: [],
    project: "Build a notes app with a list screen, an edit screen and local state.",
    resources: [{ title: "Flutter: Get started", url: "https://docs.flutter.dev/get-started", type: "Docs" }],
  },

  // ---------- INFRASTRUCTURE ----------
  Linux: {
    hours: 15,
    prerequisites: [],
    project: "Write a shell script that backs up a folder and logs what it did.",
    resources: [{ title: "Linux Journey", url: "https://linuxjourney.com/", type: "Interactive" }],
  },
  Docker: {
    hours: 12,
    prerequisites: ["Linux"],
    project: "Containerise your Express + MongoDB app with a Dockerfile and docker-compose.",
    resources: [{ title: "Docker: Get started", url: "https://docs.docker.com/get-started/", type: "Docs" }],
  },
  Kubernetes: {
    hours: 25,
    prerequisites: ["Docker"],
    project: "Deploy a containerised app to a local cluster with 3 replicas and a Service.",
    resources: [{ title: "Kubernetes Basics", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", type: "Tutorial" }],
  },
  "CI/CD": {
    hours: 10,
    prerequisites: ["Git"],
    project: "Add a GitHub Actions workflow that runs tests on every push.",
    resources: [{ title: "GitHub Actions docs", url: "https://docs.github.com/en/actions", type: "Docs" }],
  },
  AWS: {
    hours: 25,
    prerequisites: ["Linux"],
    project: "Host a static site on S3 and run a small app on an EC2 instance.",
    resources: [{ title: "AWS: Getting started", url: "https://aws.amazon.com/getting-started/", type: "Docs" }],
  },
  Azure: {
    hours: 25,
    prerequisites: [],
    project: "Deploy a web app to Azure App Service and store files in Blob Storage.",
    resources: [{ title: "Microsoft Learn: Azure training", url: "https://learn.microsoft.com/en-us/training/azure/", type: "Course" }],
  },
  Networking: {
    hours: 20,
    prerequisites: [],
    project: "Use ping, traceroute and Wireshark to trace what happens when you open a website.",
    resources: [{ title: "Cloudflare Learning Center", url: "https://www.cloudflare.com/learning/", type: "Tutorial" }],
  },
  Terraform: {
    hours: 15,
    prerequisites: ["AWS"],
    project: "Provision a VPC and one EC2 instance entirely from Terraform files.",
    resources: [{ title: "HashiCorp: Terraform tutorials", url: "https://developer.hashicorp.com/terraform/tutorials", type: "Course" }],
  },

  // ---------- DESIGN ----------
  Figma: {
    hours: 12,
    prerequisites: [],
    project: "Design a 4-screen mobile app using components and Auto Layout.",
    resources: [{ title: "Figma Help Center", url: "https://help.figma.com/", type: "Docs" }],
  },
  Wireframing: {
    hours: 6,
    prerequisites: [],
    project: "Sketch low-fidelity wireframes for a food-delivery app's main flow.",
    resources: [search("wireframing for beginners")],
  },
  "User Research": {
    hours: 10,
    prerequisites: [],
    project: "Interview 5 people about how they do a daily task and summarise the pain points.",
    resources: [search("user research methods for beginners")],
  },
  "Adobe XD": {
    hours: 10,
    prerequisites: ["Wireframing"],
    project: "Turn your wireframes into a clickable prototype using artboards and Repeat Grid.",
    resources: [search("Adobe XD tutorial for beginners")],
  },
  Prototyping: {
    hours: 10,
    prerequisites: ["Wireframing", "Figma"],
    project: "Build a clickable prototype and run a usability test with 3 people.",
    resources: [search("interactive prototyping in Figma tutorial")],
  },

  // ---------- QUALITY ASSURANCE ----------
  "Manual Testing": {
    hours: 12,
    prerequisites: [],
    project: "Test a public website and report 5 bugs with clear steps to reproduce.",
    resources: [search("manual software testing tutorial for beginners")],
  },
  Selenium: {
    hours: 20,
    prerequisites: ["Manual Testing"],
    project: "Automate a login + search flow on a demo site with explicit waits.",
    resources: [{ title: "Selenium documentation", url: "https://www.selenium.dev/documentation/", type: "Docs" }],
  },
  "Test Case Design": {
    hours: 8,
    prerequisites: ["Manual Testing"],
    project: "Write 20 test cases for a login form using boundary values and equivalence classes.",
    resources: [search("test case design techniques boundary value equivalence partitioning")],
  },
  Postman: {
    hours: 6,
    prerequisites: ["REST API"],
    project: "Create a Postman collection with tests for every endpoint of your own API.",
    resources: [{ title: "Postman Learning Center", url: "https://learning.postman.com/docs/getting-started/introduction/", type: "Docs" }],
  },

  // ---------- SECURITY ----------
  "Ethical Hacking": {
    hours: 35,
    prerequisites: ["Networking", "Linux"],
    project: "Complete 3 beginner machines on a legal practice platform and write up your steps.",
    resources: [search("ethical hacking for beginners free course")],
  },
  "SIEM Tools": {
    hours: 15,
    prerequisites: ["Networking"],
    project: "Ingest sample logs into a free SIEM and build one alert for repeated failed logins.",
    resources: [search("SIEM tutorial for beginners Splunk free")],
  },
};

// Lets us look a skill up without worrying about capital letters.
// e.g. "react", "React" and " REACT " all find the same entry.
const lowerCaseIndex = {};
Object.keys(skillCatalog).forEach((name) => {
  lowerCaseIndex[name.toLowerCase()] = name;
});

// Returns the official spelling of a skill name, or null if we don't know it.
const getCanonicalSkillName = (name = "") => lowerCaseIndex[name.trim().toLowerCase()] || null;

// Returns catalog info for a skill. Unknown skills get safe default values
// so the roadmap never crashes on a skill we haven't catalogued yet.
const getSkillInfo = (name) => {
  const canonical = getCanonicalSkillName(name);
  if (canonical) return { name: canonical, known: true, ...skillCatalog[canonical] };
  return {
    name,
    known: false,
    hours: 10,
    prerequisites: [],
    project: `Build a small project that uses ${name}.`,
    resources: [search(`learn ${name} for beginners`)],
  };
};

module.exports = { skillCatalog, getCanonicalSkillName, getSkillInfo };
