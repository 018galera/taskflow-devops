const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_URL || './data/taskflow.db';
const absolutePath = path.resolve(dbPath);

const dir = path.dirname(absolutePath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new sqlite3.Database(absolutePath, (err) => {
  if (err) console.error('Erro ao abrir banco:', err.message);
  else console.log(`✅ Conectado ao SQLite: ${absolutePath}`);
});

db.serialize(() => {
  // Recriando a tabela com suporte a Subtarefas (JSON) e Imagem Base64
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'Geral',
      priority TEXT DEFAULT 'Média',
      image_url TEXT,
      due_date DATE,
      subtasks TEXT DEFAULT '[]',
      done INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    )
  `);
});

module.exports = db;