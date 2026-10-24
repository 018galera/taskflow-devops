const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'O título é obrigatório' });
  }
  db.run('INSERT INTO tasks (title) VALUES (?)', [title], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title, done: 0 });
  });
});

router.patch('/:id', (req, res) => {
  const { done } = req.body;
  const completedAt = done ? new Date().toISOString() : null;
  
  db.run(
    'UPDATE tasks SET done = ?, completed_at = ? WHERE id = ?',
    [done ? 1 : 0, completedAt, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });
      res.json({ message: 'Atualizada com sucesso' });
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.status(204).send();
  });
});

module.exports = router;