var express = require('express');
// var router = express.Router(); //CHANGE TO APP
var app = express.Router();
var UserModel = require("../models/users");


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

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



module.exports = app; //change to app was router
