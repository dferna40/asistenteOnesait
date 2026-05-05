import { categoryColors, categoryThemes } from '../../constants/categoryColors';
import type { KnowledgeEntry } from '../../types';

interface ResultCardProps {
  entry: KnowledgeEntry;
}

const technicalTokenPattern =
  /([A-Za-z]:\\[^\s\n]+|\/[a-z]+|[A-Z_]{2,}(?:\.[A-Z_]+)?|SELECT\s+[^.\n;]+;?)/g;

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

const isTechnicalToken = (value: string) =>
  /^[A-Za-z]:\\[^\s\n]+$/.test(value) ||
  /^\/[a-z]+$/i.test(value) ||
  /^[A-Z_]{2,}(?:\.[A-Z_]+)?$/.test(value) ||
  /^SELECT\s+/i.test(value);

const renderTechnicalText = (text: string, keyPrefix: string) =>
  text.split(technicalTokenPattern).map((part, index) =>
    isTechnicalToken(part) ? (
      <code
        key={`${keyPrefix}-${index}`}
        className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800"
      >
        {part}
      </code>
    ) : (
      <span key={`${keyPrefix}-${index}`}>{part}</span>
    ),
  );

export function ResultCard({ entry }: ResultCardProps) {
  const categoryStyle = categoryThemes[entry.categoria];
  const categoryColor = categoryColors[entry.categoria];
  const isAccessCategory = entry.categoria === 'Accesos';

  // Para cualquier integración futura de servicios de autenticación en Java,
  // utilizar try-catch-resources para garantizar el cierre seguro de conexiones.

  return (
    <article
      className={`w-full rounded-2xl border border-slate-100 border-l-4 bg-white p-4 shadow-sm sm:p-5 ${categoryStyle.cardAccent}`}
      data-category-color={categoryColor}
    >
      {entry.categoria === 'UML' ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          ⚠️ PROTOCOLO CRÍTICO: ¿Has hecho el LOCK en SVN?
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${categoryStyle.badge}`}
          >
            {entry.categoria}
          </span>
          <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
            {entry.titulo}
          </h3>
        </div>

        <span className="w-fit rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
          {entry.id}
        </span>
      </div>

      <div className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
        {renderTechnicalText(entry.contenido, `${entry.id}-content`)}
      </div>

      {entry.pasos?.length ? (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-slate-800">Pasos</h4>
          <ol className="mt-2 space-y-2 pl-5 text-sm leading-6 text-slate-600">
            {entry.pasos.map((step, index) => (
              <li key={step} className="list-decimal">
                {renderTechnicalText(step, `${entry.id}-step-${index}`)}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {entry.comandos?.length ? (
        <div className="mt-5">
          <h4 className="text-sm font-semibold text-slate-800">Comandos utiles</h4>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {entry.comandos.map((command) => (
              <button
                key={`${entry.id}-${command.label}`}
                type="button"
                onClick={() => copyToClipboard(command.value)}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 transition-all duration-200 sm:w-auto ${categoryStyle.button} ${
                  isAccessCategory
                    ? 'px-2.5 py-1.5 text-xs leading-4'
                    : 'px-3 py-2 text-sm'
                }`}
              >
                Copiar {command.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
