/*
  Dev auth token server end points
*/
var router = require('express').Router();
var fs = require('fs');
var _ = require('lodash');
var four0four = require('../utils/404')();
var data = require('../data');
var dataFolder = '../../data/';
var jsonfileservice = require('../utils/jsonfileservice')();

router.post('/logout', logOut);

router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

//////////////

function logOut(req, res, next) {
  var user = req.body;
  console.log('#>> logOut: ' + JSON.stringify(user));

  setTimeout(function () {
    res.status(200).send('success');
  }, 1000);
}
