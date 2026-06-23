const express = require('express');
const router = express.Router();

// ========== 流量来源 CRUD ==========

router.get('/sources', (req, res) => {
  const db = req.app.locals.db;
  const { q, source_type } = req.query;

  let sql = 'SELECT * FROM traffic_sources WHERE 1=1';
  const params = [];

  if (q) {
    sql += ' AND source_name LIKE ?';
    params.push(`%${q}%`);
  }
  if (source_type) {
    sql += ' AND source_type = ?';
    params.push(source_type);
  }

  sql += ' ORDER BY updated_at DESC';
  const sources = db.prepare(sql).all(...params);
  res.render('traffic/sources', { sources, q, source_type });
});

router.get('/sources/create', (req, res) => {
  res.render('traffic/sources-form', { item: null, action: '/traffic/sources/create' });
});

router.post('/sources/create', (req, res) => {
  const db = req.app.locals.db;
  const { source_type, source_name, is_active, start_date, channels, description } = req.body;

  db.prepare(`
    INSERT INTO traffic_sources (source_type, source_name, is_active, start_date, channels, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    source_type,
    source_name || '',
    is_active ? 1 : 0,
    start_date || '',
    channels || '',
    description || ''
  );

  res.redirect('/traffic/sources');
});

router.get('/sources/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const item = db.prepare('SELECT * FROM traffic_sources WHERE id = ?').get(req.params.id);
  if (!item) return res.redirect('/traffic/sources');
  res.render('traffic/sources-form', { item, action: `/traffic/sources/edit/${item.id}` });
});

router.post('/sources/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const { source_type, source_name, is_active, start_date, channels, description } = req.body;

  db.prepare(`
    UPDATE traffic_sources SET source_type=?, source_name=?, is_active=?, start_date=?, channels=?, description=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(
    source_type,
    source_name || '',
    is_active ? 1 : 0,
    start_date || '',
    channels || '',
    description || '',
    req.params.id
  );

  res.redirect('/traffic/sources');
});

router.post('/sources/delete/:id', (req, res) => {
  const db = req.app.locals.db;
  db.prepare('DELETE FROM traffic_sources WHERE id = ?').run(req.params.id);
  res.redirect('/traffic/sources');
});

// ========== 内容策略 CRUD ==========

router.get('/content', (req, res) => {
  const db = req.app.locals.db;
  const { q } = req.query;

  let sql = 'SELECT * FROM content_strategies WHERE 1=1';
  const params = [];

  if (q) {
    sql += ' AND content_title LIKE ?';
    params.push(`%${q}%`);
  }

  sql += ' ORDER BY updated_at DESC';
  const contents = db.prepare(sql).all(...params);
  res.render('traffic/content', { contents, q });
});

router.get('/content/create', (req, res) => {
  res.render('traffic/content-form', { item: null, action: '/traffic/content/create' });
});

router.post('/content/create', (req, res) => {
  const db = req.app.locals.db;
  const { content_title, content_description, target_audience, content_type, content_formats, publish_date, performance_metrics, strategy_score } = req.body;

  db.prepare(`
    INSERT INTO content_strategies (content_title, content_description, target_audience, content_type, content_formats, publish_date, performance_metrics, strategy_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    content_title,
    content_description || '',
    target_audience || '',
    content_type || '',
    content_formats || '',
    publish_date || '',
    performance_metrics || '',
    strategy_score || 0
  );

  res.redirect('/traffic/content');
});

router.get('/content/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const item = db.prepare('SELECT * FROM content_strategies WHERE id = ?').get(req.params.id);
  if (!item) return res.redirect('/traffic/content');
  res.render('traffic/content-form', { item, action: `/traffic/content/edit/${item.id}` });
});

router.post('/content/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const { content_title, content_description, target_audience, content_type, content_formats, publish_date, performance_metrics, strategy_score } = req.body;

  db.prepare(`
    UPDATE content_strategies SET content_title=?, content_description=?, target_audience=?, content_type=?, content_formats=?, publish_date=?, performance_metrics=?, strategy_score=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(
    content_title,
    content_description || '',
    target_audience || '',
    content_type || '',
    content_formats || '',
    publish_date || '',
    performance_metrics || '',
    strategy_score || 0,
    req.params.id
  );

  res.redirect('/traffic/content');
});

router.post('/content/delete/:id', (req, res) => {
  const db = req.app.locals.db;
  db.prepare('DELETE FROM content_strategies WHERE id = ?').run(req.params.id);
  res.redirect('/traffic/content');
});

module.exports = router;
