const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // no password
  database: 'task_manager'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Root route handler
app.get('/', (req, res) => {
  res.send('Welcome to Task Manager API');
});

// CRUD APIs

// Create a task
app.post('/tasks', (req, res) => {
  const { title, status } = req.body;
  const query = 'INSERT INTO tasks (title, status) VALUES (?, ?)';
  connection.query(query, [title, status], (err, results) => {
    if (err) {
      console.error('Error inserting task:', err);
      res.status(500).send('Error creating task');
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
      console.error('Error fetching tasks:', err);
      res.status(500).send('Error fetching tasks');
      return;
    }
    res.status(200).send(results);
  });
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;
  const query = 'UPDATE tasks SET title = ?, status = ? WHERE id = ?';
  connection.query(query, [title, status, id], (err, results) => {
    if (err) {
      console.error('Error updating task:', err);
      res.status(500).send('Error updating task');
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
      console.error('Error deleting task:', err);
      res.status(500).send('Error deleting task');
      return;
    }
    res.status(200).send(results);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
