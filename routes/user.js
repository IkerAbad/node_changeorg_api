'use strict'

// load express router
var express = require('express');
var UserController = require('../controllers/user');
var api = express.Router(); // load the express router - get, post, put, delete...methods available

// routes
//api.get('/home', UserController.home);
//api.get('/pruebas', UserController.pruebas);
api.get('/saveUser', UserController.saveUser);
api.get('/findAllUsers', UserController.findAllUsers);
api.get('/deleteUser', UserController.deleteUser);

module.exports = api;