const express = require('express');
const path = require('path');
const rootPath = __dirname;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.set('port', '8000');
app.set('view engine', 'pug');
app.set('views', path.join(rootPath, './views'));

app.use('/', express.static(path.join(rootPath, '/public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies
app.use(cookieParser());
app.use(session({
  secret: 'amarpassword',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
}));
app.use(require('connect-flash')());

/*Middlewares*/
app.use(require('./middlewares/flash.js'));


app.get('/', function(req, res) {
  return res.render('home');
});

require('./controllers/cassandraTableDetailsController').addRouter(app);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('*', function(req, res) {
  return res.status(404).send('Page not found\n');
});


app.listen(app.get('port'), function() {
  console.log(`Server running at port ${app.get('port')}`);
});
