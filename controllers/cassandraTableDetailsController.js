const express = require('express');
const jsonfile = require('jsonfile');
const path = require('path');
const rootPath = require('config').rootPath;

const router = express.Router();
const tableFile = path.join(rootPath, 'models/cassandraTableDetailsModel.json');

router.get('/', function(req, res, next) {
  jsonfile.readFile(path.join(rootPath, 'models/cassandraTableDetailsModel.json'), function(err, obj) {
    if (err) return next(err);
    return res.render('cassandraTableDetails/cassandraTableDetails', obj);
  });
});

router.get('/insert', function(req, res) {
  return res.render('cassandraTableDetails/cassandraTableDetailsInsert');
});

router.post('/insert', function(req, res, next) {
  const tableFile = path.join(rootPath, 'models/cassandraTableDetailsModel.json');
  jsonfile.readFile(tableFile, function(err, obj) {
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

    obj.data.push(newObj); ///Insert into json object
    obj.data.sort(sortTableDetails);

    jsonfile.writeFile(tableFile, obj, function(err) {
      if (err) return next(err);
      req.flash('success', 'Table successfully entered');
      return res.redirect('/cassandra-table-details');
    });
  });
});

router.get('/edit/:tableName', function(req, res, next) {
  const tableName = req.params.tableName;

  jsonfile.readFile(tableFile, function(err, obj) {
    const editItem = obj.data.find(function(table) {
      if (table.name === tableName) return true;
      else return false;
    });
    if (!editItem) return next(new Error('No such table found in model'));

    return res.render('cassandraTableDetails/cassandraTableDetailsEdit', editItem);
  });
});

router.post('/edit/:tableName', function(req, res, next) {
  const tableName = req.params.tableName;
  const newItem = req.body;

  jsonfile.readFile(tableFile, function(err, obj) {
    const pos = obj.data.findIndex(function(table) {
      if (table.name === tableName) return true;
      else return false;
    });
    if (pos === -1) return next(new Error('No such table found in model'));

    obj.data[pos] = newItem;
    obj.data.sort(sortTableDetails);

    jsonfile.writeFile(tableFile, obj, function(err) {
      if (err) return next(err);
      req.flash('success', 'Table successfully edited');
      return res.redirect('/cassandra-table-details');
    });
  });
});

router.get('/delete/:tableName', function(req, res) {
  const tableName = req.params.tableName;

  jsonfile.readFile(tableFile, function(err, obj) {
    const pos = obj.data.findIndex(function(table) {
      if (table.name === tableName) return true;
      else return false;
    });
    if (pos === -1) return next(new Error('No such table found in model'));

    obj.data.splice(pos, 1);

    jsonfile.writeFile(tableFile, obj, function(err) {
      if (err) return next(err);
      req.flash('success', 'Table successfully deleted');
      return res.redirect('/cassandra-table-details');
    });
  });
});

function sortTableDetails(a, b) { ///Sort the json object
  return a.name.localeCompare(b.name);
}

module.exports = {
  addRouter(app) {
    app.use('/cassandra-table-details', router);
  }
};
