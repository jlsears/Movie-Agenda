var Q = require("q");
var express = require('express');
var app = express.Router();
var UserController = require("../userController");
var UserModel = require("../models/user");
var Movie = require("../models/movieenter");

// Send the error message back to the client
var sendError = function (req, res, err, message) {
  console.log('Render the error template back to the client.');
  res.render("error", {
    error: {
      status: 500,
      stack: JSON.stringify(err.errors)
    },
    message: message
  });
};

// Retrieve all movies for the current user
var getUserMovies = function (userId) {
  var deferred = Q.defer();

  console.log('Another promise to let the calling function know when the database lookup is complete');

  Movie.find({user: userId}, function (err, movies) {
    if (!err) {
      console.log('Movies found = ' + movies.length);
      console.log('No errors when looking up movies. Resolve the promise (even if none were found).');
      deferred.resolve(movies);
    } else {
      console.log('There was an error looking up movies. Reject the promise.');
      deferred.reject(err);
    }
  })

  return deferred.promise;
};


// Handle the request for the registration form
app.get("/register", function (req, res) {
  res.render("register");
});


// Handle the registration form post
app.post("/register", function (req, res) {
  console.log("hit post /register");
  var newUser = new UserModel(req.body);

  newUser.save(function (err, user) {
    if (err) {
      sendError(req, res, err, "Failed to register user");
    } else {
      res.redirect("/");
    }
  });
});


// Handle the login action
app.post("/login", function (req, res) {

  console.log('Hi, this is Node handling the /user/login route');

  // Attempt to log the user is with provided credentials
  UserController.login(req.body.username, req.body.password)

    // After the database call is complete and successful,
    // the promise returns the user object
    .then(function (validUser) {

      console.log('Ok, now we are back in the route handling code and have found a user');
      console.log('validUser',validUser);
      console.log('Find any movies that are assigned to the user');

      // Now find the movies that belong to the user
      getUserMovies(validUser._id)
        .then(function (movies) {
          // Render the movie list
          res.redirect("/movie/list");
        })
        .fail(function (err) {
          sendError(req, res, {errors: err.message}, "Failed")
        });
    })

    // After the database call is complete but failed
    .fail(function (err) {
      console.log('Failed looking up the user');
      sendError(req, res, {errors: err.message}, "Failed")
    })
});

app.get("/profile", function (req, res) {
  var user = UserController.getCurrentUser();

  if (user !== null) {
    getUserMovies(user._id).then(function (movies) {
      res.render("userProfile", {
        username: user.username,
        movies: movies
      });
    });
  } else {
    res.redirect("/");
  }

});

app.get("/logout", function (req, res) {
UserController.logout();
res.redirect("/");
});


module.exports = app;

module.exports = app;
