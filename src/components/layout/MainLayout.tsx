import { useState } from 'react';
import type { ReactNode } from 'react';
import { SearchBar } from '../ui/SearchBar';

interface MainLayoutProps {
  children: ReactNode;
  topBarContent?: ReactNode;
  sidebarContent?: ReactNode;
}

const copyToClipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

export function MainLayout({
  children,
  topBarContent,
  sidebarContent,
}: MainLayoutProps) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-72 shrink-0 border-r border-slate-200 bg-white p-4">
          {sidebarContent ?? (
            <div>
              <h2 className="text-lg font-semibold">Asistente RGA</h2>
              <p className="mt-2 text-sm text-slate-600">
                Navegación del asistente de supervivencia.
              </p>
            </div>
          )}
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-10 min-h-16 border-b border-slate-200 bg-white/95 px-6 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            {topBarContent ?? (
              <div className="flex h-full flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-72 flex-1 items-center gap-4">
                  <h1 className="text-base font-semibold md:text-lg">
                    Asistente de Supervivencia RGA
                  </h1>
                  <SearchBar value={searchTerm} onChange={setSearchTerm} />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard('testoip4')}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Copiar Usuario (testoip4)
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('T3$t01p@2020')}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Copiar Clave (T3$t01p@2020)
                  </button>
                </div>
              </div>
            )}
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
