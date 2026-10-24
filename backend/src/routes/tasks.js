const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Converte a string JSON de subtarefas de volta para array
    const parsedRows = rows.map(row => ({
      ...row,
      subtasks: JSON.parse(row.subtasks || '[]')
    }));
    res.json(parsedRows);
  });
});

router.post('/', (req, res) => {
  const { title, description, category, priority, image_url, due_date, subtasks } = req.body;
  if (!title) return res.status(400).json({ error: 'O título é obrigatório' });
  
  db.run(
    'INSERT INTO tasks (title, description, category, priority, image_url, due_date, subtasks) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, description || '', category || 'Geral', priority || 'Média', image_url || '', due_date || null, JSON.stringify(subtasks || [])],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, title, done: 0 });
    }
  );
});

router.put('/:id', (req, res) => {
  const { title, description, category, priority, image_url, due_date, subtasks } = req.body;
  db.run(
    'UPDATE tasks SET title = ?, description = ?, category = ?, priority = ?, image_url = ?, due_date = ?, subtasks = ? WHERE id = ?',
    [title, description, category, priority, image_url, due_date, JSON.stringify(subtasks || []), req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Tarefa atualizada' });
    }
  );
});

router.patch('/:id', (req, res) => {
  const { done } = req.body;
  const completedAt = done ? new Date().toISOString() : null;
  db.run(
    'UPDATE tasks SET done = ?, completed_at = ? WHERE id = ?',
    [done ? 1 : 0, completedAt, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Status atualizado' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

module.exports = router;