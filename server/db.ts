import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

// Use /tmp for SQLite on Vercel/Serverless as the main filesystem is read-only
const dbPath = process.env.VERCEL 
  ? path.join('/tmp', 'portfolio.db') 
  : path.resolve(process.cwd(), 'portfolio.db');

// If on Vercel and the DB doesn't exist in /tmp, we might want to copy the initial one if it exists in the project root
if (process.env.VERCEL && !fs.existsSync(dbPath)) {
  const rootDbPath = path.resolve(process.cwd(), 'portfolio.db');
  if (fs.existsSync(rootDbPath)) {
    try {
      fs.copyFileSync(rootDbPath, dbPath);
    } catch (e) {
      console.error('Failed to copy DB to /tmp:', e);
    }
  }
}

let db: any;
try {
  db = new Database(dbPath);
} catch (e) {
  console.error('Failed to initialize database:', e);
  // Fallback to in-memory if file fails
  db = new Database(':memory:');
}

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    description TEXT,
    tech TEXT, -- JSON string array
    demoLink TEXT,
    githubLink TEXT
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT, -- Languages, Frontend, Backend, Tools, Core Concepts, Specialization
    name TEXT,
    iconName TEXT -- Store lucide icon name as string
  );

  CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT,
    title TEXT,
    subtitle TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year TEXT,
    title TEXT,
    subtitle TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    issuer TEXT,
    link TEXT
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    excerpt TEXT,
    date TEXT,
    author TEXT,
    content TEXT
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    date TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Admin User if not exists
const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
if (!adminUser) {
  const hashedPassword = bcrypt.hashSync('admin123', 10); // Default password
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hashedPassword);
}

// Seed Initial Data if tables are empty
const projectCount = db.prepare('SELECT count(*) as count FROM projects').get() as { count: number };
if (projectCount.count === 0) {
  const insertProject = db.prepare('INSERT INTO projects (title, category, description, tech, demoLink, githubLink) VALUES (?, ?, ?, ?, ?, ?)');
  
  insertProject.run(
    "CleanUp App - SIH Team MacHack Project",
    "Mobile Apps",
    "AI-powered smart waste management application featuring waste classification, real-time garbage vehicle tracking, and automated digital challan generation. Implemented a Green Points ecosystem to encourage citizen participation.",
    JSON.stringify(["AI/ML", "Geolocation", "React Native", "Node.js"]),
    "https://clean-up-eea39809.base44.app/",
    "https://github.com/namanartist"
  );
  
  insertProject.run(
    "Optimization of Tank Material Usage using Calculus",
    "Web Development",
    "Applied differential calculus to optimize tank dimensions, minimizing material usage while maintaining required volume. Developed mathematical models to achieve cost-efficient and structurally optimal designs.",
    JSON.stringify(["Calculus", "C++", "Optimization", "Modeling"]),
    "https://drive.google.com/file/d/14Uy3gxO3UKVFWD2vjh7aPZDBr6UJwFtd/view",
    "https://github.com/namanartist"
  );

  insertProject.run(
    "Modern Portfolio Website",
    "Web Development",
    "A responsive, dark-themed portfolio website built with React, Tailwind CSS, and Framer Motion. Features smooth animations and a clean UI.",
    JSON.stringify(["React", "Tailwind CSS", "Framer Motion"]),
    "#",
    "https://github.com/namanartist"
  );
}

const educationCount = db.prepare('SELECT count(*) as count FROM education').get() as { count: number };
if (educationCount.count === 0) {
  const insertEdu = db.prepare('INSERT INTO education (year, title, subtitle, description) VALUES (?, ?, ?, ?)');
  insertEdu.run("2025 - 2029", "B.Tech, Mathematics and Computing", "Madhav Institute of Technology and Science", "Pursuing undergraduate degree with a focus on computational mathematics.");
  insertEdu.run("2023 - 2025", "Higher Secondary (12th)", "Bright Convent Hr. Sec. School", "Completed with focus on Science and Mathematics.");
  insertEdu.run("2021 - 2023", "Secondary School (10th)", "The Radiant Hr. Sec. School", "Completed with academic excellence.");
}

const experienceCount = db.prepare('SELECT count(*) as count FROM experience').get() as { count: number };
if (experienceCount.count === 0) {
  const insertExp = db.prepare('INSERT INTO experience (year, title, subtitle, description) VALUES (?, ?, ?, ?)');
  insertExp.run("2026 - Present", "Campus Ambassador", "INTERSHALA", "Leading campus initiatives and promoting student opportunities.");
  insertExp.run("2025", "Digital Marketing Intern", "Corizo Edutech Pvt. Ltd.", "Managed digital campaigns and analyzed engagement metrics.");
}

