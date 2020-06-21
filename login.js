var mysql = require("mysql");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "nodelogin",
});

var app = express();
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.render("login.ejs");
});

app.post("/auth", function (request, response) {
  //var username = request.body.username;
  var password = request.body.password;
  var email = request.body.email;

  if (email && password) {
    connection.query(
      "SELECT * FROM accounts WHERE email = ? AND password = ?",
      [email, password],
      function (error, results, fields) {
        if (error) {
          console.log(error);
        }

        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.email = email;
          response.redirect("/home");
        } else {
          response.render('error.ejs');
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Email and Password!");
    response.end();
  }
});

app.get("/home", function (request, response) {
  if (request.session.loggedin) {
    response.render('landing.ejs');
  } else {
    response.render('error.ejs');
  }
  response.end();
});

app.listen(3000);