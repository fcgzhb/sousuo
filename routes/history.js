const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const { q, performance_trend } = req.query;

  let sql = 'SELECT * FROM data_history WHERE 1=1';
  const params = [];

  if (q) {
    sql += ' AND keyword LIKE ?';
    params.push(`%${q}%`);
  }
  if (performance_trend) {
    sql += ' AND performance_trend = ?';
    params.push(performance_trend);
  }

  sql += ' ORDER BY updated_at DESC';
  const records = db.prepare(sql).all(...params);
  res.render('history/list', { records, q, performance_trend });
});

router.get('/create', (req, res) => {
  res.render('history/form', { item: null, action: '/history/create' });
});

router.post('/create', (req, res) => {
  const db = req.app.locals.db;
  const { keyword, search_volume, click_through_rate, ranking, performance_trend, date_range, keyword_impact_score, notes } = req.body;

  db.prepare(`
    INSERT INTO data_history (keyword, search_volume, click_through_rate, ranking, performance_trend, date_range, keyword_impact_score, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    keyword,
    search_volume || 0,
    click_through_rate || 0,
    ranking || 0,
    performance_trend || '稳定',
    date_range || '',
    keyword_impact_score || 0,
    notes || ''
  );

  res.redirect('/history');
});

router.get('/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const item = db.prepare('SELECT * FROM data_history WHERE id = ?').get(req.params.id);
  if (!item) return res.redirect('/history');
  res.render('history/form', { item, action: `/history/edit/${item.id}` });
});

router.post('/edit/:id', (req, res) => {
  const db = req.app.locals.db;
  const { keyword, search_volume, click_through_rate, ranking, performance_trend, date_range, keyword_impact_score, notes } = req.body;

  db.prepare(`
    UPDATE data_history SET keyword=?, search_volume=?, click_through_rate=?, ranking=?, performance_trend=?, date_range=?, keyword_impact_score=?, notes=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `).run(
    keyword,
    search_volume || 0,
    click_through_rate || 0,
    ranking || 0,
    performance_trend || '稳定',
    date_range || '',
    keyword_impact_score || 0,
    notes || '',
    req.params.id
  );

  res.redirect('/history');
});

router.post('/delete/:id', (req, res) => {
  const db = req.app.locals.db;
  db.prepare('DELETE FROM data_history WHERE id = ?').run(req.params.id);
  res.redirect('/history');
});

module.exports = router;