const certCount = db.prepare('SELECT count(*) as count FROM certifications').get() as { count: number };
if (certCount.count === 0) {
  const insertCert = db.prepare('INSERT INTO certifications (title, issuer, link) VALUES (?, ?, ?)');
  insertCert.run("Software Engineering Job Simulation", "The Forage", "https://www.theforage.com/completion-certificates/Sj7temL583QAYpHXD/E6McHJDKsQYh79moz_Sj7temL583QAYpHXD_69a7c4dbf44d771db9856097_1772603982134_completion_certificate.pdf");
  insertCert.run("Cyber Job Simulation", "The Forage", "https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/E9pA6qsdbeyEkp3ti_9PBTqmSxAf6zZTseP_69a7c4dbf44d771db9856097_1772605652041_completion_certificate.pdf");
}

const articleCount = db.prepare('SELECT count(*) as count FROM articles').get() as { count: number };
if (articleCount.count === 0) {
  const insertArticle = db.prepare('INSERT INTO articles (title, excerpt, date, author, content) VALUES (?, ?, ?, ?, ?)');
  
  insertArticle.run(
    "The Future of AI in Web Development",
    "Exploring how artificial intelligence is reshaping the way we build and interact with websites.",
    "March 15, 2026",
    "Naman Lahariya",
    `
      Artificial Intelligence is rapidly transforming the landscape of web development. From automated code generation to intelligent user interfaces, AI is enabling developers to build faster, smarter, and more personalized web experiences.

      ## The Rise of AI-Powered Tools
      Tools like GitHub Copilot and ChatGPT are already assisting developers in writing code, debugging, and optimizing performance. These tools are not replacing developers but empowering them to focus on higher-level problem-solving.

      ## Personalized User Experiences
      AI algorithms can analyze user behavior in real-time to deliver personalized content and recommendations. This level of customization was previously difficult to achieve but is now becoming a standard expectation.

      ## Conclusion
      As AI continues to evolve, it will undoubtedly play an even more significant role in web development. Embracing these technologies is crucial for staying ahead in the industry.
    `
  );

  insertArticle.run(
    "Optimizing React Applications for Performance",
    "Key strategies and best practices for building high-performance React applications.",
    "February 28, 2026",
    "Naman Lahariya",
    `
      Performance is a critical factor in the success of any web application. In the React ecosystem, there are several strategies developers can employ to ensure their apps run smoothly.

      ## Code Splitting
      Code splitting allows you to split your code into small chunks which you can then load on demand. This significantly reduces the initial load time of your application.

      ## Memoization
      Using hooks like useMemo and useCallback can prevent unnecessary re-renders, which is a common source of performance bottlenecks in React apps.

      ## Virtualization
      For applications that render long lists of data, virtualization can be a game-changer. Libraries like react-window only render the items that are currently visible on the screen.
    `
  );

  insertArticle.run(
    "Understanding Mathematical Modeling in Tech",
    "How mathematical concepts are applied to solve complex problems in software engineering.",
    "January 10, 2026",
    "Naman Lahariya",
    `
      Mathematical modeling is the process of using mathematical structures to represent real-world situations. In the tech industry, this is used for everything from algorithm design to system optimization.

      ## Algorithms and Complexity
      Understanding Big O notation and algorithmic complexity is fundamental to writing efficient code. It allows developers to predict how their code will perform as data sets grow.

      ## Data Science and Machine Learning
      At the heart of data science and machine learning lies linear algebra, calculus, and probability. These mathematical foundations enable computers to learn from data and make predictions.
    `
  );
}

// Seed Skills
const skillsCount = db.prepare('SELECT count(*) as count FROM skills').get() as { count: number };
if (skillsCount.count === 0) {
  const insertSkill = db.prepare('INSERT INTO skills (category, name, iconName) VALUES (?, ?, ?)');
  
  const skillsData = [
    { category: "Languages", skills: ['C++', 'JavaScript', 'Java', 'Python'], icon: "Code2" },
    { category: "Frontend", skills: ['HTML5', 'CSS3', 'React', 'Tailwind CSS'], icon: "Layout" },
    { category: "Backend", skills: ['Node.js', 'Express', 'SQL', 'MongoDB'], icon: "Database" },
    { category: "Tools", skills: ['Git', 'GitHub', 'VS Code', 'Postman'], icon: "Terminal" },
    { category: "Core Concepts", skills: ['Data Structures', 'Algorithms', 'OOPs', 'DBMS'], icon: "Cpu" },
    { category: "Specialization", skills: ['Mathematics', 'Computing', 'Optimization', 'Problem Solving'], icon: "Brain" }
  ];

  skillsData.forEach(group => {
    group.skills.forEach(skill => {
      insertSkill.run(group.category, skill, group.icon);
    });
  });
}

export default db;
