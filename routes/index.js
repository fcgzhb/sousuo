const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const db = req.app.locals.db;

  const keywordCount = db.prepare('SELECT COUNT(*) as cnt FROM keywords').get().cnt;
  const suggestionCount = db.prepare('SELECT COUNT(*) as cnt FROM suggestions').get().cnt;
  const userCount = db.prepare('SELECT COUNT(*) as cnt FROM users').get().cnt;
  const competitorCount = db.prepare('SELECT COUNT(*) as cnt FROM competitors').get().cnt;
  const trendCount = db.prepare('SELECT COUNT(*) as cnt FROM search_trends').get().cnt;
  const trafficCount = db.prepare('SELECT COUNT(*) as cnt FROM traffic_sources').get().cnt;
  const contentCount = db.prepare('SELECT COUNT(*) as cnt FROM content_strategies').get().cnt;
  const historyCount = db.prepare('SELECT COUNT(*) as cnt FROM data_history').get().cnt;
  const roleCount = db.prepare('SELECT COUNT(*) as cnt FROM roles').get().cnt;

  const topKeywords = db.prepare('SELECT * FROM keywords ORDER BY search_volume DESC LIMIT 5').all();
  const recentSuggestions = db.prepare('SELECT * FROM suggestions ORDER BY created_at DESC LIMIT 5').all();
  const risingTrends = db.prepare("SELECT * FROM search_trends WHERE trend_type = '上升' ORDER BY hot_score DESC LIMIT 5").all();

  res.render('index', {
    keywordCount,
    suggestionCount,
    userCount,
    competitorCount,
    trendCount,
    trafficCount,
    contentCount,
    historyCount,
    roleCount,
    topKeywords,
    recentSuggestions,
    risingTrends,
  });
});

module.exports = router;
