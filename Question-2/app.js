const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session middleware setup
app.use(session({
  store: new FileStore(),
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }  
}));


const users = [];


app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
});


app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

 
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.redirect('/login');
});


app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = username;  // Store username in session
    res.redirect('/home');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});


app.get('/home', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  res.render('home', { user: req.session.userId });
});


app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/home');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
