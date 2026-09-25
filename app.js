const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
 // Parse JSON bodies
 app.use(express.json());

 // Sample initial data
 let todos = [
    {id: 1, task: 'Learn Node.js', completed: false },
    {id: 2, task: 'Build CRUD API', completed: true },
    {id: 3, task: 'Complete Assignment', completed: false},
 ];

 // 1. GET /todos - Read all
 app.get('/todos', (req, res) => {
    res.status(200).json(todos);
 });

 // 2. GET /todos/active - Array bonus: Filter active (!completed)
 // MUST be placed BEFORE /todos/:id route
 app.get('/todos/active', (req, res) => {
    const activeTodos = todos.filter(t => !t.completed);
    res.status(200).json(activeTodos);
 });

 // 3. GET/todos/:id - Single read  
 app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({ error: 'To-Do item not found'});
    }
    res.status(200).json(todo);
});

// 4. POST /todos - Create with task validation 
app.post('/todos', (req, res) => {
    const {task, completed } = req.body;

    // Validation requirement: task field required
    if (!task || typeof task!== 'string' || task.trim() === '') {
        return res.status(400).json({ error: "Validation failed: 'task' field is required." });
    } 

    const newTodo = {
        id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
        task: task.trim(),
        completed: typeof completed === 'boolean' ? completed : false
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// 5. PUT /todos/:id - Update
app.put('/todos/:id', (req, res) =>  {
    const id = parseInt(req.params.id, 10);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({ error: 'To-DO item not found' });
    }

    const {task, completed } = req.body;

    if (task !== undefined) {
        if (typeof task !== 'string'  || task.trim() === '') {
            return res.status(400).json({ error: "Validation failed: 'task' must be a non-empty string."});
        }
        todo.task = task.trim();
    }
    if (completed !== undefined) {
        if (typeof completed !== 'boolean') {
            return res.status(400).json({ error: "Validation failed: 'completed' must be a boolean." });
        }
        todo.completed = completed;
    }
    
    res.status(200).json(todo);
});

// 6. DELETE /todos/id: - Delete
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'To-Do item not found' });
    }

    const deletedTodo = todos.splice(index, 1)[0];
    res.status(200).json({ message: 'To-Do item deleted successfully', todo: deletedTodo });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});