import { useMemo } from 'react';
import type { KnowledgeEntry } from '../types';

const normalize = (value: string) => value.trim().toLowerCase();
const stripMarkdown = (value: string) =>
  value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1 $2')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 $2')
    .replace(/^#{1,6}\s+/gm, ' ')
    .replace(/[>*_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const buildEntrySearchBlob = (entry: KnowledgeEntry) =>
  [
    entry.titulo,
    entry.categoria,
    entry.contenido,
    stripMarkdown(entry.contenido),
    entry.tags.join(' '),
    entry.pasos?.join(' ') ?? '',
    entry.comandos?.map((command) => `${command.label} ${command.value}`).join(' ') ?? '',
  ]
    .join(' ')
    .toLowerCase();

export function useSearch(
  entries: KnowledgeEntry[],
  rawSearchTerm: string,
  activeCategoryFilter?: string,
  activeTagFilter?: string,
) {
  return useMemo(() => {
    const term = normalize(rawSearchTerm);
    const normalizedCategoryFilter = normalize(activeCategoryFilter ?? '');
    const normalizedTagFilter = normalize(activeTagFilter ?? '');
    let filteredEntries = entries;

    if (normalizedCategoryFilter) {
      filteredEntries = filteredEntries.filter(
        (entry) => normalize(entry.categoria) === normalizedCategoryFilter,
      );
    }

    if (normalizedTagFilter) {
      filteredEntries = filteredEntries.filter((entry) =>
        entry.tags.some((tag) => normalize(tag) === normalizedTagFilter),
      );
    }

    if (!term) {
      return filteredEntries;
    }

    if (term.startsWith('/cmd')) {
      const cmdQuery = normalize(term.replace('/cmd', ''));

      return filteredEntries.filter((entry) => {
        const validCategory =
          entry.categoria === 'Batch' || entry.categoria === 'General';
        const hasCommands = Boolean(entry.comandos?.length);

        if (!validCategory || !hasCommands) {
          return false;
        }

        if (!cmdQuery) {
          return true;
        }

        return buildEntrySearchBlob(entry).includes(cmdQuery);
      });
    }

    if (term.startsWith('/env')) {
      const envQuery = normalize(term.replace('/env', ''));

      return filteredEntries.filter((entry) => {
        if (entry.categoria !== 'Entorno') {
          return false;
        }

        if (!envQuery) {
          return true;
        }

        return buildEntrySearchBlob(entry).includes(envQuery);
      });
    }

    if (term.startsWith('/uml')) {
      const umlQuery = normalize(term.replace('/uml', ''));

      return filteredEntries.filter((entry) => {
        if (entry.categoria !== 'UML') {
          return false;
        }

        if (!umlQuery) {
          return true;
        }

        return buildEntrySearchBlob(entry).includes(umlQuery);
      });
    }

    return filteredEntries.filter((entry) => buildEntrySearchBlob(entry).includes(term));
  }, [activeCategoryFilter, activeTagFilter, entries, rawSearchTerm]);
}
