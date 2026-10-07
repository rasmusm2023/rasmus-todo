import { useRef, useState } from "react";
import "./App.css";
import Note from "./components/Note";
import Trash from "./components/Trash";

// Nominal width (26rem) used to center a new note on the click.
// The real width is set by the content, see the style in Note.
const NOTE_WIDTH = 416;

function randomTilt() {
  return Math.round((Math.random() * 4 - 2) * 10) / 10; // -2.0 to 2.0 degrees
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

      {/* Sits under the notes (z-0), so a note slides in front of it */}
      <Trash isOver={overTrash} innerRef={trashRef} />

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
