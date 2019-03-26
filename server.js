//dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000 ;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

var app = express();

//express parser/static folder stuff
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//link in mongoose
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//the scrape function that runs every time a get request is sent to /scrape/ i.e. when the button is pressed
app.get("/scrape/:subreddit", function(req, res) {
  var subreddit = req.params.subreddit
  //builds the link with the subreddit value that is grabbed from the text input
  axios.get("https://old.reddit.com/r/" + subreddit + "/").then(function(response) {
    console.log("subreddit" + subreddit)
    var $ = cheerio.load(response.data);

    //every time a p with the class "title" is found, it creates a result object from the results and pushes
    //it to the db as an Article
    $("p.title").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      result.subreddit = subreddit

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    res.send("Scrape Complete");
  });
});

//handles the get requests against each individual subreddit search
app.get("/articles/:subreddit", function(req, res) {
  var subreddit = req.params.subreddit
  db.Article.find({subreddit:subreddit})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//handles the note functionality. finds the single article where the sunbreddit and id match and populates the note associated to it
app.get("/articles/:subreddit/:id", function(req, res) {

  db.Article.findOne({ subreddit: req.params.subreddit, _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//handles posting a note to the specific article
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//delete function for the note
app.delete("/articles/:id", function(req, res) {
  var thisID = req.params.id
  db.Note.findOneAndDelete({_id:thisID })
 
    .then(function(dbNote) {
      return db.Article.findOneAndRemove({ _id: req.params.id }, {note:dbNote._id}, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Starts the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
