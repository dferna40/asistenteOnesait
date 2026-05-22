import { useEffect, useMemo, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { copyTextToClipboard } from '../../utils/clipboard';

interface MarkdownRendererProps {
  content: string;
}

interface MarkdownSection {
  body: string;
  depth: number;
  id: string;
  title: string;
}

interface ZoomedImageState {
  alt: string;
  src: string;
}

function MarkdownImage({
  alt = '',
  onImageClick,
  src = '',
}: {
  alt?: string;
  onImageClick: (image: ZoomedImageState) => void;
  src?: string;
}) {
  const [hasLoadError, setHasLoadError] = useState(false);

  if (!src || hasLoadError) {
    return (
      <div className="my-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/90 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-900/60">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Imagen no encontrada
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {src || 'La referencia de la imagen está vacía o el archivo ya no existe.'}
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        onImageClick({
          alt,
          src,
        })
      }
      className="my-4 block w-full rounded-2xl text-left transition-all duration-300 ease-in-out"
    >
      <img
        src={src}
        alt={alt}
        onError={() => setHasLoadError(true)}
        className="max-h-[300px] max-w-full rounded-2xl object-contain shadow-sm transition-all duration-300 ease-in-out hover:shadow-md"
        loading="lazy"
        style={{ cursor: 'zoom-in' }}
      />
    </button>
  );
}

// Si en el futuro se implementa un microservicio en Java para procesar,
// redimensionar o servir estas imagenes desde un servidor centralizado, es
// obligatorio usar try-catch-resources para el manejo de excepciones y flujos
// de datos (Streams) [cite: 2026-02-12].

const parseMarkdownSections = (content: string) => {
  const headingPattern = /^(#{1,6})\s+(.+)$/;
  const lines = content.split('\n');
  const preamble: string[] = [];
  const sections: MarkdownSection[] = [];
  let currentSection: MarkdownSection | null = null;

  const pushCurrentSection = () => {
    if (!currentSection) {
      return;
    }

    sections.push({
      body: currentSection.body.trim(),
      depth: currentSection.depth,
      id: currentSection.id,
      title: currentSection.title,
    });
  };

  for (const line of lines) {
    const match = line.match(headingPattern);

    if (match) {
      pushCurrentSection();
      currentSection = {
        body: '',
        depth: match[1].length,
        id: `${match[2].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${sections.length}`,
        title: match[2].trim(),
      };
      continue;
    }

    if (currentSection) {
      currentSection.body = currentSection.body
        ? `${currentSection.body}\n${line}`
        : line;
      continue;
    }

    preamble.push(line);
  }

  pushCurrentSection();

  return {
    preamble: preamble.join('\n').trim(),
    sections,
  };
};

function ImageZoomModal({
  image,
  onClose,
}: {
  image: ZoomedImageState;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm transition-all duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt || 'Vista ampliada de imagen'}
      onClick={onClose}
    >
      <div className="absolute right-4 top-4">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white transition-all duration-300 ease-in-out hover:bg-white/20"
          aria-label="Cerrar imagen ampliada"
          title="Cerrar"
        >
          ×
        </button>
      </div>

      <img
        src={image.src}
        alt={image.alt}
        className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl transition-all duration-300 ease-in-out"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

function CodeBlock({
  children,
  className,
  inline,
}: {
  children?: ReactNode;
  className?: string;
  inline?: boolean;
}) {
  const codeValue = String(children ?? '').replace(/\n$/, '');

  if (inline) {
    return (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800 dark:bg-slate-900 dark:text-slate-100">
        {children}
      </code>
    );
  }

  return (
    <div className="group relative my-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg dark:border-slate-700 dark:bg-slate-950">
      <button
        type="button"
        onClick={() => copyTextToClipboard(codeValue)}
        className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-lg border border-blue-500/50 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-300 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-500/20 hover:text-blue-100"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="h-5 w-5"
        >
          <rect
            x="7"
            y="3"
            width="9"
            height="11"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M5 7H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
        Copiar Codigo
      </button>
      <pre className="overflow-x-auto bg-slate-950 px-4 py-4 text-sm text-slate-100">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

const createMarkdownComponents = (
  onImageClick: (image: ZoomedImageState) => void,
) => ({
  a: (props: ComponentProps<'a'>) => (
    <a
      {...props}
      className="font-medium text-sky-700 underline decoration-sky-200 underline-offset-4 transition-colors hover:text-sky-800 dark:text-blue-400 dark:decoration-blue-500"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noreferrer' : undefined}
    />
  ),
  blockquote: (props: ComponentProps<'blockquote'>) => (
    <blockquote
      {...props}
      className="my-4 border-l-4 border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
    />
  ),
  code: CodeBlock,
  h1: (props: ComponentProps<'h1'>) => (
    <h1 {...props} className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100" />
  ),
  h2: (props: ComponentProps<'h2'>) => (
    <h2 {...props} className="mt-6 text-xl font-bold text-slate-900 dark:text-slate-100" />
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3 {...props} className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100" />
  ),
  h4: (props: ComponentProps<'h4'>) => (
    <h4 {...props} className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-100" />
  ),
  img: (props: ComponentProps<'img'>) => (
    <MarkdownImage
      alt={props.alt ?? ''}
      src={props.src ?? ''}
      onImageClick={onImageClick}
    />
  ),
  li: (props: ComponentProps<'li'>) => (
    <li {...props} className="break-words whitespace-pre-wrap [overflow-wrap:anywhere] leading-7 text-slate-700 dark:text-slate-200 marker:text-slate-500 dark:marker:text-slate-300" />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol {...props} className="my-4 list-decimal space-y-2 pl-5" />
  ),
  p: (props: ComponentProps<'p'>) => (
    <p {...props} className="my-3 break-words whitespace-pre-wrap [overflow-wrap:anywhere] leading-7 text-slate-700 dark:text-slate-200" />
  ),
  strong: (props: ComponentProps<'strong'>) => (
    <strong {...props} className="font-semibold text-slate-900 dark:text-white" />
  ),
  table: (props: ComponentProps<'table'>) => (
    <div className="my-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
      <table
        {...props}
        className="min-w-full divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900"
      />
    </div>
  ),
  td: (props: ComponentProps<'td'>) => (
    <td
      {...props}
      className="border-t border-slate-100 px-3 py-2 text-sm break-words [overflow-wrap:anywhere] text-slate-700 dark:border-slate-700 dark:text-slate-200"
    />
  ),
  th: (props: ComponentProps<'th'>) => (
    <th
      {...props}
      className="bg-slate-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:bg-slate-950 dark:text-slate-300"
    />
  ),
  ul: (props: ComponentProps<'ul'>) => (
    <ul {...props} className="my-4 list-disc space-y-2 pl-5" />
  ),
});

function MarkdownSectionAccordion({
  components,
  section,
}: {
  components: ReturnType<typeof createMarkdownComponents>;
  section: MarkdownSection;
}) {
  return (
    <details
      open
      className="group rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/50"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span
          className={`break-words [overflow-wrap:anywhere] font-semibold text-slate-900 dark:text-slate-100 ${
            section.depth <= 2 ? 'text-lg' : 'text-base'
          }`}
        >
          {section.title}
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 transition-transform group-open:rotate-45 dark:text-slate-400">
          +
        </span>
      </summary>

      <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={components}
        >
          {section.body}
        </ReactMarkdown>
      </div>
    </details>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [zoomedImage, setZoomedImage] = useState<ZoomedImageState | null>(null);
  const { preamble, sections } = useMemo(
    () => parseMarkdownSections(content),
    [content],
  );
  const markdownComponents = useMemo(
    () =>
      createMarkdownComponents((image) => {
        if (!image.src) {
          return;
        }

        setZoomedImage(image);
      }),
    [],
  );

  return (
    <>
      <div className="markdown-body min-w-0 break-words [overflow-wrap:anywhere]">
      {preamble ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={markdownComponents}
        >
          {preamble}
        </ReactMarkdown>
      ) : null}

      {sections.length ? (
        <div className="space-y-3">
          {sections.map((section) => (
            <MarkdownSectionAccordion
              key={section.id}
              section={section}
              components={markdownComponents}
            />
          ))}
        </div>
      ) : null}
      </div>

      {zoomedImage ? (
        <ImageZoomModal
          image={zoomedImage}
          onClose={() => setZoomedImage(null)}
        />
      ) : null}
    </>
  );
}
