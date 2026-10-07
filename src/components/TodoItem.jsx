// One task row. It owns no data: everything arrives as props,
// and user actions are sent back up through the onToggle / onDelete props.
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="pop-in group flex min-h-10 items-start pl-6 pr-1 transition-transform duration-150 hover:translate-x-1">
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
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
        <span className="min-w-0 wrap-break-words text-lg font-bold leading-10 text-slate-700">
          <span className={`strike ${todo.done ? "is-done" : ""}`}>
            {todo.title}
          </span>
        </span>
      </button>

      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete ${todo.title}`}
        className="h-10 cursor-pointer px-2 text-slate-400 opacity-0 transition hover:text-red-500 focus-visible:opacity-100 group-hover:opacity-100"
      >
        ✕
      </button>
    </li>
  );
}

export default TodoItem;
