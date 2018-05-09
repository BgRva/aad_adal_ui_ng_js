/*
  Dev TODO API Service end points
*/
var router = require('express').Router();
var fs = require('fs');
var _ = require('lodash');
var four0four = require('../utils/404')();
var data = require('../data');
var dataFolder = '../../data/';
var jsonfileservice = require('../utils/jsonfileservice')();

router.get('/user', getUsers);
router.get('/user/:id', getUser);
router.get('/todo', getTodos);
router.get('/todo/:id', getTodo);
router.put('/todo/:id', updateTodo);
router.delete('/todo/:id', deleteTodo);
router.post('/todo', addTodo);
router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

//////////////

function getUser(req, res, next) {
  var id = +req.params.id;
  var result = data.users.filter(function (p) {
    return p.id === id;
  })[0];

  console.log('@>> getUser(' + id + '):' + JSON.stringify(result));

  if (!result) {
    console.log('@>> getUser(' + id + ') is null, returning known user #1 for DEV');
    result = data.users.filter(function (p) {
      return p.id === 1;
    })[0];
  }

  if (result) {
    setTimeout(function () {
      res.status(200).send(result);
    }, 1000);
  } else {
    four0four.send404(req, res, 'user ' + id + ' not found');
  }
}

function getUsers(req, res, next) {
  res.status(200).send(data.users);
}

function getTodo(req, res, next) {
  var id = +req.params.id;
  var result = data.todos.filter(function (p) {
    return p.id === id;
  })[0];

  console.log('@>> getTodo(' + id + '):' + JSON.stringify(result));

  if (!result) {
    console.log('@>> getTodo(' + id + ') is null, returning known todo #1 for DEV');
    result = data.todos.filter(function (p) {
      return p.id === 1;
    })[0];
  }

  if (result) {
    setTimeout(function () {
      res.status(200).send(result);
    }, 1000);
  } else {
    four0four.send404(req, res, 'todo ' + id + ' not found');
  }
}

function getTodos(req, res, next) {
  setTimeout(function () {
    res.status(200).send(data.todos);
  }, 1000);
}

function updateTodo(req, res, next) {
  var id = +req.params.id;
  var updates = req.body;
  console.log('@>> updateTodo(): ' + JSON.stringify(updates));

  var todo = data.todos.filter(function (p) {
    return p.id === id;
  })[0];

  if (todo) {
    // return the updated todo object
    setTimeout(function () {
      res.status(200).send(todo);
    }, 1000);
  } else {
    four0four.send404(req, res, 'updateTodo returned a non-success status: ' + res.status);
  }
}

function deleteTodo(req, res, next) {
  var id = +req.params.id;
  console.log('@>> deleteTodo(): ' + id);
  var todo = data.todos.filter(function (p) {
    return p.id === id;
  })[0];
  if (todo) {
    setTimeout(function () {
      res.status(200).send('deleted');
    }, 500);
  } else {
    four0four.send404(req, res, 'Todo with id: ' + id + ' was does not exist.');
  }
}

function addTodo(req, res, next) {
  var todo = req.body;
  todo.id = 10000 + data.todos.length;
  console.log('@>> addTodo() todo: ' + JSON.stringify(todo));
  data.todos.push(todo);

  if (todo) {
    res.status(200).send(todo);
  } else {
    four0four.send404(req, res, 'addTodo returned a non-success status: ' + res.status);
  }
}
