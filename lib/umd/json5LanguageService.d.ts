import { Thenable, ASTNode, Color, ColorInformation, ColorPresentation, LanguageServiceParams, LanguageSettings, DocumentLanguageSettings, FoldingRange, JSON5Schema, SelectionRange, FoldingRangesContext, DocumentSymbolsContext, ColorInformationContext as DocumentColorsContext, TextDocument, Position, CompletionItem, CompletionList, Hover, Range, SymbolInformation, Diagnostic, TextEdit, FormattingOptions, DocumentSymbol, DefinitionLink } from './json5LanguageTypes';
export declare type JSON5Document = {};
export * from './json5LanguageTypes';
export interface LanguageService {
    configure(settings: LanguageSettings): void;
    doValidation(document: TextDocument, jsonDocument: JSON5Document, documentSettings?: DocumentLanguageSettings, schema?: JSON5Schema): Thenable<Diagnostic[]>;
    parseJSON5Document(document: TextDocument): JSON5Document;
    newJSON5Document(rootNode: ASTNode, syntaxDiagnostics?: Diagnostic[]): JSON5Document;
    resetSchema(uri: string): boolean;
    doResolve(item: CompletionItem): Thenable<CompletionItem>;
    doComplete(document: TextDocument, position: Position, doc: JSON5Document): Thenable<CompletionList | null>;
    findDocumentSymbols(document: TextDocument, doc: JSON5Document, context?: DocumentSymbolsContext): SymbolInformation[];
    findDocumentSymbols2(document: TextDocument, doc: JSON5Document, context?: DocumentSymbolsContext): DocumentSymbol[];
    /** deprecated, use findDocumentColors instead */
    findColorSymbols(document: TextDocument, doc: JSON5Document): Thenable<Range[]>;
    findDocumentColors(document: TextDocument, doc: JSON5Document, context?: DocumentColorsContext): Thenable<ColorInformation[]>;
    getColorPresentations(document: TextDocument, doc: JSON5Document, color: Color, range: Range): ColorPresentation[];
    doHover(document: TextDocument, position: Position, doc: JSON5Document): Thenable<Hover | null>;
    format(document: TextDocument, range: Range, options: FormattingOptions): TextEdit[];
    getFoldingRanges(document: TextDocument, context?: FoldingRangesContext): FoldingRange[];
    getSelectionRanges(document: TextDocument, positions: Position[], doc: JSON5Document): SelectionRange[];
    findDefinition(document: TextDocument, position: Position, doc: JSON5Document): Thenable<DefinitionLink[]>;
}
export declare function getLanguageService(params: LanguageServiceParams): LanguageService;
