import { useRef, useState } from "react";
import "./App.css";

// Nominal width (26rem) used to center a new note on the click.
// The real width is set by the content, see the style on the note wrapper.
const NOTE_WIDTH = 416;

function randomTilt() {
  return Math.round((Math.random() * 4 - 2) * 10) / 10; // -2.0 to 2.0 degrees
}

function Note({
  note,
  onChange,
  onDelete,
  onFocus,
  onDragMove,
  onDragEnd,
  overTrash,
}) {
  const [newTitle, setNewTitle] = useState("");
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
  function handleAddTodo(e) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    onChange({ todos: [...todos, { id: Date.now(), title, done: false }] });
    setNewTitle("");
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
            <li
              key={todo.id}
              className="pop-in group flex min-h-10 items-start pl-6 pr-1 transition-transform duration-150 hover:translate-x-1"
            >
              <button
                type="button"
                onClick={() => handleToggleDone(todo.id)}
                aria-pressed={todo.done}
                className="flex min-w-0 flex-1 cursor-pointer items-start gap-4 rounded text-left focus-visible:outline-2 focus-visible:outline-sky-500"
              >
                {/* mt-2 centers the 1.5rem circle on the first 2.5rem ruled line */}
                <span
                  className={`mt-2 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                    todo.done
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-400 group-hover:border-sky-500"
                  }`}
                >
                  {todo.done && (
                    <span className="check-pop text-sm leading-none">✓</span>
                  )}
                </span>
                {/* line-height = ruled line height, so wrapped lines sit on the paper lines */}
                <span className="min-w-0 wrap-break-word text-lg font-bold leading-10 text-slate-700">
                  <span className={`strike ${todo.done ? "is-done" : ""}`}>
                    {todo.title}
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteTodo(todo.id)}
                aria-label={`Delete ${todo.title}`}
                className="h-10 cursor-pointer px-2 text-slate-400 opacity-0 transition hover:text-red-500 focus-visible:opacity-100 group-hover:opacity-100"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddTodo} className="mt-4 flex gap-2 pl-20">
          <input
            className="h-10 min-w-0 flex-1 cursor-text border-b-2 border-dashed border-slate-400 bg-transparent px-1 text-lg font-bold text-slate-700 placeholder:font-['Caveat',cursive] placeholder:text-2xl placeholder:font-semibold placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
            type="text"
            placeholder="Jot something down…"
            aria-label="New todo"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button
            type="submit"
            className="h-10 cursor-pointer rounded-full bg-sky-500 px-5 font-bold text-white shadow transition hover:bg-sky-600 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
          >
            Add
          </button>
        </form>
      </section>
    </div>
  );
}

function App() {
  const topZ = useRef(1);
  const trashRef = useRef(null);
  const [overTrash, setOverTrash] = useState(false);
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Today's list",
      x: 80,
      y: 70,
      z: 1,
      tilt: -1,
      todos: [
        { id: 1, title: "Clean the house", done: false },
        { id: 2, title: "Do the laundry", done: false },
        { id: 3, title: "Buy groceries", done: false },
      ],
    },
  ]);

  function addNote(x, y) {
    topZ.current += 1;
    const note = {
      id: Date.now(),
      title: "New list",
      // Center the note on the click, but keep it on the desk
      x: Math.min(
        Math.max(x - NOTE_WIDTH / 2, 0),
        window.innerWidth - NOTE_WIDTH,
      ),
      y: Math.min(Math.max(y - 24, 0), window.innerHeight - 200),
      z: topZ.current,
      tilt: randomTilt(),
      todos: [],
    };
    setNotes((prev) => [...prev, note]);
  }

  function updateNote(id, patch) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }

  function bringToFront(id) {
    // Already on top? Skip the re-render.
    const note = notes.find((n) => n.id === id);
    if (note && note.z === topZ.current) return;
    topZ.current += 1;
    updateNote(id, { z: topZ.current });
  }

  function deleteNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  // Hit-test with the pointer (not the note's edges): where your cursor is
  // is what you're aiming at. A little padding makes the target forgiving.
  function pointerOverTrash(e) {
    const rect = trashRef.current?.getBoundingClientRect();
    if (!rect || !e) return false;
    const pad = 16;
    return (
      e.clientX >= rect.left - pad &&
      e.clientX <= rect.right + pad &&
      e.clientY >= rect.top - pad &&
      e.clientY <= rect.bottom + pad
    );
  }

  function handleDragEnd(id, e) {
    if (pointerOverTrash(e)) deleteNote(id);
    setOverTrash(false);
  }

  function handleDeskClick(e) {
    // Only clicks on the bare desk create a note, not clicks that land on a note
    if (e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    addNote(e.clientX - rect.left, e.clientY - rect.top);
  }

  return (
    <div
      className="desk relative h-screen overflow-hidden font-['Nunito',sans-serif]"
      onClick={handleDeskClick}
    >
      {notes.length === 0 && (
        <p className="pointer-events-none absolute inset-0 grid place-items-center font-['Caveat',cursive] text-4xl text-amber-900/50">
          Click anywhere on the desk to add a note
        </p>
      )}

      {/* Trash: sits under the notes (z-0), so a note slides in front of it */}
      <div
        ref={trashRef}
        role="img"
        aria-label="Trash. Drag a note here to delete it."
        className={`p-16 trash absolute bottom-4 left-4 z-0 flex cursor-default select-none flex-col items-center ${
          overTrash ? "is-over text-red-500" : "text-slate-500/80"
        }`}
      >
        <svg viewBox="0 0 64 72" className="h-20 w-auto" aria-hidden="true">
          <g className="trash-lid" fill="currentColor">
            <rect x="24" y="4" width="16" height="7" rx="3" />
            <rect x="6" y="11" width="52" height="7" rx="3.5" />
          </g>
          <path
            d="M13 22h38l-3 43a5 5 0 0 1-5 4.6H21a5 5 0 0 1-5-4.6z"
            fill="currentColor"
          />
          <path
            d="M26 30v30M32 30v30M38 30v30"
            stroke="#fffdf6"
            strokeOpacity="0.65"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-['Caveat',cursive] text-2xl font-bold leading-none">
          Trash
        </span>
      </div>

      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          overTrash={overTrash}
          onChange={(patch) => updateNote(note.id, patch)}
          onDelete={() => deleteNote(note.id)}
          onFocus={() => bringToFront(note.id)}
          onDragMove={(e) => setOverTrash(pointerOverTrash(e))}
          onDragEnd={(e) => handleDragEnd(note.id, e)}
        />
      ))}

      {/* Keyboard-friendly way to do the same thing as clicking the desk */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          addNote(window.innerWidth / 2, window.innerHeight / 3);
        }}
        className="absolute bottom-4 right-4 z-9999 cursor-pointer rounded-full bg-slate-700 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
      >
        + New note
      </button>
    </div>
  );
}

export default App;
