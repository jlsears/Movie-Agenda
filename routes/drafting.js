var UserController = require('../userController');  //gets the current user info required in here (the page that holds it, at least)
var express = require('express');
var router = express.Router();
var movieList = [];
var TheMovie = require('../models/movieenter');
var User = require('../models/user');


// A. Send the error message back to the client
var sendError = function (req, res, err, message) {
  res.render("error", {
    error: {
      status: 500,
      stack: JSON.stringify(err.errors)
    },
    message: message
  });
};

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
      res.render("movieList", {
        title: "List of tasks",
        message: "Things you still need to do",
        welcome: "Welcome, film fan!",
        tasks: tasks
      });
    }
  });
};

// C. Handle a GET request from the client to /movieenter/list
router.get('/', function (req,res,next) {
  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  sendMovieList(req, res, next);
});


// D. Handle a GET request from the client to /movieenter/:id
router.get('/:id', function (req, res) {

  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  Themovie.find({ _id: req.params.id }, function (err, item) {
    var thisItem = item[0];

    // Was there an error when retrieving?
    if (err) {
      sendError(req, res, err, "Could not find a task with that id");

    // Find was successful
    } else {
      res.render('movieenter', {
        title : 'Title of Page Here',
        movie: thisItem
      });
    }
  });
});


// E. Handle a GET request from the client to /movieenter
router.get('/', function (req, res) {

  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  // Send the todo form back to the client
  res.render('movieenter', {
    title: 'Title Here',
    movieenter: {
      title: '',
      director: '',
      genre: '',
      theater: '',
      fellow_moviegoers: '',
      date_viewed: new Date(),
      seen: '',
      favorite: false
    }
  })
})


// F. Handle a DELETE request from the client to /movieenter
router.delete('/', function (req, res) {
  TheMovie.find({ _id: req.body.movieenter_id })
      .remove(function (err) {

    // Was there an error when removing?
    if (err) {
      sendError(req, res, err, "Could not delete the movie");

    // Delete was successful
    } else {
      res.send("SUCCESS");
    }
  });
});


// G. Handle a POST request from the client to /movieenter








module.exports = router;
