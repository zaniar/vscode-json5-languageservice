/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./services/json5Completion", "./services/json5Hover", "./services/json5Validation", "./services/json5DocumentSymbols", "./parser/json5Parser", "./services/configuration", "./services/json5SchemaService", "./services/json5Folding", "./services/json5SelectionRanges", "json5-parser", "./json5LanguageTypes", "./services/json5Definition", "./json5LanguageTypes"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    var json5Completion_1 = require("./services/json5Completion");
    var json5Hover_1 = require("./services/json5Hover");
    var json5Validation_1 = require("./services/json5Validation");
    var json5DocumentSymbols_1 = require("./services/json5DocumentSymbols");
    var json5Parser_1 = require("./parser/json5Parser");
    var configuration_1 = require("./services/configuration");
    var json5SchemaService_1 = require("./services/json5SchemaService");
    var json5Folding_1 = require("./services/json5Folding");
    var json5SelectionRanges_1 = require("./services/json5SelectionRanges");
    var json5_parser_1 = require("json5-parser");
    var json5LanguageTypes_1 = require("./json5LanguageTypes");
    var json5Definition_1 = require("./services/json5Definition");
    __export(require("./json5LanguageTypes"));
    function getLanguageService(params) {
        var promise = params.promiseConstructor || Promise;
        var jsonSchemaService = new json5SchemaService_1.JSON55SchemaService(params.schemaRequestService, params.workspaceContext, promise);
        jsonSchemaService.setSchemaContributions(configuration_1.schemaContributions);
        var jsonCompletion = new json5Completion_1.JSON5Completion(jsonSchemaService, params.contributions, promise, params.clientCapabilities);
        var jsonHover = new json5Hover_1.JSON5Hover(jsonSchemaService, params.contributions, promise);
        var jsonDocumentSymbols = new json5DocumentSymbols_1.JSON55DocumentSymbols(jsonSchemaService);
        var jsonValidation = new json5Validation_1.JSON5Validation(jsonSchemaService, promise);
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
            parseJSON55Document: function (document) { return json5Parser_1.parse(document, { collectComments: true }); },
            newJSON55Document: function (root, diagnostics) { return json5Parser_1.newJSON55Document(root, diagnostics); },
            doResolve: jsonCompletion.doResolve.bind(jsonCompletion),
            doComplete: jsonCompletion.doComplete.bind(jsonCompletion),
            findDocumentSymbols: jsonDocumentSymbols.findDocumentSymbols.bind(jsonDocumentSymbols),
            findDocumentSymbols2: jsonDocumentSymbols.findDocumentSymbols2.bind(jsonDocumentSymbols),
            findColorSymbols: function (d, s) { return jsonDocumentSymbols.findDocumentColors(d, s).then(function (s) { return s.map(function (s) { return s.range; }); }); },
            findDocumentColors: jsonDocumentSymbols.findDocumentColors.bind(jsonDocumentSymbols),
            getColorPresentations: jsonDocumentSymbols.getColorPresentations.bind(jsonDocumentSymbols),
            doHover: jsonHover.doHover.bind(jsonHover),
            getFoldingRanges: json5Folding_1.getFoldingRanges,
            getSelectionRanges: json5SelectionRanges_1.getSelectionRanges,
            findDefinition: json5Definition_1.findDefinition,
            format: function (d, r, o) {
                var range = undefined;
                if (r) {
                    var offset = d.offsetAt(r.start);
                    var length = d.offsetAt(r.end) - offset;
                    range = { offset: offset, length: length };
                }
                var options = { tabSize: o ? o.tabSize : 4, insertSpaces: o ? o.insertSpaces : true, eol: '\n' };
                return json5_parser_1.format(d.getText(), range, options).map(function (e) {
                    return json5LanguageTypes_1.TextEdit.replace(json5LanguageTypes_1.Range.create(d.positionAt(e.offset), d.positionAt(e.offset + e.length)), e.content);
                });
            }
        };
    }
    exports.getLanguageService = getLanguageService;
});
