interface ToggleSwitchProps {
  checked: boolean;
  description?: string;
  label: string;
  onChange: (nextValue: boolean) => void;
}

export function ToggleSwitch({
  checked,
  description,
  label,
  onChange,
}: ToggleSwitchProps) {
  return (
    <label className="inline-flex min-h-[44px] items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-left text-sm text-slate-700 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-200">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors duration-200 ${
          checked
            ? 'border-sky-500 bg-sky-500/90'
            : 'border-slate-300 bg-slate-200 dark:border-slate-700 dark:bg-slate-800'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>

      <span className="min-w-0">
        <span className="block font-semibold text-slate-900 dark:text-slate-100">
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-300">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
