import express from 'express';
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  user: 'saqib',
  host: 'localhost',
  database: 'Databases',
  password: 'Delhi@2001',
  port: 5432,
});

// GET endpoint to fetch all todos
app.get('/todos', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM todos ORDER BY id ASC');
  res.status(200).json(rows);
});

// POST endpoint to create a new todo
app.post('/todos', async (req, res) => {
  const { task } = req.body;
  const { rows } = await pool.query('INSERT INTO todo (task) VALUES ($1) RETURNING *', [task]);
  res.status(201).json(rows[0]);
});

// PUT endpoint to update a todo
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  const { rows } = await pool.query('UPDATE todo SET task = $1, completed = $2 WHERE id = $3 RETURNING *', [task, completed, id]);

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.json(rows[0]);
});

// DELETE endpoint to delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM todos WHERE id = $1', [id]);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});