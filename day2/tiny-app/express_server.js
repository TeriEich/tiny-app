const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;  //default port 8080

app.set("view engine", "ejs");

// adds body-parser to express_server
app.use(bodyParser.urlencoded({extended: true}));

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
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// displays urls_new.ejs (submission form)
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// displays a single URL and its shortened form
app.get("/urls/:id", (req, res) => {
  let templateVars = {
                        urls: urlDatabase,
                        shortURL: req.params.id
                      };
  res.render("urls_show", templateVars);
});

// generates a random string for the shortURL
function generateRandomString(num) {
  let alphaNumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";
  for (var i = 0; i < num; i++) {
    randomString += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length));
  }
  urlDatabase[randomString] = document.getElementById("longURL");
  console.log(urlDatabase);
}

// handles POST request from urls_new.ejs submission form
app.post("/urls", (req, res) => {
  if (res.statusCode === 200) {
  res.send("Ok");         // respond with "Ok"
  generateRandomString(6);
  // urlDatabase[randomString] = req;
  console.log(urlDatabase);  // debug statement to see POST params
  //redirect to (`http://localhost:8080/urls/:${id[shortURL]}`);
  } else {
    console.log("Not found")
  }
  // longURL = urlDatabase[shortURL].longURL;
});

// redirects short url requests
// app.get("/u/:shortURL", (req, res) => {
//   // let longURL = ...
//   res.redirect(longURL);
// });