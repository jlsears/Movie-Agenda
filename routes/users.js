var Q = require("q");
var express = require('express');
// var router = express.Router(); //CHANGE TO APP
var app = express.Router();
var UserController = require("../userController");
var UserModel = require("../models/users");

// var Movie = require("../models/movie");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

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

// Retrieve all tasks for the current user
var getUserMovies = function (userId) {
  var deferred = Q.defer();

  console.log('Another promise to let the calling function know when the database lookup is complete');

  Movie.find({user: userId}, function (err, tasks) {
    if (!err) {
      console.log('Movies found = ' + tasks.length);
      console.log('No errors when looking up tasks. Resolve the promise (even if none were found).');
      deferred.resolve(tasks);
    } else {
      console.log('There was an error looking up movies list. Reject the promise.');
      deferred.reject(err);
    }
  })

  return deferred.promise;
};


/* Register a new movie app user */

//Handle the request from the registration form
app.get("/register", function (req, res) {
	res.render("register");
});


/* Handle the registration form post*/
app.post("/register", function (req, res) {
	var newUser = new UserModel(req.body);

	newUser.save(function (err, user) {
		if (err) {
			sendError(req, res, err, "Registration Failed");
		} else {
			res.redirect("/movie") ///where to redirect.??????????
		}
	});
});

//handle login from form
app.post("/login", function (req, res) {

	console.log("Hi, this is Node handling the /users/login route");

//Attempt to login the user with their input
	UserController.login(req.body.username, req.body.password)

	//after DB call is complete and successful,
	//the promose returns the user object
	.then(function (vaildUser) {
		console.log('Ok, now we are back in the route handling code and have found a user');
		console.log('validUser',validUser);
		console.log('Find any tasks that are assigned to the user');

		//now find the movies that belong to current user
		getUserMovies(vaildUser._id)
			.then(function (movies) {
			//render movie listing
			res.redirect("movie/list");
			})
			.fail(function (err) {
				sendError(req, res, {errors: err.message}, "Failed")
			});
	})

	//After database call is complete BUT failed
	.fail(function (err) {
		console.log("Failed to find the user");
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






module.exports = app; //change to app was router
