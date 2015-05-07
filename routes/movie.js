var UserController = require('../userController');  //gets the current user info required in here (the page that holds it, at least)
var express = require('express');
var router = express.Router();
var movieList = [];


var TheMovie = require('../models/movie');
var User = require('../models/user');

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



// B. Send the movie list back to the client

var sendMovieList = function (req, res, next) {
  TheMovie.find({}, function (err, movies) {  //What's stored in movies? An array

    //Swap out the user._id for user.username in each task

      var theUser = UserController.getCurrentUser(); //theUser is the entire object
      console.log(theUser.username);

    //Loop over the movies array
    for (var i = 0; i < movies.length; i++) {
      movies[i].user = theUser.username;  //if you crazily wanted to display password instead, theUser.password
    }

    console.log('movies',movies);

    if (err) {
      console.log(err);
      sendError(req, res, err, "Could not get movies list");
    } else {
      res.render("movielist", {
        title: "List of movies",
        message: "Look at what you've been up to here",
        welcome: "Welcome, film fan!",
        movies: movies
      });
    }
  });
};



// C. Handle a GET request from the client to /movieenter/list
router.get('/list', function (req,res,next) {
  // Is the user logged in?
  console.log("line 45 here");
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

  // Send the movie form back to the client
  res.render('movieenter', {
    title: 'Enter a New Film',
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
    TheMovie.findOne({ _id: req.body.db_id }, function (err, foundmovieenter) {

      if (err) {
        sendError(req, res, err, "Could not find that task");
      } else {
        // Found it. Now update the values based on the form POST data.
        foundmovieenter.title = req.body.title;
        foundmovieenter.director = req.body.director;
        foundmovieenter.theater = req.body.theater;
        foundmovieenter.moviegoers = req.body.moviegoers;
        foundmovieenter.rating = req.body.rating;
        foundmovieenter.date_seen = req.body.date_seen;
        foundmovieenter.favorite = (req.body.complete) ? req.body.favorite : false;

        // Save the updated item.
        foundmovieenter.save(function (err, newOne) {
          if (err) {
            sendError(req, res, err, "Could not save task with updated information");
          } else {
            res.redirect('/movie/list');
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


    var mymovie = new TheMovie(theFormPostData);

    mymovie.save(function (err, mymovie) {
      if (err) {
        sendError(req, res, err, "Failed to save task");
      } else {
        res.redirect('/movie/list');
      }
    });
  }
});

router.delete('/', function (req, res) {
  console.log(req.body.movie_id);
  TheMovie.find({ _id: req.body.movie_id })
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


router.get('/:id', function (req, res) {

  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  TheMovie.find({ _id: req.params.id }, function (err, movie) {
    var thisMovie = movie[0];

    // Was there an error when retrieving?
    if (err) {
      sendError(req, res, err, "Could not find a movie with that id");

    // Find was successful
    } else {
      res.render('movieenter', {
        title : 'Express Todo Example',
        themovie: thisMovie
      });
    }
  });
});

module.exports = router;



