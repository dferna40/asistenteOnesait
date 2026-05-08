import type { CategoryColorKey } from '../types';

interface CategoryTheme {
  badge: string;
  button: string;
  cardAccent: string;
  chip: string;
  hex: string;
}

export const categoryColorOptions: Array<{
  label: string;
  value: CategoryColorKey;
}> = [
  { label: 'Azul', value: 'blue' },
  { label: 'Esmeralda', value: 'emerald' },
  { label: 'Ambar', value: 'amber' },
  { label: 'Indigo', value: 'indigo' },
  { label: 'Rosa', value: 'rose' },
  { label: 'Violeta', value: 'violet' },
  { label: 'Cian', value: 'cyan' },
  { label: 'Naranja', value: 'orange' },
  { label: 'Teal', value: 'teal' },
  { label: 'Slate', value: 'slate' },
];

const categoryThemesByColor: Record<CategoryColorKey, CategoryTheme> = {
  blue: {
    badge:
      'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200',
    button:
      'hover:border-sky-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-cyan-50 hover:text-sky-800 dark:hover:border-sky-400/45 dark:hover:bg-sky-500/10 dark:hover:text-sky-200',
    cardAccent: 'border-l-blue-500',
    chip:
      'border-blue-200 bg-blue-50 text-blue-700 hover:border-cyan-300 hover:bg-gradient-to-br hover:from-sky-50 hover:to-cyan-50 hover:text-sky-800 dark:border-blue-500/25 dark:bg-slate-900/60 dark:text-blue-200 dark:hover:border-cyan-400/45 dark:hover:bg-sky-500/10 dark:hover:text-cyan-100',
    hex: '#3b82f6',
  },
  emerald: {
    badge:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
    button:
      'hover:border-cyan-300 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-sky-50 hover:text-cyan-800 dark:hover:border-cyan-400/45 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-200',
    cardAccent: 'border-l-emerald-500',
    chip:
      'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-cyan-300 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-sky-50 hover:text-cyan-800 dark:border-emerald-500/25 dark:bg-slate-900/60 dark:text-emerald-200 dark:hover:border-cyan-400/45 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-100',
    hex: '#10b981',
  },
  amber: {
    badge:
      'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
    button:
      'hover:border-sky-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-cyan-50 hover:text-sky-800 dark:hover:border-sky-400/45 dark:hover:bg-sky-500/10 dark:hover:text-sky-200',
    cardAccent: 'border-l-amber-500',
    chip:
      'border-amber-200 bg-amber-50 text-amber-700 hover:border-sky-300 hover:bg-gradient-to-br hover:from-sky-50 hover:to-cyan-50 hover:text-sky-800 dark:border-amber-500/25 dark:bg-slate-900/60 dark:text-amber-200 dark:hover:border-sky-400/45 dark:hover:bg-sky-500/10 dark:hover:text-sky-100',
    hex: '#f59e0b',
  },
  indigo: {
    badge:
      'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200',
    button:
      'hover:border-sky-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-cyan-50 hover:text-sky-800 dark:hover:border-sky-400/45 dark:hover:bg-sky-500/10 dark:hover:text-sky-200',
    cardAccent: 'border-l-indigo-500',
    chip:
      'border-indigo-200 bg-indigo-50 text-indigo-700 hover:border-sky-300 hover:bg-gradient-to-br hover:from-sky-50 hover:to-cyan-50 hover:text-sky-800 dark:border-indigo-500/25 dark:bg-slate-900/60 dark:text-indigo-200 dark:hover:border-sky-400/45 dark:hover:bg-sky-500/10 dark:hover:text-sky-100',
    hex: '#6366f1',
  },
  rose: {
    badge:
      'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200',
    button:
      'hover:border-cyan-300 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-sky-50 hover:text-cyan-800 dark:hover:border-cyan-400/45 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-200',
    cardAccent: 'border-l-rose-500',
    chip:
      'border-rose-200 bg-rose-50 text-rose-700 hover:border-cyan-300 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-sky-50 hover:text-cyan-800 dark:border-rose-500/25 dark:bg-slate-900/60 dark:text-rose-200 dark:hover:border-cyan-400/45 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-100',
    hex: '#f43f5e',
  },
  violet: {
    badge:
      'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200',
    button:
      'hover:border-sky-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-cyan-50 hover:text-sky-800 dark:hover:border-sky-400/45 dark:hover:bg-sky-500/10 dark:hover:text-sky-200',
    cardAccent: 'border-l-violet-500',
    chip:
      'border-violet-200 bg-violet-50 text-violet-700 hover:border-sky-300 hover:bg-gradient-to-br hover:from-sky-50 hover:to-cyan-50 hover:text-sky-800 dark:border-violet-500/25 dark:bg-slate-900/60 dark:text-violet-200 dark:hover:border-sky-400/45 dark:hover:bg-sky-500/10 dark:hover:text-sky-100',
    hex: '#8b5cf6',
  },
  cyan: {
    badge:
      'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200',
    button:
      'hover:border-cyan-300 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-sky-50 hover:text-cyan-800 dark:hover:border-cyan-400/45 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-200',
    cardAccent: 'border-l-cyan-500',
    chip:
      'border-cyan-200 bg-cyan-50 text-cyan-700 hover:border-cyan-300 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-sky-50 hover:text-cyan-800 dark:border-cyan-500/25 dark:bg-slate-900/60 dark:text-cyan-200 dark:hover:border-cyan-400/45 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-100',
    hex: '#06b6d4',
  },
  orange: {
    badge:
      'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200',
    button:
      'hover:border-sky-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-cyan-50 hover:text-sky-800 dark:hover:border-sky-400/45 dark:hover:bg-sky-500/10 dark:hover:text-sky-200',
    cardAccent: 'border-l-orange-500',
    chip:
      'border-orange-200 bg-orange-50 text-orange-700 hover:border-sky-300 hover:bg-gradient-to-br hover:from-sky-50 hover:to-cyan-50 hover:text-sky-800 dark:border-orange-500/25 dark:bg-slate-900/60 dark:text-orange-200 dark:hover:border-sky-400/45 dark:hover:bg-sky-500/10 dark:hover:text-sky-100',
    hex: '#f97316',
  },
  teal: {
    badge:
      'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-200',
    button:
      'hover:border-cyan-300 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-sky-50 hover:text-cyan-800 dark:hover:border-cyan-400/45 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-200',
    cardAccent: 'border-l-teal-500',
    chip:
      'border-teal-200 bg-teal-50 text-teal-700 hover:border-cyan-300 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-sky-50 hover:text-cyan-800 dark:border-teal-500/25 dark:bg-slate-900/60 dark:text-teal-200 dark:hover:border-cyan-400/45 dark:hover:bg-cyan-500/10 dark:hover:text-cyan-100',
    hex: '#14b8a6',
  },
  slate: {
    badge:
      'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200',
    button:
      'hover:border-sky-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-cyan-50 hover:text-sky-800 dark:hover:border-sky-400/45 dark:hover:bg-sky-500/10 dark:hover:text-sky-200',
    cardAccent: 'border-l-slate-500',
    chip:
      'border-slate-200 bg-slate-100 text-slate-700 hover:border-sky-300 hover:bg-gradient-to-br hover:from-sky-50 hover:to-cyan-50 hover:text-sky-800 dark:border-slate-600/40 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-sky-400/45 dark:hover:bg-sky-500/10 dark:hover:text-sky-100',
    hex: '#64748b',
  },
};

export const getCategoryTheme = (color: CategoryColorKey = 'slate') =>
  categoryThemesByColor[color] ?? categoryThemesByColor.slate;

export const getCategoryColorHex = (color: CategoryColorKey = 'slate') =>
  getCategoryTheme(color).hex;
