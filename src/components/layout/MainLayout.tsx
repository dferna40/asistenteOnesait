import { useState } from 'react';
import type { ReactNode } from 'react';
import { AppLogo } from '../ui/AppLogo';
import { IdentityWidget } from '../ui/IdentityWidget';
import { SearchBar } from '../ui/SearchBar';
import type { AppCustomizationSettings } from '../../types';

// Recordatorio: Si en el futuro se implementa una logica Java para la gestion dinamica de estos enlaces (por ejemplo, cargandolos desde una base de datos), es obligatorio utilizar try-catch-resources para el cierre seguro de los flujos de datos.

// Para cualquier logica Java que maneje peticiones de red desde este
// asistente, utiliza siempre try-catch-resources para garantizar la
// seguridad y el cierre de conexiones.

interface MainLayoutProps {
  appName: string;
  customization: AppCustomizationSettings;
  children: ReactNode;
  headerActions?: ReactNode;
  topBarContent?: ReactNode;
  sidebarContent?: ReactNode;
  searchTerm?: string;
  onSearchTermChange?: (value: string) => void;
  onHomeClick?: () => void;
}

export function MainLayout({
  appName,
  customization,
  children,
  headerActions,
  topBarContent,
  sidebarContent,
  searchTerm = '',
  onSearchTermChange,
  onHomeClick,
}: MainLayoutProps) {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeSearchTerm = onSearchTermChange ? searchTerm : internalSearchTerm;
  const handleSearchTermChange = onSearchTermChange ?? setInternalSearchTerm;

  const closeSidebar = () => setIsSidebarOpen(false);
  const handleHomeNavigation = () => {
    handleSearchTermChange('');
    onHomeClick?.();
    closeSidebar();
  };

  const defaultSidebarContent = (
    <section className="sidebar-panel rounded-[1.7rem] border border-slate-200/80 p-4 dark:border-slate-800">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">
        {customization.externalToolsTitle}
      </p>
      <nav aria-label="Herramientas externas">
        <ul className="app-scrollbar max-h-72 space-y-2 overflow-y-auto pr-1">
          {customization.externalTools.map((tool) => (
            <li key={tool.name}>
              <a
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                onClick={closeSidebar}
                className="sidebar-link-card inline-flex w-full items-start gap-3 rounded-2xl border border-slate-200/80 px-3 py-2.5 text-sm leading-5 text-slate-600 transition-all duration-200 hover:border-sky-200 hover:text-sky-700 dark:border-slate-800 dark:text-slate-200 dark:hover:border-sky-400/20 dark:hover:text-white"
              >
                <span>{tool.name}</span>
                <span
                  aria-hidden="true"
                  className="text-sm leading-5 text-slate-400 dark:text-slate-400"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );

  const mobileSidebarPanel = (
    <div className="sidebar-shell app-scrollbar min-h-0 flex-1 overflow-y-auto">
      <div className="p-4">
        <IdentityWidget customization={customization} />
      </div>

      <div className="app-scrollbar border-t border-slate-200/70 p-4 dark:border-slate-800/90">
        <div className="space-y-6">
          {defaultSidebarContent}
          {sidebarContent}
        </div>
      </div>
    </div>
  );

  const desktopSidebarPanel = (
    <div className="sidebar-shell flex h-full flex-col">
      <div className="p-4">
        <IdentityWidget customization={customization} />
      </div>

      <div className="app-scrollbar border-t border-slate-200/70 p-4 dark:border-slate-800/90">
        <div className="space-y-6">
          {defaultSidebarContent}
          {sidebarContent}
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-background min-h-screen text-slate-900 dark:text-slate-100">
      <div className="flex min-h-screen">
        <div
          className={`fixed inset-0 z-40 bg-slate-950/45 transition-opacity duration-200 sm:hidden ${
            isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
          onClick={closeSidebar}
          aria-hidden="true"
        />

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[88vw] max-w-80 flex-col overflow-hidden border-r border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950/95 sm:hidden ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-label="Menu lateral movil"
          aria-hidden={!isSidebarOpen}
        >
          <div className="flex items-center justify-end border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <button
              type="button"
              onClick={closeSidebar}
              aria-label="Cerrar menu lateral"
              className="sidebar-soft-button inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-lg text-slate-600 transition-all duration-200 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300"
            >
              ×
            </button>
          </div>
          {mobileSidebarPanel}
        </aside>

        <aside className="hidden w-80 shrink-0 border-r border-slate-200/80 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 sm:block">
          {desktopSidebarPanel}
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="topbar-shell sticky top-0 z-30 min-h-16 border-b border-slate-200 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:supports-[backdrop-filter]:bg-slate-950/80 sm:px-6">
            {topBarContent ?? (
              <div className="flex h-full flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Abrir menu lateral"
                    className="sidebar-soft-button inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-lg text-slate-700 transition-all duration-200 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 sm:hidden"
                  >
                    ☰
                  </button>
                  <button
                    type="button"
                    onClick={handleHomeNavigation}
                    className="group flex min-w-0 items-center gap-3 text-left text-sm font-semibold text-slate-900 transition-all duration-200 hover:text-sky-700 dark:text-slate-100 sm:text-base md:text-lg"
                  >
                    <AppLogo
                      appIconDataUrl={customization.appIconDataUrl}
                      appName={appName}
                      className="h-10 w-10 shrink-0"
                      interactive
                      showWordmark
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <SearchBar
                      value={activeSearchTerm}
                      onChange={handleSearchTermChange}
                    />
                  </div>
                </div>

                {headerActions ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {headerActions}
                  </div>
                ) : null}
              </div>
            )}
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
