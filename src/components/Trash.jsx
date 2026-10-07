// The trash can. Purely visual: `isOver` (from props) decides how it looks,
// and `innerRef` lets the parent measure it for the drop hit-test.
function Trash({ isOver, innerRef }) {
  return (
    <div
      ref={innerRef}
      role="img"
      aria-label="Trash. Drag a note here to delete it."
      className={`px-16 py-8 trash absolute bottom-4 left-4 z-0 flex cursor-default select-none flex-col items-center ${
        isOver ? "is-over text-red-500" : "text-slate-500/80"
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
  );
}

export default Trash;
