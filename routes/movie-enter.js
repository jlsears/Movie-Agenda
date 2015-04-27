var UserController = require('../userController');  //gets the current user info required in here (the page that holds it, at least)
var express = require('express');
var router = express.Router();
var movieList = [];
var TheMovie = require('../models/themovie');
var User = require('../models/users');


// Send the error message back to the client
var sendError = function (req, res, err, message) {
  res.render("error", {
    error: {
      status: 500,
      stack: JSON.stringify(err.errors)
    },
    message: message
  });
};


// Send the movies seen list back to the client




// Send the movies to see list back to the client


// module.exports = router; //change to app was router

