export interface KnowledgeEntry {
  id: string;
  titulo: string;
  categoria: string;
  contenido: string;
  tags: string[];
  pasos?: string[];
}
