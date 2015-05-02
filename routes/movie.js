var UserController = require('../userController');  //gets the current user info required in here (the page that holds it, at least)
var express = require('express');
var router = express.Router();
var movieList = [];
var TheMovie = require('../models/movie');
var User = require('../models/user');


// B. Send the movie list back to the client

var sendMovieList = function (req, res, next) {
  TheMovie.find({}, function (err, tasks) {  //What's stored in tasks? An array

    //Swap out the user._id for user.username in each task

      var theUser = UserController.getCurrentUser(); //theUser is the entire object
      console.log(theUser.username);

    //Loop over the tasks array
    for (var i = 0; i < tasks.length; i++) {
      tasks[i].user = theUser.username;  //if you crazily wanted to display password instead, theUser.password
    }

    console.log('tasks',tasks);

    if (err) {
      console.log(err);
      sendError(req, res, err, "Could not get task list");
    } else {
      res.render("movielist", {
        title: "List of tasks",
        message: "Look at what you've been up to here",
        welcome: "Welcome, film fan!",
        tasks: tasks
      });
    }
  });
};


// C. Handle a GET request from the client to /movieenter/list
router.get('/list', function (req,res,next) {
  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  sendMovieList(req, res, next);
});


module.exports = router;



