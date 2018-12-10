const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['randomStringOfWords'],
  maxAge: 24 * 60 * 60 * 1000
}));

//------------------------------------------------------

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
};

const users = {
                "youGotMail": {
                                id: "youGotMail",
                                email: "tom.and.meg.forever@example.com",
                                password: bcrypt.hashSync("foxbooks", 10)
                              },
                "joeAndTheVolcano": {
                                id: "joeAndTheVolcano",
                                email: "dont.sacrifice.me.bro@example.com",
                                password: bcrypt.hashSync("needavacation", 10)
                              }
};

//------------------------------------------------------

// generates a random string for the shortURL
const generateRandomString = (num) => {
  let alphaNumeric = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  for (let i = 0; i < num; i++) {
    randomString += alphaNumeric.charAt(Math.floor(Math.random() * alphaNumeric.length));
  }
  return randomString;
};

// finds users by email
const findEmail = (emailField) => {
  for (let user in users) {
    if (emailField === users[user].email) {
      return true;
    }
  }
  return false;
};

// finds the password for a specified user
const findPassword = (emailField) => {
  for (let user in users) {
    if (emailField === users[user].email) {
      return users[user].password;
    }
  }
};

// finds user info by id
const findUser = (emailField) => {
  for (let user in users) {
    if (emailField === users[user].email) {
      return users[user]['id'];
    }
  }
};

// filters urls by owner for /urls
const urlsForUser = (id) => {
  let ownedUrls = {};

  for (let url in urlDatabase) {
    if (id === urlDatabase[url].userID) {
      ownedUrls[url] = urlDatabase[url];
    }
  }
  return ownedUrls;
};

// filters a url by owner for /urls/:id
const urlPageForUser = (id) => {
  let ownedUrls = {};

  for (let url in urlDatabase) {
    if (id === urlDatabase[url].userID) {
      ownedUrls[url] = urlDatabase[url];
    }
  }
  return ownedUrls;
};

// render function to set template variables
const setTemplateVars = (req, res, rend) => {
  let templateVars = {
                      urls: urlsForUser(req.session.user_id),
                      shortURL: req.params.id,
                      users: users,
                      user: {
                              id: req.session.user_id,
                              email: users[req.session.user_id].email,
                              password: users[req.session.user_id].password
                            }
                      };
  res.render(rend, templateVars);
};

//------------------------------------------------------

app.get('/', (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    res.redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//------------------------------------------------------

// DISPLAY LIST OF URLS
app.get('/urls', (req, res) => {
  if (!req.session.user_id) {
    res.statusCode = 403;
    res.end('You must be logged in to view this page');
  } else {
    setTemplateVars(req, res, 'urls_index');
  }
});

// DISLAY NEW URL FORM
app.get('/urls/new', (req, res) => {
  if (req.session.user_id) {
    setTemplateVars(req, res, 'urls_new');
  } else {
    res.redirect('/login');
  }
});

// DISPLAY SHORT LINK PAGE
app.get('/urls/:id', (req, res, next) => {
  for (let link in urlDatabase) {
    if (req.params.id === urlDatabase[link].shortURL) {
      if (!req.session.user_id || req.session.user_id !== urlDatabase[req.params.id].userID) {
        res.statusCode = 403;
        res.send('Only the authorized user may view this page');
      } else {
        setTemplateVars(req, res, 'urls_show');
      }
    }
  }
      res.statusCode = 404;
      res.send('Short Link Not Found');
});

// CREATE NEW URL
app.post('/urls', (req, res) => {
  const newId = generateRandomString(6);
  let newURL = {
                shortURL: newId,
                longURL: req.body.longURL,
                userID: req.session.user_id
                };
  urlDatabase[newId] = newURL;
  if (res.statusCode === 200) {
    res.redirect(`/urls/${newId}`);
  } else {
    console.log('Not found');
  }
});

// REDIRECTS shortURL TO longURL
app.get('/u/:shortURL', (req, res) => {
  for (let link in urlDatabase) {
    if (req.params.shortURL === urlDatabase[link].shortURL) {
      let longURL = urlDatabase[req.params.shortURL].longURL;
      res.redirect(longURL);
    }
  }
  res.statusCode = 404;
  res.send('Short Link Not Found');
});

// DELETE A URL
app.post('/urls/:id/delete', (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.id].userID) {
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
  } else {
    res.statusCode = 403;
    res.end('Only the authorized user may delete entries');
  }
});

// UPDATE A URL
app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect('/urls');
});

//------------------------------------------------------

// LOGIN HANDLER
app.post('/login', (req, res) => {
  let user = findEmail(req.body.email);
  if (!req.body.email || !req.body.password) {
    res.statusCode = 403;
    res.end('Please fill out both fields!');
  } else if (!user) {
    res.statusCode = 403;
    res.end('User not found');
  } else {
    let hashedPassword = findPassword(req.body.email);
    let userPassword = bcrypt.compareSync(req.body.password, hashedPassword);
    if (!userPassword) {
      res.statusCode = 403;
      res.end('Incorrect email and/or password');
    } else {
      let userId = findUser(req.body.email);
      req.session.user_id = userId;
      res.redirect('/');
    }
  }
});

// LOGIN
app.get('/login', (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  }

  let templateVars = {
                        urls: urlDatabase,
                        shortURL: req.params.id,
                        user: {
                              id: req.body.id,
                              email: req.body.email,
                              password: req.body.password
                            }
                      };
  res.render('login', templateVars);
});

// LOGOUT HANDLER
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

// REGISTRATION BUTTON
app.get('/register', (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  }

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
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (user === true) {
    res.statusCode = 400;
    res.end('User already exists');
  } else if (!email || !password) {
    res.statusCode = 400;
    res.end('Please fill out all fields!');
  } else {
    const userId = generateRandomString(10);
    let newUser = {
                id: userId,
                email,
                password: hashedPassword
                    };
    users[userId] = newUser;
    req.session.user_id = newUser.id;
    res.redirect('/urls');
  }
});
