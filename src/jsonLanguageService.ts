/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { JSON5Completion } from './services/json5Completion';
import { JSON5Hover } from './services/json5Hover';
import { JSON5Validation } from './services/json5Validation';

import { JSON5DocumentSymbols } from './services/json5DocumentSymbols';
import { parse as parseJSON5, JSON5Document as InternalJSON5Document, newJSON5Document } from './parser/json5Parser';
import { schemaContributions } from './services/configuration';
import { JSON5SchemaService } from './services/json5SchemaService';
import { getFoldingRanges } from './services/json5Folding';
import { getSelectionRanges } from './services/json5SelectionRanges';

import { format as formatJSON5, Range as JSON5CRange } from 'json5-parser';
import {
	Thenable,
	ASTNode,
	Color, ColorInformation, ColorPresentation,
	LanguageServiceParams, LanguageSettings, DocumentLanguageSettings,
	FoldingRange, JSON5Schema, SelectionRange, FoldingRangesContext, DocumentSymbolsContext, ColorInformationContext as DocumentColorsContext,
	TextDocument,
	Position, CompletionItem, CompletionList, Hover, Range, SymbolInformation, Diagnostic,
	TextEdit, FormattingOptions, DocumentSymbol, DefinitionLink
} from './json5LanguageTypes';
import { findDefinition } from './services/json5Definition';

export type JSON5Document = {};
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


export function getLanguageService(params: LanguageServiceParams): LanguageService {
	const promise = params.promiseConstructor || Promise;

	const jsonSchemaService = new JSON5SchemaService(params.schemaRequestService, params.workspaceContext, promise);
	jsonSchemaService.setSchemaContributions(schemaContributions);

	const jsonCompletion = new JSON5Completion(jsonSchemaService, params.contributions, promise, params.clientCapabilities);
	const jsonHover = new JSON5Hover(jsonSchemaService, params.contributions, promise);
	const jsonDocumentSymbols = new JSON5DocumentSymbols(jsonSchemaService);
	const jsonValidation = new JSON5Validation(jsonSchemaService, promise);

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
		parseJSON5Document: (document: TextDocument) => parseJSON5(document, { collectComments: true }),
		newJSON5Document: (root: ASTNode, diagnostics: Diagnostic[]) => newJSON5Document(root, diagnostics),
		doResolve: jsonCompletion.doResolve.bind(jsonCompletion),
		doComplete: jsonCompletion.doComplete.bind(jsonCompletion),
		findDocumentSymbols: jsonDocumentSymbols.findDocumentSymbols.bind(jsonDocumentSymbols),
		findDocumentSymbols2: jsonDocumentSymbols.findDocumentSymbols2.bind(jsonDocumentSymbols),
		findColorSymbols: (d, s) => jsonDocumentSymbols.findDocumentColors(d, <InternalJSON5Document>s).then(s => s.map(s => s.range)),
		findDocumentColors: jsonDocumentSymbols.findDocumentColors.bind(jsonDocumentSymbols),
		getColorPresentations: jsonDocumentSymbols.getColorPresentations.bind(jsonDocumentSymbols),
		doHover: jsonHover.doHover.bind(jsonHover),
		getFoldingRanges,
		getSelectionRanges,
		findDefinition,
		format: (d, r, o) => {
			let range: JSON5CRange | undefined = undefined;
			if (r) {
				const offset = d.offsetAt(r.start);
				const length = d.offsetAt(r.end) - offset;
				range = { offset, length };
			}
			const options = { tabSize: o ? o.tabSize : 4, insertSpaces: o ? o.insertSpaces : true, eol: '\n' };
			return formatJSON5(d.getText(), range, options).map(e => {
				return TextEdit.replace(Range.create(d.positionAt(e.offset), d.positionAt(e.offset + e.length)), e.content);
			});
		}
	};
}
