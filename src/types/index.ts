export type KnowledgeCategory =
  | 'Entorno'
  | 'Batch'
  | 'UI'
  | 'UML'
  | 'General'
  | 'Seguros'
  | 'Accesos';

export interface CommandOption {
  label: string;
  value: string;
}

export interface CommandOverride {
  label: string;
  value: string;
}

export type CommandOverridesByEntry = Record<string, CommandOverride[]>;

export interface KnowledgeEntry {
  id: string;
  titulo: string;
  categoria: KnowledgeCategory;
  contenido: string;
  pasos?: string[];
  comandos?: CommandOption[];
  tags: string[];
}
