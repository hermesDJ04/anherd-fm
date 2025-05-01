const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

const ADMIN_PASSWORD = 'admin123';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

function getUsers() {
  const data = fs.readFileSync('./users.json');
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();
  const user = users[username];

  if (user && user.password === password) {
    res.json({ success: true, playlist: user.playlist });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/admin-login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post('/add-user', (req, res) => {
  const { username, password, playlist } = req.body;
  const users = getUsers();

  if (users[username]) {
    return res.json({ success: false, message: 'User already exists' });
  }

  users[username] = { password, playlist };
  saveUsers(users);

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
