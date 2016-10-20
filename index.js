const express = require('express');
const path = require('path');
const rootPath = __dirname;
const jsonfile = require('jsonfile');
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

app.get('/cassandra-table-details', function(req, res, next) {
  jsonfile.readFile(path.join(rootPath, 'models/cassandraTableDetailsModel.json'), function(err, obj) {
    if (err) return next(err);
    return res.render('cassandraTableDetails', obj);
  });
});

app.get('/cassandra-table-details/insert', function(req, res, next) {
  return res.render('cassandraTableDetailsInsert');
});

app.post('/cassandra-table-details/insert', function(req, res, next) {
  const file = path.join(rootPath, 'models/cassandraTableDetailsModel.json');
  jsonfile.readFile(file, function(err, obj) {
    if (err) return next(err);
    const newObj = req.body;
    ///Before pushing check if such a table name already exists
    const exist = obj.data.findIndex(function(x) {
      if (x.name === newObj.name) return true;
      else return false;
    });

    if (exist > -1) {
      req.flash('error', 'Table name already exists');
      return res.redirect('/cassandra-table-details');
    }
    obj.data.push(newObj);
    jsonfile.writeFile(file, obj, function(err) {
      if (err) return next(err);
      req.flash('success', 'Table successfully entered');
      return res.redirect('/cassandra-table-details');
    })
  });
});

app.listen(app.get('port'), function() {
  console.log(`Server running at port ${app.get('port')}`);
})
