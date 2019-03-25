$(document).ready(function(){
  $("#scrapeButton").on("click", function(){
    $("#articles").empty()
  
    var subreddit = $("#subreddit").val().trim()
  
    $.ajax({
      method: "GET",
      url: "/scrape/" + subreddit
    }).then(function(){
      $.getJSON(("/articles/" + subreddit), function(data) {
        for (var i = 0; i < data.length; i++) {
          $("#articles").append("<p class = 'title' data-id='" + data[i]._id + "' data-subreddit='" + subreddit + "'>" + data[i].title + "</p>" + "<br>" 
          + "<p class = 'link'>" + data[i].link + "</p>"
          + "<br><p>-------------------</p>");
        }
      })
    })

    
  
  })
   
    
    $(document).on("click", "p", function() {
      $("#notes").empty();
      var thisId = $(this).attr("data-id");
      var subreddit = $(this).attr("data-subreddit")
    
      $.ajax({
        method: "GET",
        url: "/articles/" + subreddit + "/" + thisId
      })
        .then(function(data) {
          console.log(data);
          $("#notes").append("<h2>" + data.title + "</h2>");
          $("#notes").append("<input id='titleinput' name='title' >");
          $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
          $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
          $("#notes").append("<button data-id='" + data.note._id + "' id='deletenote'>Delete Note</button>");
  
    
          if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
            console.log("note data" + data.note._id)
          }
        });
    });
    
    $(document).on("click", "#savenote", function() {
      var thisId = $(this).attr("data-id");
    
      $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          title: $("#titleinput").val(),
          body: $("#bodyinput").val()
        }
      })
        .then(function(data) {
          console.log(data);
          $("#notes").empty();
        });
    
      $("#titleinput").val("");
      $("#bodyinput").val("");
    });
  
    $(document).on("click", "#deletenote", function() {
      var thisId = $(this).attr("data-id");
    
      $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId,
      })
        .then(function(data) {
          console.log(data);
          $("#notes").empty();
        });
    
      $("#titleinput").val("");
      $("#bodyinput").val("");
    });
    
})
