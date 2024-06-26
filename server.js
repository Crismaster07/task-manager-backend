const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'task_manager'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// CRUD APIs
// Create a task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
  connection.query(query, [title, description], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(201).send(results);
  });
});

// Read all tasks
app.get('/tasks', (req, res) => {
  const query = 'SELECT * FROM tasks';
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).send(results);
  });
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const query = 'UPDATE tasks SET title = ?, description = ? WHERE id = ?';
  connection.query(query, [title, description, id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).send(results);
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).send(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
