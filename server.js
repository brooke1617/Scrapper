var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");


var app = express();


var databaseUrl = "scraper";
var collections = ["scrapedData"];


var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});


app.get("/", function(req, res) {
  res.send("Hello Coding Family");
});


app.get("/all", function(req, res) {
  
  db.scrapedData.find({}, function(error, found) {
    
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});


app.get("/scrape", function(req, res) {

  request("https://abcnews.go.com", function(error, response, html) {
    var $ = cheerio.load(html);
    
    $(".title").each(function(i, element) {
     
      var title = $(this).children("a").text();
      var link = $(this).children("a").attr("href");

      if (title && link) {
        db.scrapedData.save({
          title: title,
          link: link
        },
        function(err, saved) {
          if (err) {
  
            console.log(err);
          }
          else {
           
            console.log(saved);
          }
        });
      }
    });
  });

  
  res.send("Lets Rule the world");
});


app.listen(3001, function() {
  console.log("App running on port 3001!");
});
