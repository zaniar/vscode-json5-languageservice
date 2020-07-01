/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { JSON5Completion } from './services/json5Completion';
import { JSON5Hover } from './services/json5Hover';
import { JSON5Validation } from './services/json5Validation';
import { JSON5DocumentSymbols } from './services/json5DocumentSymbols';
import { parse as parseJSON5, newJSON5Document } from './parser/json5Parser';
import { schemaContributions } from './services/configuration';
import { JSON5SchemaService } from './services/json5SchemaService';
import { getFoldingRanges } from './services/json5Folding';
import { getSelectionRanges } from './services/json5SelectionRanges';
import { format as formatJSON5 } from 'json5-parser';
import { Range, TextEdit } from './json5LanguageTypes';
import { findDefinition } from './services/json5Definition';
export * from './json5LanguageTypes';
export function getLanguageService(params) {
    var promise = params.promiseConstructor || Promise;
    var jsonSchemaService = new JSON5SchemaService(params.schemaRequestService, params.workspaceContext, promise);
    jsonSchemaService.setSchemaContributions(schemaContributions);
    var jsonCompletion = new JSON5Completion(jsonSchemaService, params.contributions, promise, params.clientCapabilities);
    var jsonHover = new JSON5Hover(jsonSchemaService, params.contributions, promise);
    var jsonDocumentSymbols = new JSON5DocumentSymbols(jsonSchemaService);
    var jsonValidation = new JSON5Validation(jsonSchemaService, promise);
    return {
        configure: function (settings) {
            jsonSchemaService.clearExternalSchemas();
            if (settings.schemas) {
                settings.schemas.forEach(function (settings) {
                    jsonSchemaService.registerExternalSchema(settings.uri, settings.fileMatch, settings.schema);
                });
            }
            jsonValidation.configure(settings);
        },
        resetSchema: function (uri) { return jsonSchemaService.onResourceChange(uri); },
        doValidation: jsonValidation.doValidation.bind(jsonValidation),
        parseJSON5Document: function (document) { return parseJSON5(document, { collectComments: true }); },
        newJSON5Document: function (root, diagnostics) { return newJSON5Document(root, diagnostics); },
        doResolve: jsonCompletion.doResolve.bind(jsonCompletion),
        doComplete: jsonCompletion.doComplete.bind(jsonCompletion),
        findDocumentSymbols: jsonDocumentSymbols.findDocumentSymbols.bind(jsonDocumentSymbols),
        findDocumentSymbols2: jsonDocumentSymbols.findDocumentSymbols2.bind(jsonDocumentSymbols),
        findColorSymbols: function (d, s) { return jsonDocumentSymbols.findDocumentColors(d, s).then(function (s) { return s.map(function (s) { return s.range; }); }); },
        findDocumentColors: jsonDocumentSymbols.findDocumentColors.bind(jsonDocumentSymbols),
        getColorPresentations: jsonDocumentSymbols.getColorPresentations.bind(jsonDocumentSymbols),
        doHover: jsonHover.doHover.bind(jsonHover),
        getFoldingRanges: getFoldingRanges,
        getSelectionRanges: getSelectionRanges,
        findDefinition: findDefinition,
        format: function (d, r, o) {
            var range = undefined;
            if (r) {
                var offset = d.offsetAt(r.start);
                var length = d.offsetAt(r.end) - offset;
                range = { offset: offset, length: length };
            }
            var options = { tabSize: o ? o.tabSize : 4, insertSpaces: o ? o.insertSpaces : true, eol: '\n' };
            return formatJSON5(d.getText(), range, options).map(function (e) {
                return TextEdit.replace(Range.create(d.positionAt(e.offset), d.positionAt(e.offset + e.length)), e.content);
            });
        }
    };
}
