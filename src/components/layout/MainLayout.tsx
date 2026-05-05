import { useState } from 'react';
import type { ReactNode } from 'react';
import { IdentityWidget } from '../ui/IdentityWidget';
import { SearchBar } from '../ui/SearchBar';

const externalTools = [
  { label: 'iTeams', href: 'https://example.com/iteams' },
  { label: 'Jira', href: 'https://example.com/jira' },
  { label: 'Portal RGA', href: 'https://example.com/portal-rga' },
  { label: 'Wiki Tecnica', href: 'https://example.com/wiki-tecnica' },
];

// Recordatorio de arquitectura: Para cualquier lógica Java que gestione flujos
// de datos o BBDD, implementar siempre try-catch-resources.

interface MainLayoutProps {
  children: ReactNode;
  topBarContent?: ReactNode;
  sidebarContent?: ReactNode;
  searchTerm?: string;
  onSearchTermChange?: (value: string) => void;
  onHomeClick?: () => void;
}

export function MainLayout({
  children,
  topBarContent,
  sidebarContent,
  searchTerm = '',
  onSearchTermChange,
  onHomeClick,
}: MainLayoutProps) {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const activeSearchTerm = onSearchTermChange ? searchTerm : internalSearchTerm;
  const handleSearchTermChange = onSearchTermChange ?? setInternalSearchTerm;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 flex h-screen w-80 shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
          <div className="shrink-0 bg-slate-50/85 p-4 backdrop-blur supports-[backdrop-filter]:bg-slate-50/70">
            <IdentityWidget />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto border-t border-slate-100 p-4">
            {sidebarContent ?? (
              <div className="space-y-6">
                <button
                  type="button"
                  onClick={() => {
                    handleSearchTermChange('');
                    onHomeClick?.();
                  }}
                  className="cursor-pointer text-left text-lg font-semibold text-slate-900 transition-all duration-200 hover:text-sky-700"
                >
                  Asistente RGA
                </button>

                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Herramientas Externas
                  </p>
                  <nav aria-label="Herramientas externas">
                    <ul className="space-y-2">
                      {externalTools.map((tool) => (
                        <li key={tool.label}>
                          <a
                            href={tool.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-slate-600 transition-all duration-200 hover:text-sky-700"
                          >
                            <span>{tool.label}</span>
                            <span aria-hidden="true" className="text-xs text-slate-400">
                              ↗
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-10 min-h-16 border-b border-slate-200 bg-white/95 px-6 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            {topBarContent ?? (
              <div className="flex h-full flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-72 flex-1 items-center gap-4">
                  <h1 className="text-base font-semibold md:text-lg">
                    Asistente Onesite RGA
                  </h1>
                  <SearchBar
                    value={activeSearchTerm}
                    onChange={handleSearchTermChange}
                  />
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
