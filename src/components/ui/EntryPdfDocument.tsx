import type { ComponentProps, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import type { CategoryDefinition, KnowledgeEntry } from '../../types';

interface PrintTemplateProps {
  category?: CategoryDefinition;
  containerRef: (node: HTMLDivElement | null) => void;
  entry: KnowledgeEntry;
}

interface MarkdownHeading {
  depth: number;
  id: string;
  title: string;
}

const extractHeadings = (content: string) =>
  content
    .split('\n')
    .map((line) => line.match(/^(#{2,6})\s+(.+)$/))
    .filter(Boolean)
    .map((match, index) => ({
      depth: match![1].length,
      id: `toc-${index}-${match![2]
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}`,
      title: match![2].trim(),
    })) satisfies MarkdownHeading[];

const pdfMarkdownComponents = {
  a: (props: ComponentProps<'a'>) => (
    <a
      {...props}
      style={{
        color: '#2563eb',
        textDecoration: 'underline',
        fontWeight: 600,
      }}
    />
  ),
  code: ({
    children,
    className,
    inline,
  }: {
    children?: ReactNode;
    className?: string;
    inline?: boolean;
  }) => {
    if (inline) {
      return (
        <code
          style={{
            backgroundColor: '#e2e8f0',
            borderRadius: 4,
            color: '#0f172a',
            fontFamily: '"Courier New", monospace',
            fontSize: 9,
            padding: '1px 5px',
          }}
        >
          {children}
        </code>
      );
    }

    return (
      <div
        className="pdf-avoid-break"
        style={{
          backgroundColor: '#e5e7eb',
          border: '1px solid #cbd5e1',
          borderRadius: 8,
          margin: '10px 0',
          overflow: 'hidden',
          pageBreakInside: 'avoid',
        }}
      >
        <pre
          style={{
            color: '#0f172a',
            fontFamily: '"Courier New", monospace',
            fontSize: 9,
            lineHeight: 1.45,
            margin: 0,
            overflowX: 'auto',
            padding: '10px 12px',
            pageBreakInside: 'avoid',
            whiteSpace: 'pre-wrap',
          }}
        >
          <code className={className}>{children}</code>
        </pre>
      </div>
    );
  },
  h1: (props: ComponentProps<'h1'>) => (
    <h1
      {...props}
      style={{
        color: '#0f172a',
        fontSize: 18,
        fontWeight: 700,
        margin: '16px 0 8px',
      }}
    />
  ),
  h2: (props: ComponentProps<'h2'>) => {
    const contentText = String(props.children ?? '');
    const anchorId = contentText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return (
      <h2
        {...props}
        id={anchorId}
        style={{
          color: '#0f172a',
          fontSize: 14,
          fontWeight: 700,
          margin: '16px 0 8px',
        }}
      />
    );
  },
  h3: (props: ComponentProps<'h3'>) => {
    const contentText = String(props.children ?? '');
    const anchorId = contentText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return (
      <h3
        {...props}
        id={anchorId}
        style={{
          color: '#0f172a',
          fontSize: 12,
          fontWeight: 700,
          margin: '14px 0 6px',
        }}
      />
    );
  },
  h4: (props: ComponentProps<'h4'>) => (
    <h4
      {...props}
      style={{
        color: '#0f172a',
        fontSize: 11,
        fontWeight: 700,
        margin: '12px 0 5px',
      }}
    />
  ),
  img: (props: ComponentProps<'img'>) => (
    <img
      {...props}
      className="pdf-avoid-break"
      style={{
        borderRadius: 10,
        display: 'block',
        margin: '12px auto',
        maxHeight: '300px',
        maxWidth: '100%',
        pageBreakInside: 'avoid',
      }}
    />
  ),
  li: (props: ComponentProps<'li'>) => (
    <li
      {...props}
      style={{
        color: '#1e293b',
        fontSize: 10.5,
        lineHeight: 1.5,
        marginBottom: 4,
      }}
    />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol {...props} style={{ color: '#1e293b', margin: '8px 0', paddingLeft: 18 }} />
  ),
  p: (props: ComponentProps<'p'>) => (
    <p
      {...props}
      style={{
        color: '#1e293b',
        fontSize: 10.5,
        lineHeight: 1.5,
        margin: '7px 0',
      }}
    />
  ),
  strong: (props: ComponentProps<'strong'>) => (
    <strong {...props} style={{ color: '#0f172a', fontWeight: 700 }} />
  ),
  table: (props: ComponentProps<'table'>) => (
    <div
      className="pdf-avoid-break"
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: 8,
        margin: '10px 0',
        overflow: 'hidden',
        pageBreakInside: 'avoid',
      }}
    >
      <table
        {...props}
        style={{
          borderCollapse: 'collapse',
          minWidth: '100%',
        }}
      />
    </div>
  ),
  td: (props: ComponentProps<'td'>) => (
    <td
      {...props}
      style={{
        borderTop: '1px solid #e2e8f0',
        color: '#1e293b',
        fontSize: 10,
        padding: '7px 9px',
        verticalAlign: 'top',
      }}
    />
  ),
  th: (props: ComponentProps<'th'>) => (
    <th
      {...props}
      style={{
        backgroundColor: '#f8fafc',
        color: '#475569',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.08em',
        padding: '7px 9px',
        textAlign: 'left',
        textTransform: 'uppercase',
      }}
    />
  ),
  ul: (props: ComponentProps<'ul'>) => (
    <ul {...props} style={{ color: '#1e293b', margin: '8px 0', paddingLeft: 18 }} />
  ),
};

export function PrintTemplate({
  category,
  containerRef,
  entry,
}: PrintTemplateProps) {
  const headings = extractHeadings(entry.contenido);

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        fontFamily: 'Arial, Roboto, sans-serif',
        padding: '24px 28px 28px',
        width: '800px',
      }}
    >
      <header
        className="pdf-avoid-break"
        style={{
          alignItems: 'baseline',
          borderBottom: '1px solid #cbd5e1',
          display: 'flex',
          gap: 16,
          justifyContent: 'space-between',
          marginBottom: 16,
          paddingBottom: 12,
          pageBreakInside: 'avoid',
        }}
      >
        <h1
          style={{
            color: '#0f172a',
            fontSize: 18,
            fontWeight: 700,
            margin: 0,
          }}
        >
          {entry.titulo}
        </h1>
        <p
          style={{
            color: '#475569',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.14em',
            margin: 0,
            textAlign: 'right',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Asistente Onsite RGA
        </p>
      </header>

      {category?.description ? (
        <p style={{ color: '#334155', fontSize: 10.5, lineHeight: 1.5, margin: '0 0 12px' }}>
          {category.description}
        </p>
      ) : null}

      {headings.length ? (
        <section
          className="pdf-avoid-break"
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            marginBottom: 16,
            padding: '12px 14px',
            pageBreakInside: 'avoid',
          }}
        >
          <h2
            style={{
              color: '#0f172a',
              fontSize: 12,
              fontWeight: 700,
              margin: 0,
            }}
          >
            Indice
          </h2>
          <ol style={{ color: '#1e293b', margin: '8px 0 0', paddingLeft: 16 }}>
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{
                  fontSize: 10,
                  lineHeight: 1.4,
                  marginLeft: Math.max(0, (heading.depth - 2) * 8),
                }}
              >
                {heading.title}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={pdfMarkdownComponents}
        >
          {entry.contenido}
        </ReactMarkdown>
      </section>

      {entry.pasos?.length ? (
        <section
          className="pdf-avoid-break"
          style={{ marginTop: 18, pageBreakInside: 'avoid' }}
        >
          <h2 style={{ color: '#0f172a', fontSize: 13, fontWeight: 700, margin: '0 0 7px' }}>
            Pasos
          </h2>
          <ol style={{ color: '#1e293b', margin: 0, paddingLeft: 18 }}>
            {entry.pasos.map((step) => (
              <li key={step} style={{ fontSize: 10.5, lineHeight: 1.5, marginBottom: 4 }}>
                {step}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {entry.comandos?.length ? (
        <section style={{ marginTop: 18 }}>
          <h2 style={{ color: '#0f172a', fontSize: 13, fontWeight: 700, margin: '0 0 7px' }}>
            Parametros y comandos utiles
          </h2>
          <div style={{ display: 'grid', gap: 4 }}>
            {entry.comandos.map((command, index) => (
              <div
                key={`${command.label}-${index}`}
                className="pdf-avoid-break"
                style={{
                  alignItems: 'start',
                  display: 'grid',
                  gap: 6,
                  gridTemplateColumns: '115px minmax(0, 1fr)',
                  pageBreakInside: 'avoid',
                  padding: '2px 0',
                }}
              >
                <p
                  style={{
                    color: '#0f172a',
                    fontSize: 9.5,
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {command.label}
                </p>
                <code
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: 5,
                    color: '#0f172a',
                    display: 'block',
                    fontFamily: '"Courier New", monospace',
                    fontSize: 9.5,
                    padding: '4px 6px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {command.value}
                </code>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
