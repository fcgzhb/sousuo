const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const { q, status } = req.query;

  let sql = 'SELECT * FROM users WHERE 1=1';
  const params = [];

  if (q) {
    sql += ' AND (username LIKE ? OR email LIKE ? OR phone LIKE ?)';
    params.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  sql += ' ORDER BY updated_at DESC';

  const users = db.prepare(sql).all(...params);
  res.render('user/list', { users, q, status });
});

router.get('/create', (req, res) => {
  res.render('user/form', { item: null, action: '/user/create' });
});

router.post('/create', (req, res) => {
  const db = req.app.locals.db;
  const { username, email, phone, role, status } = req.body;

  db.prepare(`
    INSERT INTO users (username, email, phone, role, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(username, email || '', phone || '', role || 'user', status || 'active');

  res.redirect('/user');
});

router.get('/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const item = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!item) return res.redirect('/user');
  res.render('user/form', { item, action: `/user/edit/${item.id}` });
});

router.post('/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const { username, email, phone, role, status } = req.body;

  db.prepare(`
    UPDATE users SET username=?, email=?, phone=?, role=?, status=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(username, email || '', phone || '', role || 'user', status || 'active', req.params.id);

  res.redirect('/user');
});

router.post('/delete/:id', (req, res) => {
  const db = req.app.locals.db;
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.redirect('/user');
});

module.exports = router;
