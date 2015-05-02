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


// E. Handle a GET request from the client to /movieenter
router.get('/', function (req, res) {

  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  // Send the todo form back to the client
  res.render('movieenter', {
    title: 'Title Here',
    themovie: {
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

// G. Handle a POST request from the client to /movieenter
router.post('/', function (req, res, next) {

  // User is editing an existing item
  if (req.body.db_id !== "") {

    // Find it
    movieenter.findOne({ _id: req.body.db_id }, function (err, foundmovieenter) {

      if (err) {
        sendError(req, res, err, "Could not find that task");
      } else {
        // Found it. Now update the values based on the form POST data.
        foundmovieenter.title = req.body.title;
        foundmovieenter.description = req.body.description;
        foundmovieenter.priority = req.body.priority;
        foundmovieenter.due_date = req.body.due_date;
        foundmovieenter.complete = (req.body.complete) ? req.body.complete : false;

        // Save the updated item.
        foundmovieenter.save(function (err, newOne) {
          if (err) {
            sendError(req, res, err, "Could not save task with updated information");
          } else {
            res.redirect('/movie');
          }
        });
      }
    });

  // User created a new item
  } else {

    // Who is the user?
    var theUser = UserController.getCurrentUser();

    // What did the user enter in the form?
    var theFormPostData = req.body
    theFormPostData.user = theUser._id;

    console.log('theFormPostData',theFormPostData);


    var mytodo = new Todo(theFormPostData);

    mymovieenter.save(function (err, todo) {
      if (err) {
        sendError(req, res, err, "Failed to save task");
      } else {
        res.redirect('/movie');
      }
    });
  }
});


module.exports = router;



