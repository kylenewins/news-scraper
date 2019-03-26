$(document).ready(function(){
  //whenever you click the scrape button, it issues an ajax get request for the specific subreddit
  $("#scrapeButton").on("click", function(){
    $("#articles").empty()
  
    var subreddit = $("#subreddit").val().trim()
  
    $.ajax({
      method: "GET",
      url: "/scrape/" + subreddit
    }, $("#articles").append("<p>Scraping...</p>")
    ).then(function(){
      $.getJSON(("/articles/" + subreddit), function(data) {
        $("#articles").empty()
        for (var i = 0; i < data.length; i++) {
          var linkString = data[i].link
          //if the link starts with "/r/ it won't work as an href, so we have to add the base of the url"
          if(linkString.startsWith("/r/")){
            var redditString = "https://www.old.reddit.com"
            linkString = redditString.concat(linkString)
            // console.log(linkString)
          }
          //adds the text and the link for each article directly to the #articles div
          $("#articles").append("<p class = 'title' data-id='" + data[i]._id + "' data-subreddit='" + subreddit + "'>" + data[i].title + "</p>" + "<br>" 
          + "<a class = 'link' href='" + linkString + "'>" + data[i].link + "</a>"
          + "<br><p>-------------------</p>");
        }
      })
    })

    
  
  })
   
    //every time a p with the class of title is clicked, you can save a note
    $(document).on("click", "p.title", function() {
      $("#notes").empty();
      //we have to grab the id and the subreddit because that's how the url is set up for the get request
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
          $("#notes").append("<button class= 'btn btn-primary' data-id='" + data._id + "' id='savenote'>Save Note</button>");
          $("#notes").append("<button class= 'btn btn-primary' data-id='" + data.note._id + "' id='deletenote'>Delete Note</button>");
  
    
          if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
            console.log("note data" + data.note._id)
          }
        });
    });
    //when you click save note, it issues a post request and thusly saves it to the database in accordance with it's parent article
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
  //delete note just deletes it based off of the id :)
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
