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

  function handleDeleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <main className="max-w-4xl mx-auto mt-10 p-16 w-2xl bg-gray-50 rounded-xl shadow-lg border-gray-200 border">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Todo List</h1>
      <h2 className="text-md font-normal text-gray-600 mb-4 italic">
        {todos.length} todos for today.
      </h2>
      <ul>
        {todos.map((todo) => (
          <li
            className={`flex justify-between items-center px-8 py-4 rounded-xl font-semibold mb-2 cursor-pointer transition-colors duration-200 ${
              todo.done
                ? "text-gray-400 bg-green-300 transition colors duration-400"
                : " bg-sky-100 text-gray-700 hover:text-sky-600 transition colors duration-400"
            }`}
            key={todo.id}
            onClick={() => handleToggleDone(todo.id)}
          >
            <span className={`${todo.done ? "line-through" : ""}`}>
              {todo.title}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTodo(todo.id);
              }}
              className="cursor-pointer ml-2 px-3 py-1 bg-red-100 rounded-lg hover:bg-red-300"
            >
              ❌
            </button>
          </li>
        ))}
        <li>
          <form onSubmit={handleAddTodo} className="flex mt-8 gap-2">
            <input
              className="flex-1 min-w-0 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              placeholder="Type new todo..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button
              className="rounded-xl px-4 py-2 whitespace-nowrap bg-blue-500 text-white  hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
              type="submit"
            >
              Add Todo
            </button>
          </form>
        </li>
      </ul>
    </main>
  );
}

export default App;
