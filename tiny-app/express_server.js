const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;  //default port 8080

app.set("view engine", "ejs");

// adds body-parser to express_server
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// displays the list of URLs and their shortened forms
app.get("/urls", (req, res) => {
  let templateVars = {
                        urls: urlDatabase,
                        shortURL: req.params.id,
                        username: req.cookies["username"]
                      };
  res.render("urls_index", templateVars);
});

// displays urls_new.ejs (submission form)
app.get("/urls/new", (req, res) => {
  let templateVars = {
                        urls: urlDatabase,
                        shortURL: req.params.id,
                        username: req.cookies["username"]
                      };
  res.render("urls_new", templateVars);
});

// displays a single URL and its shortened form
app.get("/urls/:id", (req, res) => {
  let templateVars = {
                        urls: urlDatabase,
                        shortURL: req.params.id,
                        username: req.cookies["username"]
                      };
  res.render("urls_show", templateVars);
});

// generates a random string for the shortURL
const generateRandomString = () => {
  let alphaNumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";
  for (var i = 0; i < 6; i++) {
    randomString += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length));
  }
  return randomString;
};

// CREATE NEW URL
// handles POST request from urls_new.ejs submission form
app.post("/urls", (req, res) => {
  const newId = generateRandomString();
  urlDatabase[newId] = req.body.longURL;

  if (res.statusCode === 200) {
    //***maybe add in the other error codes?***
    res.redirect(`/urls/${newId}`);
  } else {
    console.log("Not found");
  }
});
// redirects short url requests
// app.get("/u/:shortURL", (req, res) => {
//   // let longURL = ...
//   res.redirect(longURL);
// });

// DELETE A URL
// deletes a url from the database
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// UPDATE A URL
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

// LOGIN
app.post("/login", (req, res) => {
  let username = req.body.username;
  res.cookie("username", username);
  // res.setHeader("Set-Cookie");
  res.redirect("/urls");
});