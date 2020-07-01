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
        define(["require", "exports", "assert", "../parser/json5Parser", "../services/json5SchemaService", "../services/json5Hover", "../json5LanguageService"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var assert = require("assert");
    var Parser = require("../parser/json5Parser");
    var SchemaService = require("../services/json5SchemaService");
    var json5Hover_1 = require("../services/json5Hover");
    var json5LanguageService_1 = require("../json5LanguageService");
    suite('JSON5 Hover', function () {
        function testComputeInfo(value, schema, position) {
            var uri = 'test://test.json';
            var schemaService = new SchemaService.JSON55SchemaService(requestService);
            var hoverProvider = new json5Hover_1.JSON5Hover(schemaService, [], Promise);
            var id = "http://myschemastore/test1";
            schemaService.registerExternalSchema(id, ["*.json"], schema);
            var document = json5LanguageService_1.TextDocument.create(uri, 'json', 0, value);
            var jsonDoc = Parser.parse(document);
            return hoverProvider.doHover(document, position, jsonDoc);
        }
        var requestService = function (uri) {
            return Promise.reject('Resource not found');
        };
        test('Simple schema', function () {
            return __awaiter(this, void 0, void 0, function () {
                var content, schema;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            content = '{"a": 42, "b": "hello", "c": false}';
                            schema = {
                                type: 'object',
                                description: 'a very special object',
                                properties: {
                                    'a': {
                                        type: 'number',
                                        description: 'A'
                                    },
                                    'b': {
                                        type: 'string',
                                        description: 'B'
                                    },
                                    'c': {
                                        type: 'boolean',
                                        description: 'C'
                                    }
                                }
                            };
                            return [4 /*yield*/, testComputeInfo(content, schema, { line: 0, character: 0 }).then(function (result) {
                                    assert.deepEqual(result.contents, [json5LanguageService_1.MarkedString.fromPlainText('a very special object')]);
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testComputeInfo(content, schema, { line: 0, character: 1 }).then(function (result) {
                                    assert.deepEqual(result.contents, [json5LanguageService_1.MarkedString.fromPlainText('A')]);
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, testComputeInfo(content, schema, { line: 0, character: 32 }).then(function (result) {
                                    assert.deepEqual(result.contents, [json5LanguageService_1.MarkedString.fromPlainText('C')]);
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, testComputeInfo(content, schema, { line: 0, character: 7 }).then(function (result) {
                                    assert.deepEqual(result.contents, [json5LanguageService_1.MarkedString.fromPlainText('A')]);
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        test('Nested schema', function () {
            return __awaiter(this, void 0, void 0, function () {
                var content, schema;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            content = '{"a": 42, "b": "hello"}';
                            schema = {
                                oneOf: [{
                                        type: 'object',
                                        description: 'a very special object',
                                        properties: {
                                            'a': {
                                                type: 'number',
                                                description: 'A'
                                            },
                                            'b': {
                                                type: 'string',
                                                title: 'B',
                                                description: 'It\'s B'
                                            },
                                        }
                                    }, {
                                        type: 'array'
                                    }]
                            };
                            return [4 /*yield*/, testComputeInfo(content, schema, { line: 0, character: 0 }).then(function (result) {
                                    assert.deepEqual(result.contents, [json5LanguageService_1.MarkedString.fromPlainText('a very special object')]);
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testComputeInfo(content, schema, { line: 0, character: 1 }).then(function (result) {
                                    assert.deepEqual(result.contents, [json5LanguageService_1.MarkedString.fromPlainText('A')]);
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, testComputeInfo(content, schema, { line: 0, character: 10 }).then(function (result) {
                                    assert.deepEqual(result.contents, [json5LanguageService_1.MarkedString.fromPlainText('B\n\nIt\'s B')]);
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        test('Enum description', function () {
            return __awaiter(this, void 0, void 0, function () {
                var schema;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            schema = {
                                type: 'object',
                                properties: {
                                    'prop1': {
                                        description: "prop1",
                                        enum: ['e1', 'e2', 'e3'],
                                        enumDescriptions: ['E1', 'E2', 'E3'],
                                    },
                                    'prop2': {
                                        description: "prop2",
                                        enum: [null, 1, false],
                                        enumDescriptions: ['null', 'one', 'wrong'],
                                    },
                                    'prop3': {
                                        title: "title",
                                        markdownDescription: "*prop3*",
                                        description: "prop3",
                                        enum: [null, 1],
                                        markdownEnumDescriptions: ['Set to `null`', 'Set to `1`'],
                                    }
                                }
                            };
                            return [4 /*yield*/, testComputeInfo('{ "prop1": "e1', schema, { line: 0, character: 12 }).then(function (result) {
                                    assert.deepEqual(result.contents, ['prop1\n\n`e1`: E1']);
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testComputeInfo('{ "prop2": null', schema, { line: 0, character: 12 }).then(function (result) {
                                    assert.deepEqual(result.contents, ['prop2\n\n`null`: null']);
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, testComputeInfo('{ "prop2": 1', schema, { line: 0, character: 11 }).then(function (result) {
                                    assert.deepEqual(result.contents, ['prop2\n\n`1`: one']);
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, testComputeInfo('{ "prop2": false', schema, { line: 0, character: 12 }).then(function (result) {
                                    assert.deepEqual(result.contents, ['prop2\n\n`false`: wrong']);
                                })];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, testComputeInfo('{ "prop3": null', schema, { line: 0, character: 12 }).then(function (result) {
                                    assert.deepEqual(result.contents, ['title\n\n*prop3*\n\n`null`: Set to `null`']);
                                })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        test('Multiline descriptions', function () {
            return __awaiter(this, void 0, void 0, function () {
                var schema;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            schema = {
                                type: 'object',
                                properties: {
                                    'prop1': {
                                        description: "line1\nline2\n\nline3\n\n\nline4\n",
                                    },
                                    'prop2': {
                                        description: "line1\r\nline2\r\n\r\nline3",
                                    }
                                }
                            };
                            return [4 /*yield*/, testComputeInfo('{ "prop1": "e1', schema, { line: 0, character: 12 }).then(function (result) {
                                    assert.deepEqual(result.contents, ['line1\n\nline2\n\nline3\n\n\nline4\n']);
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testComputeInfo('{ "prop2": "e1', schema, { line: 0, character: 12 }).then(function (result) {
                                    assert.deepEqual(result.contents, ['line1\n\nline2\r\n\r\nline3']);
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
