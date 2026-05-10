import { useEffect, useRef, useState } from 'react';

interface SearchHelpItem {
  description: string;
  title: string;
}

interface SearchHelpButtonProps {
  description: string;
  items: SearchHelpItem[];
  title: string;
}

export function SearchHelpButton({
  description,
  items,
  title,
}: SearchHelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        aria-label={`Ayuda del buscador: ${title}`}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-white/90 text-slate-600 shadow-sm transition-colors hover:border-sky-400 hover:text-sky-700 dark:bg-slate-950/90 dark:text-slate-200 dark:hover:text-sky-300 ${
          isOpen
            ? 'border-sky-400 text-sky-700 dark:border-sky-400 dark:text-sky-300'
            : 'border-slate-200 dark:border-slate-700'
        }`}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
          <circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M8.75 7.45a1.7 1.7 0 1 1 2.59 1.46c-.92.57-1.34 1-1.34 2.03"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
          />
          <circle cx="10" cy="13.9" r=".8" fill="currentColor" />
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-40 mt-2 w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {description}
          </p>
          <ul className="mt-3 space-y-2">
            {items.map((item) => (
              <li
                key={`${item.title}-${item.description}`}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
