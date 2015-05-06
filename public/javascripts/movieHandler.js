$(document).ready(function() {

  // User clicked on an edit button
  $(".editButton").click(function () {
    window.location.href = "/movie/" + $(this)[0].id;
  });

  // User clicked on a delete button
  $(".deleteButton").click(function () {
    var movieItemId = $(this)[0].id;

    $.ajax({
      url: "/movie",
      method: "DELETE",
      data: {
        movie_id: movieItemId
      },
      success: function (response) {
        $("#movie_"+movieItemId).remove();  // Remove the DOM element on success
        alert("Item has been deleted.");
        console.log("It deleted");
      }
    });
  });



});
