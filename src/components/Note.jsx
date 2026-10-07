import { useRef, useState } from "react";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";

// One paper note: handles dragging and the header, and composes
// TodoItem (per task) and TodoForm (new task) via props.
function Note({
  note,
  onChange,
  onDelete,
  onFocus,
  onDragMove,
  onDragEnd,
  overTrash,
}) {
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);

  const { todos } = note;
  const doneCount = todos.filter((t) => t.done).length;
  const allDone = todos.length > 0 && doneCount === todos.length;

  /* ---------- dragging ---------- */
  function handlePointerDown(e) {
    // Let inputs and buttons behave normally
    if (e.target.closest("button, input")) {
      onFocus();
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: note.x,
      originY: note.y,
    };
    setDragging(true);
    onFocus();
  }

  function handlePointerMove(e) {
    if (!drag.current) return;
    const x = drag.current.originX + (e.clientX - drag.current.startX);
    const y = drag.current.originY + (e.clientY - drag.current.startY);
    // Keep at least a corner of the note on the desk so it can't get lost
    onChange({
      x: Math.min(Math.max(x, 0), window.innerWidth - 80),
      y: Math.min(Math.max(y, 0), window.innerHeight - 60),
    });
    onDragMove(e);
  }

  function handlePointerUp(e) {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    onDragEnd(e); // the desk decides if the note was dropped on the trash
  }

  function handlePointerCancel() {
    // The browser took over the gesture (e.g. a system swipe): never delete
    drag.current = null;
    setDragging(false);
    onDragEnd(null);
  }

  /* ---------- todos ---------- */
  function handleAddTodo(title) {
    onChange({ todos: [...todos, { id: Date.now(), title, done: false }] });
  }

  function handleToggleDone(id) {
    onChange({
      todos: todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    });
  }

  function handleDeleteTodo(id) {
    onChange({ todos: todos.filter((t) => t.id !== id) });
  }

  return (
    <div
      className="note-in absolute touch-none select-none"
      style={{
        left: note.x,
        top: note.y,
        zIndex: note.z,
        // Grows with the longest task, from 26rem up to 48rem (or the screen)
        width: "max-content",
        minWidth: "26rem",
        maxWidth: "min(48rem, calc(100vw - 2rem))",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <section
        className={`paper group/note relative rounded-md border border-amber-900/10 pt-10 pb-8 pr-5 shadow-[0_12px_30px_rgba(80,60,30,0.25)] ${
          dragging ? "is-dragging cursor-grabbing" : "cursor-grab"
        } ${dragging && overTrash ? "over-trash" : ""}`}
        style={{ "--tilt": `${note.tilt}deg` }}
        aria-label={`Note: ${note.title}`}
      >
        {/* tape */}
        <div className="pointer-events-none absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2 bg-yellow-200/70 shadow-sm" />

        <button
          type="button"
          onClick={onDelete}
          aria-label={`Remove note ${note.title}`}
          className="absolute right-2 top-2 cursor-pointer rounded px-2 py-1 text-slate-400 opacity-0 transition hover:text-red-500 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-sky-500 group-hover/note:opacity-100"
        >
          ✕
        </button>

        <header className="mb-4 pl-20 pr-2">
          <input
            className="w-full cursor-text bg-transparent font-['Caveat',cursive] text-4xl font-bold leading-none text-slate-700 focus:outline-none focus:underline focus:decoration-dashed focus:decoration-slate-400"
            value={note.title}
            onChange={(e) => onChange({ title: e.target.value })}
            aria-label="Note title"
          />
          <p className="mt-2 h-5 text-sm text-slate-500">
            {allDone
              ? "All done. Go touch some grass 🌱"
              : todos.length === 0
                ? "Nothing here yet"
                : `${doneCount} of ${todos.length} done`}
          </p>
        </header>

        <ul>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggleDone}
              onDelete={handleDeleteTodo}
            />
          ))}
        </ul>

        <TodoForm onAdd={handleAddTodo} />
      </section>
    </div>
  );
}

export default Note;
