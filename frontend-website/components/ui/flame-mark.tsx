/** The Ashwatthama flame: a single-stroke mark that inherits `currentColor`. */
export function FlameMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2c0 6-6 6-6 12a6 6 0 0 0 12 0c0-6-6-6-6-12z" />
      <path d="M12 2c0 4 3 5 3 9" />
    </svg>
  );
}
