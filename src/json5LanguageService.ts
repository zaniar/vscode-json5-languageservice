/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { JSONCompletion } from './services/json5Completion';
import { JSONHover } from './services/json5Hover';
import { JSONValidation } from './services/json5Validation';

import { JSON5DocumentSymbols } from './services/json5DocumentSymbols';
import { parse as parseJSON, JSON5Document as InternalJSONDocument, newJSON5Document } from './parser/json5Parser';
import { schemaContributions } from './services/configuration';
import { JSON5SchemaService } from './services/json5SchemaService';
import { getFoldingRanges } from './services/json5Folding';
import { getSelectionRanges } from './services/json5SelectionRanges';

import { format as formatJSON, Range as JSONCRange } from 'jsonc-parser';
import {
	Thenable,
	ASTNode,
	Color, ColorInformation, ColorPresentation,
	LanguageServiceParams, LanguageSettings, DocumentLanguageSettings,
	FoldingRange, JSONSchema, SelectionRange, FoldingRangesContext, DocumentSymbolsContext, ColorInformationContext as DocumentColorsContext,
	TextDocument,
	Position, CompletionItem, CompletionList, Hover, Range, SymbolInformation, Diagnostic,
	TextEdit, FormattingOptions, DocumentSymbol, DefinitionLink
} from './json5LanguageTypes';
import { findDefinition } from './services/json5Definition';

export type JSONDocument = {};
export * from './json5LanguageTypes';

export interface LanguageService {
	configure(settings: LanguageSettings): void;
	doValidation(document: TextDocument, jsonDocument: JSONDocument, documentSettings?: DocumentLanguageSettings, schema?: JSONSchema): Thenable<Diagnostic[]>;
	parseJSON5Document(document: TextDocument): JSONDocument;
	newJSON5Document(rootNode: ASTNode, syntaxDiagnostics?: Diagnostic[]): JSONDocument;
	resetSchema(uri: string): boolean;
	doResolve(item: CompletionItem): Thenable<CompletionItem>;
	doComplete(document: TextDocument, position: Position, doc: JSONDocument): Thenable<CompletionList | null>;
	findDocumentSymbols(document: TextDocument, doc: JSONDocument, context?: DocumentSymbolsContext): SymbolInformation[];
	findDocumentSymbols2(document: TextDocument, doc: JSONDocument, context?: DocumentSymbolsContext): DocumentSymbol[];
	/** deprecated, use findDocumentColors instead */
	findColorSymbols(document: TextDocument, doc: JSONDocument): Thenable<Range[]>;
	findDocumentColors(document: TextDocument, doc: JSONDocument, context?: DocumentColorsContext): Thenable<ColorInformation[]>;
	getColorPresentations(document: TextDocument, doc: JSONDocument, color: Color, range: Range): ColorPresentation[];
	doHover(document: TextDocument, position: Position, doc: JSONDocument): Thenable<Hover | null>;
	format(document: TextDocument, range: Range, options: FormattingOptions): TextEdit[];
	getFoldingRanges(document: TextDocument, context?: FoldingRangesContext): FoldingRange[];
	getSelectionRanges(document: TextDocument, positions: Position[], doc: JSONDocument): SelectionRange[];
	findDefinition(document: TextDocument, position: Position, doc: JSONDocument): Thenable<DefinitionLink[]>;
}


export function getLanguageService(params: LanguageServiceParams): LanguageService {
	const promise = params.promiseConstructor || Promise;

	const jsonSchemaService = new JSON5SchemaService(params.schemaRequestService, params.workspaceContext, promise);
	jsonSchemaService.setSchemaContributions(schemaContributions);

	const jsonCompletion = new JSONCompletion(jsonSchemaService, params.contributions, promise, params.clientCapabilities);
	const jsonHover = new JSONHover(jsonSchemaService, params.contributions, promise);
	const jsonDocumentSymbols = new JSON5DocumentSymbols(jsonSchemaService);
	const jsonValidation = new JSONValidation(jsonSchemaService, promise);

	return {
		configure: (settings: LanguageSettings) => {
			jsonSchemaService.clearExternalSchemas();
			if (settings.schemas) {
				settings.schemas.forEach(settings => {
					jsonSchemaService.registerExternalSchema(settings.uri, settings.fileMatch, settings.schema);
				});
			}
			jsonValidation.configure(settings);
		},
		resetSchema: (uri: string) => jsonSchemaService.onResourceChange(uri),
		doValidation: jsonValidation.doValidation.bind(jsonValidation),
		parseJSON5Document: (document: TextDocument) => parseJSON(document, { collectComments: true }),
		newJSON5Document: (root: ASTNode, diagnostics: Diagnostic[]) => newJSON5Document(root, diagnostics),
		doResolve: jsonCompletion.doResolve.bind(jsonCompletion),
		doComplete: jsonCompletion.doComplete.bind(jsonCompletion),
		findDocumentSymbols: jsonDocumentSymbols.findDocumentSymbols.bind(jsonDocumentSymbols),
		findDocumentSymbols2: jsonDocumentSymbols.findDocumentSymbols2.bind(jsonDocumentSymbols),
		findColorSymbols: (d, s) => jsonDocumentSymbols.findDocumentColors(d, <InternalJSONDocument>s).then(s => s.map(s => s.range)),
		findDocumentColors: jsonDocumentSymbols.findDocumentColors.bind(jsonDocumentSymbols),
		getColorPresentations: jsonDocumentSymbols.getColorPresentations.bind(jsonDocumentSymbols),
		doHover: jsonHover.doHover.bind(jsonHover),
		getFoldingRanges,
		getSelectionRanges,
		findDefinition,
		format: (d, r, o) => {
			let range: JSONCRange | undefined = undefined;
			if (r) {
				const offset = d.offsetAt(r.start);
				const length = d.offsetAt(r.end) - offset;
				range = { offset, length };
			}
			const options = { tabSize: o ? o.tabSize : 4, insertSpaces: o ? o.insertSpaces : true, eol: '\n' };
			return formatJSON(d.getText(), range, options).map(e => {
				return TextEdit.replace(Range.create(d.positionAt(e.offset), d.positionAt(e.offset + e.length)), e.content);
			});
		}
	};
}
