export type KnowledgeCategory = 'Entorno' | 'Batch' | 'UI' | 'UML' | 'General';

export interface CommandOption {
  label: string;
  value: string;
}

export interface KnowledgeEntry {
  id: string;
  titulo: string;
  categoria: KnowledgeCategory;
  contenido: string;
  pasos?: string[];
  comandos?: CommandOption[];
  tags: string[];
}
