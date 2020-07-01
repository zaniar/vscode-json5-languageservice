import * as Parser from '../parser/json5Parser';
import { TextDocument, Thenable, ColorInformation, ColorPresentation, Color, DocumentSymbolsContext, Range, SymbolInformation, DocumentSymbol } from "../json5LanguageTypes";
import { IJSON5SchemaService } from "./json5SchemaService";
export declare class JSON5DocumentSymbols {
    private schemaService;
    constructor(schemaService: IJSON5SchemaService);
    findDocumentSymbols(document: TextDocument, doc: Parser.JSON5Document, context?: DocumentSymbolsContext): SymbolInformation[];
    findDocumentSymbols2(document: TextDocument, doc: Parser.JSON5Document, context?: DocumentSymbolsContext): DocumentSymbol[];
    private getSymbolKind;
    private getKeyLabel;
    findDocumentColors(document: TextDocument, doc: Parser.JSON5Document, context?: DocumentSymbolsContext): Thenable<ColorInformation[]>;
    getColorPresentations(document: TextDocument, doc: Parser.JSON5Document, color: Color, range: Range): ColorPresentation[];
}
