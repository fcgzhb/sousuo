const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const { q, status } = req.query;

  let sql = 'SELECT * FROM roles WHERE 1=1';
  const params = [];

  if (q) {
    sql += ' AND (role_name LIKE ? OR role_description LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  sql += ' ORDER BY updated_at DESC';
  const roles = db.prepare(sql).all(...params);
  res.render('permission/list', { roles, q, status });
});

router.get('/create', (req, res) => {
  res.render('permission/form', { item: null, action: '/permission/create' });
});

router.post('/create', (req, res) => {
  const db = req.app.locals.db;
  const { role_name, role_description, user_list, status } = req.body;

  db.prepare(`
    INSERT INTO roles (role_name, role_description, user_list, status)
    VALUES (?, ?, ?, ?)
  `).run(role_name, role_description || '', user_list || '', status || 'active');

  res.redirect('/permission');
});

router.get('/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const item = db.prepare('SELECT * FROM roles WHERE id = ?').get(req.params.id);
  if (!item) return res.redirect('/permission');
  res.render('permission/form', { item, action: `/permission/edit/${item.id}` });
});

router.post('/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const { role_name, role_description, user_list, status } = req.body;

  db.prepare(`
    UPDATE roles SET role_name=?, role_description=?, user_list=?, status=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(role_name, role_description || '', user_list || '', status || 'active', req.params.id);

  res.redirect('/permission');
});

router.post('/delete/:id', (req, res) => {
  const db = req.app.locals.db;
  db.prepare('DELETE FROM roles WHERE id = ?').run(req.params.id);
  res.redirect('/permission');
});

module.exports = router;
