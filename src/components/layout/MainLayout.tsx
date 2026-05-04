import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  topBarContent?: ReactNode;
  sidebarContent?: ReactNode;
}

export function MainLayout({
  children,
  topBarContent,
  sidebarContent,
}: MainLayoutProps) {
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
          <header className="sticky top-0 z-10 h-16 border-b border-slate-200 bg-white/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <div className="flex h-full items-center justify-between">
              {topBarContent ?? (
                <h1 className="text-base font-semibold md:text-lg">
                  Asistente de Supervivencia RGA
                </h1>
              )}
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
