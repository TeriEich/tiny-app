const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//------------------------------------------------------

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };
const urlDatabase = {
  "b2xVn2": {
              shortURL: "b2xVn2",
              longURL: "http://www.lighthouselabs.ca",
              userID: "youGotMail"
            },
  "9sm5xK": {
              shortURL: "9sm5xK",
              longURL: "http://www.google.com",
              userID: "joeAndTheVolcano"
            }

}

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

// finds user info by id
const findUser = (emailField) => {
  for (user in users) {
    if (emailField === users[user]["email"]) {
      return users[user]["id"];
    }
  }
};

//compares userID with user_id;
//returns urls that belong to user_id
// filters urls by owner
const urlsForUser = (id) => {
  let ownedUrls = {};

  for (url in urlDatabase) {
    if (id === urlDatabase[url].userID) {
      ownedUrls[url] = urlDatabase[url];
    }
  }
  return ownedUrls;
};

// redirect function:
const setTemplateVars = (req, res, redi, rend) => {
  if (!req.cookies.user_id) {
    res.redirect(redi);
  } else {
    let templateVars = {
                        urls: urlsForUser(req.cookies.user_id),
                        shortURL: req.params.id,
                        users: users,
                        user: {
                                id: req.cookies.user_id,
                                email: users[req.cookies.user_id].email,
                                password: users[req.cookies.user_id].password
                              }
                        };
    res.render(rend, templateVars);
  }
};

const errTemplateVars = (req, res, redi, err, msg) => {
  let templateVars = {
                      urls: urlsForUser(req.cookies.user_id),
                      shortURL: req.params.id,
                      users: users,
                      user: {
                              id: req.cookies.user_id,
                              email: users[req.cookies.user_id].email,
                              password: users[req.cookies.user_id].password
                            }
                      };
  if (templateVars.user.id !== urlDatabase[req.params.id].userID) {
    res.status(err).send(msg);
  } res.redirect(redi, setTemplateVars);
}

// if (user === urlDatabase[req.params.id].userID) {
//     urlDatabase[req.params.id].longURL = req.body.longURL;
//     res.redirect("/urls");
//   } else {
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
  setTemplateVars(req, res, "/login", "urls_index");
});

// displays urls_new.ejs (submission form)
app.get("/urls/new", (req, res) => {
  setTemplateVars(req, res, "/login", "urls_new");
});

// displays a single URL and its shortened form
app.get("/urls/:id", (req, res) => {
  setTemplateVars(req, res, "/login", "urls_show");
});

// CREATE NEW URL
// handles POST request from urls_new.ejs submission form
app.post("/urls", (req, res) => {
  const newId = generateRandomString(6);
  let newURL = {
                shortURL: newId,
                longURL: req.body.longURL,
                userID: req.cookies.user_id
                };
  urlDatabase[newId] = newURL;
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
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// DELETE A URL
// deletes a url from the database
app.post("/urls/:id/delete", (req, res) => {
  if (req.cookies.user_id === urlDatabase[req.params.id].userID) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else {
    res.statusCode = 403;
    res.end("Only the authorized user may delete entries");
  }
});

// UPDATE A URL
app.post("/urls/:id", (req, res) => {
  let templateVars = {
                      urls: urlsForUser(req.cookies.user_id),
                      shortURL: req.params.id,
                      users: users,
                      user: {
                              id: req.cookies.user_id,
                              email: users[req.cookies.user_id].email,
                              password: users[req.cookies.user_id].password
                            }
                      };
  if (templateVars.user["id"] === urlDatabase[req.params.id].userID) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect("/urls");
  } else {
    // errTemplateVars(req, res, "/login", 403, "Only the authorized user may edit entries");
    res.status(403).send("Only the authorized user may edit entries");
  }
});

//------------------------------------------------------

// LOGIN HANDLER
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
                              id: req.body.id,
                              email: req.body.email,
                              password: req.body.password
                            }
                      };
  res.render("login", templateVars);
})

// LOGOUT HANDLER
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

// REGISTRATION BUTTON
app.get('/register', (req, res) => {
  let templateVars = {
                        urls: urlDatabase,
                        shortURL: req.params.id,
                        user: {
                              id: req.body.id,
                              email: req.body.email,
                              password: req.body.password
                            }
                      };
  res.render('register', templateVars);
});

// REGISTER A NEW USER
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const user = findEmail(email);

  if (user === true) {
    //better way to type this?
    res.statusCode = 400;
    res.end("User already exists");
  } else if (!email || !password) {
    res.statusCode = 400;
    res.end("Please fill out all fields!");
  } else {
    const userId = generateRandomString(10);
    let newUser = {
                id: userId,
                email,
                password
                    };
    users[userId] = newUser;
    res.cookie("user_id", userId);
    res.redirect('/urls');
  }
});