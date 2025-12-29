import { useEffect, useState } from "react";
import "./App.css";

// Define the Todo interface based on the API response
interface Todo {
  id: number;
  title: string;
  content?: string;
  completed: number; // API returns 0 or 1
  created_at: string;
}

const API_URL = "http://localhost:3000";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      const data = await response.json();
      // Sort by id descending (newest first)
      setTodos(data.sort((a: Todo, b: Todo) => b.id - a.id));
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setLoading(true);
    try {
      await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo, content: newContent }),
      });
      setNewTodo("");
      setNewContent("");
      fetchTodos();
    } catch (error) {
      console.error("Failed to add todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
      });
      fetchTodos();
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const deleteTodo = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Confirm delete?")) return;

    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });
      fetchTodos();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const archiveCompleted = async () => {
    if (!confirm("Archive all completed tasks?")) return;

    try {
      const res = await fetch(`${API_URL}/archive`, {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message);
      fetchTodos();
    } catch (error) {
      console.error("Failed to archive:", error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>My Tasks</h1>
        <div className="stats">
          {todos.filter((t) => !t.completed).length} pending, {todos.filter((t) => t.completed).length} completed
        </div>
      </header>

      <form onSubmit={addTodo} className="add-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Task title..."
          autoFocus
        />
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Details (optional)..."
          className="content-input"
        />
        <button type="submit" disabled={loading || !newTodo.trim()}>
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>

      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="empty-state">No tasks yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
              onClick={() => toggleTodo(todo.id)}
            >
              <div className="checkbox">
                {todo.completed === 1 ? "✓" : ""}
              </div>
              <div className="todo-content">
                <div className="todo-title">{todo.title}</div>
                {todo.content && <div className="todo-subtitle">{todo.content}</div>}
              </div>
              <button
                className="delete-btn"
                onClick={(e) => deleteTodo(todo.id, e)}
                title="Delete"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {todos.some((t) => t.completed === 1) && (
        <button className="archive-btn" onClick={archiveCompleted}>
          Archive Completed Tasks
        </button>
      )}
    </div>
  );
}

export default App;
