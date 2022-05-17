const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const alert = require("alert");

mongoose.connect("mongodb://localhost:27017/topDB");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const detailsSchema = new mongoose.Schema({
  type: String,
  first_name: String,
  last_name: String,
  phNumber: Number,
  email: String,
  password: String,
  dlNumber: String,
});

const Person = mongoose.model("Person", detailsSchema);

app.get("/", function (req, res) {
  res.render("index", { user: 0, userName: "" });
});

app.get("/register", function (req, res) {
  res.render("sign-up");
});

app.post("/register", (req, res) => {
  let x = "";

  if (req.body.register_2 == "on") x = "driver";
  else if (req.body.register_1 == "on") x = "user";

  let data = {
    type: x,
    first_name: req.body.fName,
    last_name: req.body.lName,
    phNumber: req.body.pNum,
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
          alert("Already registered!");
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
  res.render("sign-in");
});

app.post("/login", (req, res) => {
  Person.find(
    { email: req.body.email, password: req.body.password },
    function (err, doc) {
      if (err) console.log(err);
      else {
        console.log(doc);
        if (doc.length) {
          if (doc[0].dlNumber) {
            console.log("Successfully logged in as driver.");
            res.render("index", {
              publish: 1,
              user: 1,
              userName: doc[0].first_name + " " + doc[0].last_name,
            });
          } else {
            console.log("Successfully logged in as user.");
            res.render("index", {
              publish: 0,
              user: 1,
              userName: doc[0].first_name + " " + doc[0].last_name,
            });
          }
        } else {
          alert("Not Registered!");
          console.log("Not Registered!");
          res.redirect("/register");
        }
      }
    }
  );
});

app.post("/search", (req, res) => {
  console.log(req.body);
  res.send("Thanks");
});

app.listen(process.env.PORT || 4000, function () {
  console.log("Server is up and running at 4000");
});
