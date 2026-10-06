import { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([
    { id: 1, title: "Clean the house", done: false },
    { id: 2, title: "Do the laundry", done: false },
    { id: 3, title: "Buy groceries", done: false },
  ]);
  const [newTitle, setNewTitle] = useState("");

  function handleAddTodo(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;

    const newTodo = { id: Date.now(), title, done: false };
    setTodos([...todos, newTodo]);
    setNewTitle("");
  }

  function handleToggleDone(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  }
  return (
    <main className="max-w-md mx-auto mt-10 p-4 w-2xl bg-white rounded shadow">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <li className="mb-2" key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => handleToggleDone(todo.id)}
            />
            <span
              className={
                todo.done ? "line-through text-gray-500" : "text-gray-800"
              }
            >
              {todo.title}
            </span>
          </li>
        ))}
        <li>
          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              placeholder="Type new todo..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            ></input>
            <button type="submit">Add Todo</button>
          </form>
        </li>
      </ul>
    </main>
  );
}

export default App;
