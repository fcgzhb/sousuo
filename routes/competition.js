const express = require('express');
const router = express.Router();

// ========== 竞争对手 CRUD ==========

router.get('/competitors', (req, res) => {
  const db = req.app.locals.db;
  const { q } = req.query;

  let sql = 'SELECT * FROM competitors WHERE 1=1';
  const params = [];

  if (q) {
    sql += ' AND (name LIKE ? OR website_url LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }

  sql += ' ORDER BY updated_at DESC';
  const competitors = db.prepare(sql).all(...params);
  res.render('competition/competitors', { competitors, q });
});

router.get('/competitors/create', (req, res) => {
  res.render('competition/competitors-form', { item: null, action: '/competition/competitors/create' });
});

router.post('/competitors/create', (req, res) => {
  const db = req.app.locals.db;
  const { name, website_url, industry, location, is_active, keywords, analysis_notes } = req.body;

  db.prepare(`
    INSERT INTO competitors (name, website_url, industry, location, is_active, keywords, analysis_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    name,
    website_url || '',
    industry || '',
    location || '',
    is_active ? 1 : 0,
    keywords || '',
    analysis_notes || ''
  );

  res.redirect('/competition/competitors');
});

router.get('/competitors/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const item = db.prepare('SELECT * FROM competitors WHERE id = ?').get(req.params.id);
  if (!item) return res.redirect('/competition/competitors');
  res.render('competition/competitors-form', { item, action: `/competition/competitors/edit/${item.id}` });
});

router.post('/competitors/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const { name, website_url, industry, location, is_active, keywords, analysis_notes } = req.body;

  db.prepare(`
    UPDATE competitors SET name=?, website_url=?, industry=?, location=?, is_active=?, keywords=?, analysis_notes=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(
    name,
    website_url || '',
    industry || '',
    location || '',
    is_active ? 1 : 0,
    keywords || '',
    analysis_notes || '',
    req.params.id
  );

  res.redirect('/competition/competitors');
});

router.post('/competitors/delete/:id', (req, res) => {
  const db = req.app.locals.db;
  db.prepare('DELETE FROM competitors WHERE id = ?').run(req.params.id);
  res.redirect('/competition/competitors');
});

// ========== 搜索趋势 CRUD ==========

router.get('/trends', (req, res) => {
  const db = req.app.locals.db;
  const { q, trend_type } = req.query;

  let sql = 'SELECT * FROM search_trends WHERE 1=1';
  const params = [];

  if (q) {
    sql += ' AND keyword LIKE ?';
    params.push(`%${q}%`);
  }
  if (trend_type) {
    sql += ' AND trend_type = ?';
    params.push(trend_type);
  }

  sql += ' ORDER BY updated_at DESC';
  const trends = db.prepare(sql).all(...params);
  res.render('competition/trends', { trends, q, trend_type });
});

router.get('/trends/create', (req, res) => {
  res.render('competition/trends-form', { item: null, action: '/competition/trends/create' });
});

router.post('/trends/create', (req, res) => {
  const db = req.app.locals.db;
  const { keyword, region, trend_date, search_volume, related_keywords, trend_type, hot_score, analysis_notes } = req.body;

  db.prepare(`
    INSERT INTO search_trends (keyword, region, trend_date, search_volume, related_keywords, trend_type, hot_score, analysis_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    keyword,
    region || '',
    trend_date || '',
    search_volume || 0,
    related_keywords || '',
    trend_type || '稳定',
    hot_score || 0,
    analysis_notes || ''
  );

  res.redirect('/competition/trends');
});

router.get('/trends/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const item = db.prepare('SELECT * FROM search_trends WHERE id = ?').get(req.params.id);
  if (!item) return res.redirect('/competition/trends');
  res.render('competition/trends-form', { item, action: `/competition/trends/edit/${item.id}` });
});

router.post('/trends/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const { keyword, region, trend_date, search_volume, related_keywords, trend_type, hot_score, analysis_notes } = req.body;

  db.prepare(`
    UPDATE search_trends SET keyword=?, region=?, trend_date=?, search_volume=?, related_keywords=?, trend_type=?, hot_score=?, analysis_notes=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(
    keyword,
    region || '',
    trend_date || '',
    search_volume || 0,
    related_keywords || '',
    trend_type || '稳定',
    hot_score || 0,
    analysis_notes || '',
    req.params.id
  );

  res.redirect('/competition/trends');
});

router.post('/trends/delete/:id', (req, res) => {
  const db = req.app.locals.db;
  db.prepare('DELETE FROM search_trends WHERE id = ?').run(req.params.id);
  res.redirect('/competition/trends');
});

module.exports = router;
