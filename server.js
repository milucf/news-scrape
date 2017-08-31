var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


var app = express();

var port=process.env.PORT || 8080;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));


var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require("./routes/news_route.js");

app.use("/", routes);

app.listen(port, function() {
    console.log("App running on port :"+port);
  });

