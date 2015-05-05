$(document).ready(function() {

  // User clicked on an edit button
  $(".editButton").click(function () {
    window.location.href = "/movie/" + $(this)[0].id;
  });

  // User clicked on a delete button
  $(".deleteButton").click(function () {
    var themovieItemId = $(this)[0].id;

    $.ajax({
      url: "/movie",
      method: "DELETE",
      data: {
        movie_id: themovieItemId
      },
      success: function (response) {
        $("#movie_"+themovieItemId).remove();  // Remove the DOM element on success
      }
    });
  });



});
