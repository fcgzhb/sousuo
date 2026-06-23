const { initDatabase } = require('./db/init');
const { seedDatabase } = require('./db/seed');
const app = require('./app');

const PORT = process.env.PORT || 3000;

const db = initDatabase();
seedDatabase(db);

// Share db instance via app locals
app.locals.db = db;

app.listen(PORT, () => {
  console.log(`SEO Keyword Analyzer running at http://localhost:${PORT}`);
});
