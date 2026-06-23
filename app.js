const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Layout middleware: wrap rendered view in layout.ejs
app.use((req, res, next) => {
  const originalRender = res.render.bind(res);
  res.render = function (view, options, callback) {
    const opts = Object.assign({}, options || {});
    const layout = opts.layout !== false;
    if (layout) {
      originalRender(view, opts, (err, bodyHtml) => {
        if (err) { if (callback) return callback(err); return next(err); }
        opts.body = bodyHtml;
        originalRender('layout', opts, callback);
      });
    } else {
      originalRender(view, opts, callback);
    }
  };
  next();
});

app.use(session({
  secret: 'seo-keyword-analyzer-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 86400000 }
}));

// Routes
app.use('/', require('./routes/index'));
app.use('/keywords', require('./routes/keywords'));
app.use('/suggestions', require('./routes/keywords'));
app.use('/user', require('./routes/user'));
app.use('/competition', require('./routes/competition'));
app.use('/traffic', require('./routes/traffic'));
app.use('/history', require('./routes/history'));
app.use('/permission', require('./routes/permission'));

// 404
app.use((req, res) => {
  res.status(404).render('error', { message: '页面不存在' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: '服务器内部错误' });
});

module.exports = app;
