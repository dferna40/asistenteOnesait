import { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { ResultCard } from './components/ui/ResultCard';
import { categoryThemes } from './constants/categoryColors';
import manualEntries from './data/manual.json';
import { useSearch } from './hooks/useSearch';
import type { KnowledgeCategory, KnowledgeEntry } from './types';

export const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const entries = manualEntries as KnowledgeEntry[];
  const homeCategories: KnowledgeCategory[] = [
    'Entorno',
    'Accesos',
    'Batch',
    'UML',
    'UI',
    'General',
    'Seguros',
  ];
  const categoryDescriptions: Record<KnowledgeCategory, string> = {
    Entorno: 'Accesos remotos, puertos y rutas de configuracion local.',
    Accesos: 'Credenciales de correo, SSH, Oracle y portales corporativos.',
    Batch: 'Procesos, tablas de configuracion y comandos SQL.',
    UML: 'Protocolos de diseno, MagicDraw y bloqueos en SVN.',
    UI: 'Arquitectura de capas NPA, literales y componentes.',
    General: 'Guias de iTeams, gestion de tags y despliegues.',
    Seguros: 'Glosario de negocio y conceptos especificos de RGA.',
  };
  const results = useSearch(entries, searchTerm);
  const categories = homeCategories.filter(
    (category, index) => homeCategories.indexOf(category) === index,
  );
  const hasSearchTerm = searchTerm.trim().length > 0;
  const categorySearchMap: Record<KnowledgeCategory, string> = {
    Entorno: '/env ',
    Accesos: 'Accesos',
    Batch: '/cmd ',
    UI: 'UI',
    UML: '/uml ',
    General: 'General',
    Seguros: 'Seguros',
  };

  return (
    <MainLayout
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      onHomeClick={() => setSearchTerm('')}
    >
      <section className="space-y-5 sm:space-y-6">
        {hasSearchTerm ? (
          <>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Resultados
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {results.length} coincidencia{results.length === 1 ? '' : 's'} para{' '}
                <span className="font-medium text-slate-800">"{searchTerm}"</span>.
              </p>
            </div>

            {results.length ? (
              <div className="grid gap-4">
                {results.map((entry) => (
                  <ResultCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center shadow-sm sm:px-6 sm:py-10">
                <h3 className="text-lg font-semibold text-slate-900">
                  No hemos encontrado resultados
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Prueba con otra palabra clave o usa prefijos como <code>/env</code> o{' '}
                  <code>/cmd</code>.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="animate-fade-in rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Ecosistema de Conocimiento RGA
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Tu centro de mando para la operativa tecnica y de negocio. Acceso
              centralizado a documentacion viva, protocolos de actuacion y
              herramientas de despliegue.
            </p>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              <span className="text-lg leading-none" aria-hidden="true">
                *
              </span>
              <p className="font-medium leading-6">
                Recordatorio: Para cualquier implementacion Java que gestione
                excepciones, utiliza siempre <code>try-catch-resources</code>{' '}
                para garantizar la seguridad del codigo.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSearchTerm(categorySearchMap[category] ?? category)}
                  className={`rounded-2xl border p-4 text-left transition-all duration-200 ${categoryThemes[category].chip}`}
                >
                  <span className="inline-flex rounded-full border border-current/15 px-3 py-2 text-sm font-medium">
                    {category}
                  </span>
                  <span className="mt-2 block text-[11px] leading-5 text-slate-500 sm:text-xs sm:leading-5">
                    {categoryDescriptions[category]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
};
