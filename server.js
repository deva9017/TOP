const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/topDB");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const detailsSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  dlNumber: String,
});

const Person = mongoose.model("Person", detailsSchema);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/register", function (req, res) {
  res.sendFile(__dirname + "/public/sign-up.html");
});

app.post("/register", (req, res) => {
  let data = {
    first_name: req.body.fName,
    last_name: req.body.lName,
    email: req.body.email,
    password: req.body.password,
    dlNumber: req.body.identity,
  };

  Person.exists(
    { email: req.body.email, password: req.body.password },
    function (err, doc) {
      if (err) console.log(err);
      else {
        if (doc) {
          console.log("Already registered!");
          res.redirect("/login");
        } else {
            let person = new Person(data);
            person.save();
            res.redirect("/login");
        }
      }
    }
  );
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/sign-in.html");
});

app.post("/login", (req, res) => {
  Person.exists(
    { email: req.body.email, password: req.body.password },
    function (err, doc) {
      if (err) console.log(err);
      else {
        if (doc) {
          console.log("Successfully logged in.");
          res.redirect("/");
        } else {
          console.log("Not Registered!");
          res.redirect("/register");
        }
      }
    }
  );
});

app.listen(4000, function () {
  console.log("Server is up and running at 4000");
});
