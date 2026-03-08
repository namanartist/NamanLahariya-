import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './server/db';
import http from 'http';

const app = express();
const server = http.createServer(app);
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Public Routes
app.get('/api/projects', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects').all();
  res.json(projects.map((p: any) => ({ ...p, tech: JSON.parse(p.tech) })));
});

app.get('/api/skills', (req, res) => {
  const skills = db.prepare('SELECT * FROM skills').all();
  // Group skills by category
  const groupedSkills: any = {};
  skills.forEach((skill: any) => {
    if (!groupedSkills[skill.category]) {
      groupedSkills[skill.category] = {
        title: skill.category,
        icon: skill.iconName,
        skills: []
      };
    }
    groupedSkills[skill.category].skills.push(skill.name);
  });
  res.json(Object.values(groupedSkills));
});

app.get('/api/journey', (req, res) => {
  const education = db.prepare('SELECT * FROM education').all();
  const experience = db.prepare('SELECT * FROM experience').all();
  res.json({ education, experience });
});

app.get('/api/certifications', (req, res) => {
  const certs = db.prepare('SELECT * FROM certifications').all();
  res.json(certs);
});

app.get('/api/articles', (req, res) => {
  const articles = db.prepare('SELECT * FROM articles').all();
  res.json(articles);
});

app.get('/api/articles/:id', (req, res) => {
  const { id } = req.params;
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ message: 'Article not found' });
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  const stmt = db.prepare('INSERT INTO inquiries (name, email, subject, message) VALUES (?, ?, ?, ?)');
  stmt.run(name, email, subject, message);
  res.json({ message: 'Message sent successfully' });
});

app.post('/api/ai/send-interest', (req, res) => {
  const { clientName, clientEmail, interestDetails } = req.body;
  
  // In a real app, you would use a service like Resend, SendGrid, or Nodemailer here.
  // For this demo, we'll log it and return success.
  console.log('--- NEW CLIENT INTEREST FROM AI ASSISTANT ---');
  console.log(`From: ${clientName} (${clientEmail})`);
  console.log(`Details: ${interestDetails}`);
  console.log('---------------------------------------------');

  // Also save to inquiries table so it shows up in admin
  const stmt = db.prepare('INSERT INTO inquiries (name, email, subject, message) VALUES (?, ?, ?, ?)');
  stmt.run(clientName, clientEmail, 'AI Assistant Lead', interestDetails);

  res.json({ 
    success: true, 
    message: 'Interest sent to Naman Lahariya successfully. He will get back to you soon!' 
  });
});

// Protected Admin Routes
app.get('/api/admin/inquiries', authenticateToken, (req, res) => {
  const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY date DESC').all();
  res.json(inquiries);
});

// Generic CRUD endpoints for admin
const createCrudEndpoints = (table: string) => {
  app.get(`/api/admin/${table}`, authenticateToken, (req, res) => {
    const items = db.prepare(`SELECT * FROM ${table}`).all();
    // Parse JSON fields if necessary
    if (table === 'projects') {
        res.json(items.map((p: any) => ({ ...p, tech: JSON.parse(p.tech) })));
    } else {
        res.json(items);
    }
  });

  app.post(`/api/admin/${table}`, authenticateToken, (req, res) => {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body).map(v => (typeof v === 'object' ? JSON.stringify(v) : v));
    const placeholders = keys.map(() => '?').join(',');
    const stmt = db.prepare(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`);
    const info = stmt.run(...values);
    res.json({ id: info.lastInsertRowid, ...req.body });
  });

  app.put(`/api/admin/${table}/:id`, authenticateToken, (req, res) => {
    const { id } = req.params;
    const keys = Object.keys(req.body);
    const values = Object.values(req.body).map(v => (typeof v === 'object' ? JSON.stringify(v) : v));
    const setClause = keys.map(k => `${k} = ?`).join(',');
    const stmt = db.prepare(`UPDATE ${table} SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);
    res.json({ id, ...req.body });
  });

  app.delete(`/api/admin/${table}/:id`, authenticateToken, (req, res) => {
    const { id } = req.params;
    db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
    res.json({ message: 'Deleted successfully' });
  });
};

createCrudEndpoints('projects');
createCrudEndpoints('education');
createCrudEndpoints('experience');
createCrudEndpoints('certifications');
createCrudEndpoints('articles');
// Skills are a bit different because of the grouping structure in the frontend, 
// but for admin we can just manage the raw rows.
createCrudEndpoints('skills'); 


// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static('dist'));

    // Handle SPA routing - serve index.html for all non-API routes
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
