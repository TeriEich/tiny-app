const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//------------------------------------------------------

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "youGotMail": {
    id: "youGotMail",
    email: "tom.and.meg.forever@example.com",
    password: "foxbooks"
  },
  "joeAndTheVolcano": {
    id: "joeAndTheVolcano",
    email: "dont.sacrifice.me.bro@example.com",
    password: "needavacation"
  }
};

//------------------------------------------------------

// generates a random string for the shortURL
const generateRandomString = (num) => {
  let alphaNumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";
  for (var i = 0; i < num; i++) {
    randomString += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length));
  }
  return randomString;
};

// finds users by email
const findEmail = (emailField) => {
  for (user in users) {
    if (emailField === users[user]["email"]) {
      return true;
    }
  }
  return false;
};

// finds the password for a specified user
const findPassword = (emailField) => {
  for (user in users) {
    if (emailField === users[user]["email"]) {
      return users[user]["password"];
    }
  }
};

// finds user info by userId
const findUser = (emailField) => {
  for (user in users) {
    if (emailField === users[user]["email"]) {
      return users[user]["id"];
    }
  }
};

//------------------------------------------------------

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

//------------------------------------------------------

// displays the list of URLs and their shortened forms
app.get("/urls", (req, res) => {
  let templateVars = {
                        urls: urlDatabase,
                        shortURL: req.params.id,
                        user: {
                            userId: req.body.userId,
                            email: req.body.email,
                            password: req.body.password
                          }
                          // users[req.body.userId]
                      };
  res.render("urls_index", templateVars);
});

// displays urls_new.ejs (submission form)
app.get("/urls/new", (req, res) => {
  let templateVars = {
                        urls: urlDatabase,
                        shortURL: req.params.id,
                        user: {
                            userId: req.body.userId,
                            email: req.body.email,
                            password: req.body.password
                          }
                          // users[req.body.userId]
                      };
  res.render("urls_new", templateVars);
});

// displays a single URL and its shortened form
app.get("/urls/:id", (req, res) => {
  let templateVars = {
                        urls: urlDatabase,
                        shortURL: req.params.id,
                        user:  {
                            userId: req.body.userId,
                            email: req.body.email,
                            password: req.body.password
                          }
                          // users[req.body.userId]
                      };
  res.render("urls_show", templateVars);
});

// CREATE NEW URL
// handles POST request from urls_new.ejs submission form
app.post("/urls", (req, res) => {
  const newId = generateRandomString(6);
  urlDatabase[newId] = req.body.longURL;

  if (res.statusCode === 200) {
    //***maybe add in the other error codes?***
    res.redirect(`/urls/${newId}`);
  } else {
    console.log("Not found");
  }
});

// REDIRECTS shortURL TO longURL
// ***Add in redirects for error messages
// see w2d2 url shortening part 2
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

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

//------------------------------------------------------

// LOGIN BUTTON
app.post("/login", (req, res) => {
  let user = findEmail(req.body.email);
  let userPassword = findPassword(req.body.email);

  if (!req.body.email || !req.body.password) {
    res.statusCode = 403;
    res.end("Please fill out both fields!")
  } else if (!user) {
    res.statusCode = 403;
    res.end("User not found");
  } else if (req.body.password != userPassword) {
    res.statusCode = 403;
    res.end("Incorrect email and/or password");
  } else {
    let userId = findUser(req.body.email);
    res.cookie("user_id", userId);
    res.redirect("/");
  }
});

// LOGIN
app.get("/login", (req, res) => {
  let templateVars = {
                        urls: urlDatabase,
                        shortURL: req.params.id,
                        user: {
                            userId: req.body.userId,
                            email: req.body.email,
                            password: req.body.password
                          }
                          // users[req.body.userId]
                      };
  res.render("login", templateVars);
})

// LOGOUT
app.post('/logout', (req, res) => {
  //clears username cookies
  res.clearCookie('username');
  res.redirect('/urls');
});

// REGISTRATION BUTTON
app.get('/register', (req, res) => {
  let templateVars = {
                        urls: urlDatabase,
                        shortURL: req.params.id,
                        user: {
                            userId: req.body.userId,
                            email: req.body.email,
                            password: req.body.password
                          }
                          // users[req.body.userId]
                      };
  res.render('register', templateVars);
});

// REGISTER A NEW USER
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const user = findEmail(email);

  if (user === true) {
    res.statusCode = 400;
    res.end("User already exists");
  } else if (!email || !password) {
    //better way to type this?
    res.statusCode = 400;
    res.end("Please fill out all fields!");
  } else {
    const userId = generateRandomString(10);
    users[userId] = userId;
    users[userId] = {
                      id: userId,
                      email,
                      password
                    };
    res.cookie("user_id", userId);
    res.redirect('/urls');
  }
  // console.log('users: ', users);
});