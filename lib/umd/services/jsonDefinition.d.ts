import { DefinitionLink, Position, TextDocument, Thenable } from '../json5LanguageTypes';
import { JSON5Document } from '../parser/json5Parser';
export declare function findDefinition(document: TextDocument, position: Position, doc: JSON5Document): Thenable<DefinitionLink[]>;
