const express = require('express');
const router = express.Router();

// ========== 关键词库 CRUD ==========

router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const { q, status } = req.query;

  let sql = 'SELECT * FROM keywords WHERE 1=1';
  const params = [];

  if (q) {
    sql += ' AND (keyword LIKE ? OR id = ?)';
    params.push(`%${q}%`, q);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  sql += ' ORDER BY updated_at DESC';

  const keywords = db.prepare(sql).all(...params);
  res.render('keywords/list', { keywords, q, status });
});

router.get('/create', (req, res) => {
  res.render('keywords/form', { item: null, action: '/keywords/create' });
});

router.post('/create', (req, res) => {
  const db = req.app.locals.db;
  const { keyword, search_volume, competition_level, status, tags, notes } = req.body;

  db.prepare(`
    INSERT INTO keywords (keyword, search_volume, competition_level, status, tags, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(keyword, search_volume || 0, competition_level || '', status || 'active', tags || '', notes || '');

  res.redirect('/keywords');
});

router.get('/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const item = db.prepare('SELECT * FROM keywords WHERE id = ?').get(req.params.id);
  if (!item) return res.redirect('/keywords');
  res.render('keywords/form', { item, action: `/keywords/edit/${item.id}` });
});

router.post('/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const { keyword, search_volume, competition_level, status, tags, notes } = req.body;

  db.prepare(`
    UPDATE keywords SET keyword=?, search_volume=?, competition_level=?, status=?, tags=?, notes=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(keyword, search_volume || 0, competition_level || '', status || 'active', tags || '', notes || '', req.params.id);

  res.redirect('/keywords');
});

router.post('/delete/:id', (req, res) => {
  const db = req.app.locals.db;
  db.prepare('DELETE FROM keywords WHERE id = ?').run(req.params.id);
  res.redirect('/keywords');
});

// ========== 优化建议 CRUD ==========

router.get('/suggestions', (req, res) => {
  const db = req.app.locals.db;
  const { q, status } = req.query;

  let sql = 'SELECT s.*, k.keyword AS kw_name FROM suggestions s LEFT JOIN keywords k ON s.keyword_id = k.id WHERE 1=1';
  const params = [];

  if (q) {
    sql += ' AND (s.keyword LIKE ? OR s.suggestion LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }
  if (status) {
    sql += ' AND s.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY s.updated_at DESC';

  const suggestions = db.prepare(sql).all(...params);
  res.render('suggestions/list', { suggestions, q, status });
});

router.get('/suggestions/create', (req, res) => {
  const db = req.app.locals.db;
  const keywords = db.prepare('SELECT * FROM keywords ORDER BY keyword').all();
  res.render('suggestions/form', { item: null, keywords, action: '/suggestions/create' });
});

router.post('/suggestions/create', (req, res) => {
  const db = req.app.locals.db;
  const { keyword_id, keyword, priority_level, suggestion, performance_metrics, status, notes } = req.body;

  db.prepare(`
    INSERT INTO suggestions (keyword_id, keyword, priority_level, suggestion, performance_metrics, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    keyword_id || null,
    keyword || '',
    priority_level || '中',
    suggestion || '',
    performance_metrics || '',
    status || 'pending',
    notes || ''
  );

  res.redirect('/suggestions');
});

router.get('/suggestions/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const item = db.prepare('SELECT * FROM suggestions WHERE id = ?').get(req.params.id);
  const keywords = db.prepare('SELECT * FROM keywords ORDER BY keyword').all();
  if (!item) return res.redirect('/suggestions');
  res.render('suggestions/form', { item, keywords, action: `/suggestions/edit/${item.id}` });
});

router.post('/suggestions/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const { keyword_id, keyword, priority_level, suggestion, performance_metrics, status, notes } = req.body;

  db.prepare(`
    UPDATE suggestions SET keyword_id=?, keyword=?, priority_level=?, suggestion=?, performance_metrics=?, status=?, notes=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(
    keyword_id || null,
    keyword || '',
    priority_level || '中',
    suggestion || '',
    performance_metrics || '',
    status || 'pending',
    notes || '',
    req.params.id
  );

  res.redirect('/suggestions');
});

router.post('/suggestions/delete/:id', (req, res) => {
  const db = req.app.locals.db;
  db.prepare('DELETE FROM suggestions WHERE id = ?').run(req.params.id);
  res.redirect('/suggestions');
});

module.exports = router;
