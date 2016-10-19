const express = require('express');
const path = require('path');
const rootPath = __dirname;

const app = express();

app.set('port', '8000');
app.set('view engine', 'pug');
app.set('views', path.join(rootPath, './views'));
app.use('/', express.static(path.join(rootPath, '/public')));


app.get('/', function(req, res) {
  return res.render('home');
});

app.listen(app.get('port'), function() {
  console.log(`Server running at port ${app.get('port')}`);
})
