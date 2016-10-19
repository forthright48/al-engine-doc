const express = require('express');
const path = require('path');
const rootPath = __dirname;
const jsonfile = require('jsonfile');


const app = express();

app.set('port', '8000');
app.set('view engine', 'pug');
app.set('views', path.join(rootPath, './views'));
app.use('/', express.static(path.join(rootPath, '/public')));


app.get('/', function(req, res) {
  return res.render('home');
});

app.get('/cassandra-table-details', function(req, res, next) {
  jsonfile.readFile(path.join(rootPath, 'models/cassandraTableDetailsModel.json'), function(err, obj) {
    if (err) return next(err);
    return res.render('cassandraTableDetails', obj);
  })
});

app.listen(app.get('port'), function() {
  console.log(`Server running at port ${app.get('port')}`);
})
