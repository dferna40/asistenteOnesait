import { useMemo } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownRendererProps {
  content: string;
}

interface MarkdownSection {
  body: string;
  depth: number;
  id: string;
  title: string;
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
      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-800">
        {children}
      </code>
    );
  }

  return (
    <div className="group relative my-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg">
      <button
        type="button"
        onClick={() => copyToClipboard(codeValue)}
        className="absolute right-3 top-3 z-10 rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1 text-[11px] font-medium text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800"
      >
        Copiar Código
      </button>
      <pre className="overflow-x-auto px-4 py-4 text-sm text-slate-100">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

const markdownComponents = {
  a: (props: ComponentProps<'a'>) => (
    <a
      {...props}
      className="font-medium text-sky-700 underline decoration-sky-200 underline-offset-4 transition-colors hover:text-sky-800"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noreferrer' : undefined}
    />
  ),
  blockquote: (props: ComponentProps<'blockquote'>) => (
    <blockquote
      {...props}
      className="my-4 border-l-4 border-slate-300 bg-slate-50 px-4 py-3 text-slate-700"
    />
  ),
  code: CodeBlock,
  h1: (props: ComponentProps<'h1'>) => (
    <h1 {...props} className="mt-6 text-2xl font-bold text-slate-900" />
  ),
  h2: (props: ComponentProps<'h2'>) => (
    <h2 {...props} className="mt-6 text-xl font-bold text-slate-900" />
  ),
  h3: (props: ComponentProps<'h3'>) => (
    <h3 {...props} className="mt-5 text-lg font-semibold text-slate-900" />
  ),
  h4: (props: ComponentProps<'h4'>) => (
    <h4 {...props} className="mt-5 text-base font-semibold text-slate-900" />
  ),
  img: (props: ComponentProps<'img'>) => (
    <img
      {...props}
      className="max-w-full rounded-lg shadow-md"
      loading="lazy"
    />
  ),
  li: (props: ComponentProps<'li'>) => (
    <li {...props} className="leading-7 text-slate-700" />
  ),
  ol: (props: ComponentProps<'ol'>) => (
    <ol {...props} className="my-4 list-decimal space-y-2 pl-5" />
  ),
  p: (props: ComponentProps<'p'>) => (
    <p {...props} className="my-3 leading-7 text-slate-700" />
  ),
  table: (props: ComponentProps<'table'>) => (
    <div className="my-4 overflow-x-auto rounded-2xl border border-slate-200">
      <table {...props} className="min-w-full divide-y divide-slate-200 bg-white" />
    </div>
  ),
  td: (props: ComponentProps<'td'>) => (
    <td {...props} className="border-t border-slate-100 px-3 py-2 text-sm text-slate-700" />
  ),
  th: (props: ComponentProps<'th'>) => (
    <th
      {...props}
      className="bg-slate-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
    />
  ),
  ul: (props: ComponentProps<'ul'>) => (
    <ul {...props} className="my-4 list-disc space-y-2 pl-5" />
  ),
};

function MarkdownSectionAccordion({
  section,
}: {
  section: MarkdownSection;
}) {
  return (
    <details
      open
      className="group rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span
          className={`font-semibold text-slate-900 ${
            section.depth <= 2 ? 'text-lg' : 'text-base'
          }`}
        >
          {section.title}
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>

      <div className="mt-3 border-t border-slate-200 pt-3">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={markdownComponents}
        >
          {section.body}
        </ReactMarkdown>
      </div>
    </details>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { preamble, sections } = useMemo(
    () => parseMarkdownSections(content),
    [content],
  );

  return (
    <div className="markdown-body">
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
            <MarkdownSectionAccordion key={section.id} section={section} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
