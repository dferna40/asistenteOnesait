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
    'Batch',
    'UML',
    'UI',
    'General',
    'Seguros',
  ];
  const categoryDescriptions: Record<KnowledgeCategory, string> = {
    Entorno: 'Accesos remotos, puertos y rutas de configuracion local.',
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
      <section className="space-y-6">
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
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
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
          <div className="animate-fade-in rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Ecosistema de Conocimiento RGA
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-slate-600">
              Tu centro de mando para la operativa técnica y de negocio. Acceso
              centralizado a documentación viva, protocolos de actuación y
              herramientas de despliegue.
            </p>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              <span className="text-lg leading-none" aria-hidden="true">
                💡
              </span>
              <p className="font-medium leading-6">
                Recordatorio: Para cualquier implementación Java que gestione
                excepciones, utiliza siempre <code>try-catch-resources</code>{' '}
                para garantizar la seguridad del código.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  <span className="mt-1 block text-xs text-slate-500">
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
