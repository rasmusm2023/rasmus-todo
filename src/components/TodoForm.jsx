import { useState } from "react";

// The input field + Add button. It keeps the text being typed in its own state
// and only tells the parent when a finished title is ready, via onAdd(title).
function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2 pl-20">
      <input
        className="h-10 min-w-0 flex-1 cursor-text border-b-2 border-dashed border-slate-400 bg-transparent px-1 text-lg font-bold text-slate-700 placeholder:font-['Caveat',cursive] placeholder:text-2xl placeholder:font-semibold placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
        type="text"
        placeholder="Jot something down…"
        aria-label="New todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        type="submit"
        className="h-10 cursor-pointer rounded-full bg-sky-500 px-5 font-bold text-white shadow transition hover:bg-sky-600 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      >
        Add
      </button>
    </form>
  );
}

export default TodoForm;
