




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

  TheMovie.find({ _id: req.params.id }, function (err, item) {
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
