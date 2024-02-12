import express from 'express';
import { start } from 'repl';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// In-memory array to store todos
let todos: { id: number; task: string; completed: boolean }[] = [];

// GET endpoint to fetch all todos
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// POST endpoint to create a new todo
app.post('/todos', (req, res) => {
  const { task } = req.body;
  const newTodo = { id: todos.length + 1, task, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT endpoint to update a todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;

  const todo = todos.find(todo => todo.id === parseInt(id));
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  todo.task = task;
  todo.completed = completed;
  res.json(todo);
});

// DELETE endpoint to delete a todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(todo => todo.id !== parseInt(id));
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});