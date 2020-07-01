import { Position, SelectionRange, TextDocument } from '../json5LanguageTypes';
import { JSON5Document } from '../parser/json5Parser';
export declare function getSelectionRanges(document: TextDocument, positions: Position[], doc: JSON5Document): SelectionRange[];
