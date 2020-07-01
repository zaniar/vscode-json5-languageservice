/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "assert", "../json5LanguageService", "../utils/colors"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var assert = require("assert");
    var json5LanguageService_1 = require("../json5LanguageService");
    var colors_1 = require("../utils/colors");
    suite('JSON5 Document Symbols', function () {
        var schemaRequestService = function (uri) {
            return Promise.reject('Resource not found');
        };
        function getFlatOutline(value, context) {
            var uri = 'test://test.json';
            var ls = json5LanguageService_1.getLanguageService({ schemaRequestService: schemaRequestService, clientCapabilities: json5LanguageService_1.ClientCapabilities.LATEST });
            var document = json5LanguageService_1.TextDocument.create(uri, 'json', 0, value);
            var jsonDoc = ls.parseJSON55Document(document);
            return ls.findDocumentSymbols(document, jsonDoc, context);
        }
        function getHierarchicalOutline(value, context) {
            var uri = 'test://test.json';
            var ls = json5LanguageService_1.getLanguageService({ schemaRequestService: schemaRequestService, clientCapabilities: json5LanguageService_1.ClientCapabilities.LATEST });
            var document = json5LanguageService_1.TextDocument.create(uri, 'json', 0, value);
            var jsonDoc = ls.parseJSON55Document(document);
            return ls.findDocumentSymbols2(document, jsonDoc, context);
        }
        function assertColors(value, schema, expectedOffsets, expectedColors) {
            var uri = 'test://test.json';
            var schemaUri = "http://myschemastore/test1";
            var ls = json5LanguageService_1.getLanguageService({ schemaRequestService: schemaRequestService, clientCapabilities: json5LanguageService_1.ClientCapabilities.LATEST });
            ls.configure({ schemas: [{ fileMatch: ["*.json"], uri: schemaUri, schema: schema }] });
            var document = json5LanguageService_1.TextDocument.create(uri, 'json', 0, value);
            var jsonDoc = ls.parseJSON55Document(document);
            return ls.findDocumentColors(document, jsonDoc).then(function (colorInfos) {
                var actualOffsets = colorInfos.map(function (r) { return document.offsetAt(r.range.start); });
                assert.deepEqual(actualOffsets, expectedOffsets);
                var actualColors = colorInfos.map(function (r) { return r.color; });
                assert.deepEqual(actualColors, expectedColors);
            });
        }
        function assertColorPresentations(color) {
            var expected = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                expected[_i - 1] = arguments[_i];
            }
            var ls = json5LanguageService_1.getLanguageService({ schemaRequestService: schemaRequestService, clientCapabilities: json5LanguageService_1.ClientCapabilities.LATEST });
            var document = json5LanguageService_1.TextDocument.create('test://test/test.css', 'css', 0, '');
            var doc = ls.parseJSON55Document(document);
            var range = json5LanguageService_1.Range.create(json5LanguageService_1.Position.create(0, 0), json5LanguageService_1.Position.create(0, 1));
            var result = ls.getColorPresentations(document, doc, color, range);
            assert.deepEqual(result.map(function (r) { return r.label; }), expected);
            assert.deepEqual(result.map(function (r) { return r.textEdit; }), expected.map(function (l) { return json5LanguageService_1.TextEdit.replace(range, JSON.stringify(l)); }));
        }
        function assertOutline(value, expected, message) {
            var actual = getFlatOutline(value);
            assert.equal(actual.length, expected.length, message);
            for (var i = 0; i < expected.length; i++) {
                assert.equal(actual[i].name, expected[i].label, message);
                assert.equal(actual[i].kind, expected[i].kind, message);
            }
        }
        function assertHierarchicalOutline(value, expected, message) {
            function assertDocumentSymbols(actuals, expected) {
                assert.equal(actuals.length, expected.length, message);
                for (var i = 0; i < expected.length; i++) {
                    assert.equal(actuals[i].name, expected[i].label, message);
                    assert.equal(actuals[i].kind, expected[i].kind, message);
                    assertDocumentSymbols(actuals[i].children, expected[i].children);
                }
            }
            var actual = getHierarchicalOutline(value);
            assertDocumentSymbols(actual, expected);
            assert.equal(actual.length, expected.length, message);
            for (var i = 0; i < expected.length; i++) {
                assert.equal(actual[i].name, expected[i].label, message);
                assert.equal(actual[i].kind, expected[i].kind, message);
                assert.equal(actual[i].kind, expected[i].kind, message);
            }
        }
        test('Outline - Base types', function () {
            var content = '{ "key1": 1, "key2": "foo", "key3" : true }';
            var expected = [
                { label: 'key1', kind: json5LanguageService_1.SymbolKind.Number },
                { label: 'key2', kind: json5LanguageService_1.SymbolKind.String },
                { label: 'key3', kind: json5LanguageService_1.SymbolKind.Boolean },
            ];
            assertOutline(content, expected);
        });
        test('Outline - Arrays', function () {
            var content = '{ "key1": 1, "key2": [ 1, 2, 3 ], "key3" : [ { "k1": 1 }, {"k2": 2 } ] }';
            var expected = [
                { label: 'key1', kind: json5LanguageService_1.SymbolKind.Number },
                { label: 'key2', kind: json5LanguageService_1.SymbolKind.Array },
                { label: 'key3', kind: json5LanguageService_1.SymbolKind.Array },
                { label: 'k1', kind: json5LanguageService_1.SymbolKind.Number },
                { label: 'k2', kind: json5LanguageService_1.SymbolKind.Number }
            ];
            assertOutline(content, expected);
        });
        test('Outline - Objects', function () {
            var content = '{ "key1": { "key2": true }, "key3" : { "k1":  { } }';
            var expected = [
                { label: 'key1', kind: json5LanguageService_1.SymbolKind.Module },
                { label: 'key3', kind: json5LanguageService_1.SymbolKind.Module },
                { label: 'key2', kind: json5LanguageService_1.SymbolKind.Boolean },
                { label: 'k1', kind: json5LanguageService_1.SymbolKind.Module }
            ];
            assertOutline(content, expected);
        });
        test('Outline - object with syntax error', function () {
            var content = '{ "key1": { "key2": true, "key3":, "key4": false } }';
            var expected = [
                { label: 'key1', kind: json5LanguageService_1.SymbolKind.Module },
                { label: 'key2', kind: json5LanguageService_1.SymbolKind.Boolean },
                { label: 'key4', kind: json5LanguageService_1.SymbolKind.Boolean },
            ];
            assertOutline(content, expected);
        });
        test('Outline - empty name', function () {
            var content = '{ "": 1, " ": 2 }';
            var expected = [
                { label: '""', kind: json5LanguageService_1.SymbolKind.Number },
                { label: '" "', kind: json5LanguageService_1.SymbolKind.Number }
            ];
            assertOutline(content, expected);
            var expected2 = [
                { label: '""', kind: json5LanguageService_1.SymbolKind.Number, children: [] },
                { label: '" "', kind: json5LanguageService_1.SymbolKind.Number, children: [] }
            ];
            assertHierarchicalOutline(content, expected2);
        });
        test('Outline - new line in name', function () {
            var content = '{ "1\\n2": 1 }';
            var expected = [
                { label: '1↵2', kind: json5LanguageService_1.SymbolKind.Number }
            ];
            assertOutline(content, expected);
            var expected2 = [
                { label: '1↵2', kind: json5LanguageService_1.SymbolKind.Number, children: [] }
            ];
            assertHierarchicalOutline(content, expected2);
        });
        test('Hierarchical Outline - Object', function () {
            var content = '{ "key1": { "key2": true }, "key3" : { "k1":  { } }';
            var expected = [
                { label: 'key1', kind: json5LanguageService_1.SymbolKind.Module, children: [{ label: 'key2', kind: json5LanguageService_1.SymbolKind.Boolean, children: [] }] },
                { label: 'key3', kind: json5LanguageService_1.SymbolKind.Module, children: [{ label: 'k1', kind: json5LanguageService_1.SymbolKind.Module, children: [] }] }
            ];
            assertHierarchicalOutline(content, expected);
        });
        test('Hierarchical Outline - Array', function () {
            var content = '{ "key1": [ { "key2": true }, { "k1": [] } ]';
            var expected = [
                {
                    label: 'key1', kind: json5LanguageService_1.SymbolKind.Array, children: [
                        { label: '0', kind: json5LanguageService_1.SymbolKind.Module, children: [{ label: 'key2', kind: json5LanguageService_1.SymbolKind.Boolean, children: [] }] },
                        { label: '1', kind: json5LanguageService_1.SymbolKind.Module, children: [{ label: 'k1', kind: json5LanguageService_1.SymbolKind.Array, children: [] }] }
                    ]
                }
            ];
            assertHierarchicalOutline(content, expected);
        });
        test('Outline - limit 1', function () {
            var content = '{';
            for (var i = 0; i < 100; i++) {
                content += "\"prop" + i + "\": " + i + ",";
            }
            content += '}';
            var exceededUris = [];
            var context = { resultLimit: 10, onResultLimitExceeded: function (uri) { return exceededUris.push(uri); } };
            var flatOutline = getFlatOutline(content, context);
            assert.equal(flatOutline.length, 10, 'flat');
            assert.equal(exceededUris.length, 1);
            exceededUris = [];
            var hierarchicalOutline = getHierarchicalOutline(content, context);
            assert.equal(hierarchicalOutline.length, 10, 'hierarchical');
            assert.equal(exceededUris.length, 1);
        });
        test('Outline - limit 2', function () {
            var content = '[';
            for (var i = 0; i < 10; i++) {
                content += '{';
                for (var k = 0; k < 10; k++) {
                    content += "\"" + i + "-" + k + "\": " + k + ",";
                }
                content += '},';
            }
            content += ']';
            var exceededUris = [];
            var context = { resultLimit: 25, onResultLimitExceeded: function (uri) { return exceededUris.push(uri); } };
            var flatOutline = getFlatOutline(content, context);
            assert.equal(flatOutline.length, 25, 'flat');
            assert.equal(flatOutline.map(function (s) { return s.name; }).join(','), '0-0,0-1,0-2,0-3,0-4,0-5,0-6,0-7,0-8,0-9,1-0,1-1,1-2,1-3,1-4,1-5,1-6,1-7,1-8,1-9,2-0,2-1,2-2,2-3,2-4');
            assert.equal(exceededUris.length, 1);
            exceededUris = [];
            var hierarchicalOutline = getHierarchicalOutline(content, context);
            assert.equal(hierarchicalOutline.length, 10, 'hierarchical');
            assert.equal(hierarchicalOutline[0].children.length, 10, 'hierarchical children of first');
            assert.equal(hierarchicalOutline[1].children.length, 5, 'hierarchical children of second');
            assert.equal(hierarchicalOutline[2].children.length, 0, 'hierarchical children of third');
            assert.equal(exceededUris.length, 1);
        });
        test('Colors', function () {
            return __awaiter(this, void 0, void 0, function () {
                var content, schema, expectedOffsets, expectedColors;
                return __generator(this, function (_a) {
                    content = '{ "a": "#FF00FF", "b": "#FF0000" }';
                    schema = {
                        type: 'object',
                        description: 'a very special object',
                        properties: {
                            'a': {
                                type: 'number',
                                description: 'A',
                                format: 'color'
                            },
                            'b': {
                                type: 'string',
                                description: 'B',
                                format: 'color'
                            }
                        }
                    };
                    expectedOffsets = [7, 23];
                    expectedColors = [colors_1.colorFrom256RGB(255, 0, 255), colors_1.colorFrom256RGB(255, 0, 0)];
                    return [2 /*return*/, assertColors(content, schema, expectedOffsets, expectedColors)];
                });
            });
        });
        test('color presentations', function () {
            assertColorPresentations(colors_1.colorFrom256RGB(255, 0, 0), '#ff0000');
            assertColorPresentations(colors_1.colorFrom256RGB(77, 33, 111, 0.5), '#4d216f80');
        });
    });
});
