/*
  Dev EVENTS API end points
*/
var router = require('express').Router();
var fs = require('fs');
var _ = require('lodash');
var four0four = require('../utils/404')();
var data = require('../data');
var dataFolder = '../../data/';
var jsonfileservice = require('../utils/jsonfileservice')();

router.get('/entry', getEntries);
router.get('/entry/:id', getEntry);
router.put('/entry/:id', updateEntry);
router.delete('/entry/:id', deleteEntry);
router.post('/entry', addEntry);
router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

//////////////

function getEntry(req, res, next) {
  var id = +req.params.id;
  var result = data.entries.filter(function (p) {
    return p.id === id;
  })[0];

  console.log('@>> getEntry(' + id + '):' + JSON.stringify(result));

  if (!result) {
    console.log('@>> getEntry(' + id + ') is null, returning known entry #1 for DEV');
    result = data.entries.filter(function (p) {
      return p.id === 1;
    })[0];
  }

  if (result) {
    setTimeout(function () {
      res.status(200).send(result);
    }, 1000);
  } else {
    four0four.send404(req, res, 'entry ' + id + ' not found');
  }
}

function getEntries(req, res, next) {
  setTimeout(function () {
    res.status(200).send(data.entries);
  }, 1000);
}

function updateEntry(req, res, next) {
  var id = +req.params.id;
  var updates = req.body;
  console.log('@>> updateEntry(): ' + JSON.stringify(updates));

  var entry = data.entries.filter(function (p) {
    return p.id === id;
  })[0];

  if (entry) {
    // return the updated entry object
    setTimeout(function () {
      res.status(200).send(entry);
    }, 1000);
  } else {
    four0four.send404(req, res, 'updateEntry returned a non-success status: ' + res.status);
  }
}

function deleteEntry(req, res, next) {
  var id = +req.params.id;
  console.log('@>> deleteEntry(): ' + id);
  var entry = data.entries.filter(function (p) {
    return p.id === id;
  })[0];
  if (entry) {
    setTimeout(function () {
      res.status(200).send('deleted');
    }, 500);
  } else {
    four0four.send404(req, res, 'Entry with id: ' + id + ' was does not exist.');
  }
}

function addEntry(req, res, next) {
  var entry = req.body;
  entry.id = 10000 + data.entries.length;
  console.log('@>> addEntry() entry: ' + JSON.stringify(entry));
  data.entries.push(entry);

  if (entry) {
    res.status(200).send(entry);
  } else {
    four0four.send404(req, res, 'addEntry returned a non-success status: ' + res.status);
  }
}
