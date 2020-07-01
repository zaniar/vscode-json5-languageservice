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
import * as assert from 'assert';
import { getLanguageService, TextDocument, ClientCapabilities, Position } from '../json5LanguageService';
import { repeat } from '../utils/strings';
var applyEdits = TextDocument.applyEdits;
var assertCompletion = function (completions, expected, document, offset) {
    var matches = completions.items.filter(function (completion) {
        return completion.label === expected.label;
    });
    if (expected.notAvailable) {
        assert.equal(matches.length, 0, expected.label + " should not existing is results");
        return;
    }
    assert.equal(matches.length, 1, expected.label + " should only existing once: Actual: " + completions.items.map(function (c) { return c.label; }).join(', '));
    var match = matches[0];
    if (expected.detail !== undefined) {
        assert.equal(match.detail, expected.detail);
    }
    if (expected.documentation !== undefined) {
        assert.deepEqual(match.documentation, expected.documentation);
    }
    if (expected.kind !== undefined) {
        assert.equal(match.kind, expected.kind);
    }
    if (expected.resultText !== undefined) {
        assert.equal(applyEdits(document, [match.textEdit]), expected.resultText);
    }
    if (expected.sortText !== undefined) {
        assert.equal(match.sortText, expected.sortText);
    }
};
suite('JSON5 Completion', function () {
    var testCompletionsFor = function (value, schema, expected, clientCapabilities) {
        if (clientCapabilities === void 0) { clientCapabilities = ClientCapabilities.LATEST; }
        var offset = value.indexOf('|');
        value = value.substr(0, offset) + value.substr(offset + 1);
        var ls = getLanguageService({ clientCapabilities: clientCapabilities });
        if (schema) {
            ls.configure({
                schemas: [{
                        uri: 'http://myschemastore/test1',
                        schema: schema,
                        fileMatch: ["*.json"]
                    }]
            });
        }
        var document = TextDocument.create('test://test/test.json', 'json', 0, value);
        var position = Position.create(0, offset);
        var jsonDoc = ls.parseJSON5Document(document);
        return ls.doComplete(document, position, jsonDoc).then(function (list) {
            if (expected.count) {
                assert.equal(list.items.length, expected.count, value + ' ' + list.items.map(function (i) { return i.label; }).join(', '));
            }
            if (expected.items) {
                for (var _i = 0, _a = expected.items; _i < _a.length; _i++) {
                    var item = _a[_i];
                    assertCompletion(list, item, document, offset);
                }
            }
        });
    };
    test('Complete property no schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testCompletionsFor('[ { "name": "John", "age": 44 }, { | }', null, {
                            count: 2,
                            items: [
                                { label: 'name', resultText: '[ { "name": "John", "age": 44 }, { "name" }' },
                                { label: 'age', resultText: '[ { "name": "John", "age": 44 }, { "age" }' }
                            ]
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('[ { "name": "John", "age": 44 }, { "| }', null, {
                                count: 2,
                                items: [
                                    { label: 'name', resultText: '[ { "name": "John", "age": 44 }, { "name"' },
                                    { label: 'age', resultText: '[ { "name": "John", "age": 44 }, { "age"' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('[ { "name": "John", "age": 44 }, { "n| }', null, {
                                count: 2,
                                items: [
                                    { label: 'name', resultText: '[ { "name": "John", "age": 44 }, { "name"' },
                                    { label: 'age', resultText: '[ { "name": "John", "age": 44 }, { "age"' }
                                ]
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('[ { "name": "John", "age": 44 }, { "name|" }', null, {
                                count: 2,
                                items: [
                                    { label: 'name', resultText: '[ { "name": "John", "age": 44 }, { "name" }' },
                                    { label: 'age', resultText: '[ { "name": "John", "age": 44 }, { "age" }' }
                                ]
                            })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('[ { "name": "John", "age": 44, "city": "DC" }, { "name|": "Paul", "age": 23 }', null, {
                                items: [
                                    { label: 'city', resultText: '[ { "name": "John", "age": 44, "city": "DC" }, { "city": "Paul", "age": 23 }' },
                                ]
                            })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('[ { "name": "John", "address": { "street" : "MH Road", "number" : 5 } }, { "name": "Jack", "address": { "street" : "100 Feet Road", | }', null, {
                                count: 1,
                                items: [
                                    { label: 'number', resultText: '[ { "name": "John", "address": { "street" : "MH Road", "number" : 5 } }, { "name": "Jack", "address": { "street" : "100 Feet Road", "number" }' }
                                ]
                            })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Complete values no schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testCompletionsFor('[ { "name": "John", "age": 44 }, { "name": |', null, {
                            count: 1,
                            items: [
                                { label: '"John"', resultText: '[ { "name": "John", "age": 44 }, { "name": "John"' }
                            ]
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('[ { "data": { "key": 1, "data": true } }, { "data": |', null, {
                                count: 3,
                                items: [
                                    { label: '{}', resultText: '[ { "data": { "key": 1, "data": true } }, { "data": {$1}' },
                                    { label: 'true', resultText: '[ { "data": { "key": 1, "data": true } }, { "data": true' },
                                    { label: 'false', resultText: '[ { "data": { "key": 1, "data": true } }, { "data": false' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('[ { "data": "foo" }, { "data": "bar" }, { "data": "|" } ]', null, {
                                count: 2,
                                items: [
                                    { label: '"foo"', resultText: '[ { "data": "foo" }, { "data": "bar" }, { "data": "foo" } ]' },
                                    { label: '"bar"', resultText: '[ { "data": "foo" }, { "data": "bar" }, { "data": "bar" } ]' }
                                ]
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('[ { "data": "foo" }, { "data": "bar" }, { "data": "f|" } ]', null, {
                                count: 2,
                                items: [
                                    { label: '"foo"', resultText: '[ { "data": "foo" }, { "data": "bar" }, { "data": "foo" } ]' },
                                    { label: '"bar"', resultText: '[ { "data": "foo" }, { "data": "bar" }, { "data": "bar" } ]' }
                                ]
                            })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('[ { "data": "foo" }, { "data": "bar" }, { "data": "xoo"|, "o": 1 } ]', null, {
                                count: 2,
                                items: [
                                    { label: '"foo"', resultText: '[ { "data": "foo" }, { "data": "bar" }, { "data": "foo", "o": 1 } ]' },
                                    { label: '"bar"', resultText: '[ { "data": "foo" }, { "data": "bar" }, { "data": "bar", "o": 1 } ]' }
                                ]
                            })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('[ { "data": "foo" }, { "data": "bar" }, { "data": "xoo"  | } ]', null, {
                                count: 0
                            })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Complete property with schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                'a': {
                                    type: 'number',
                                    description: 'A'
                                },
                                'b': {
                                    type: 'string',
                                    description: 'B'
                                },
                                'cool': {
                                    type: 'boolean',
                                    description: 'C'
                                }
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{|}', schema, {
                                count: 3,
                                items: [
                                    { label: 'a', documentation: 'A', resultText: '{"a": ${1:0}}' },
                                    { label: 'b', documentation: 'B', resultText: '{"b": "$1"}' },
                                    { label: 'cool', documentation: 'C', resultText: '{"cool": $1}' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "a|}', schema, {
                                count: 3,
                                items: [
                                    { label: 'a', documentation: 'A', resultText: '{ "a": ${1:0}' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "b": 1 "a|}', schema, {
                                count: 2,
                                items: [
                                    { label: 'a', documentation: 'A', resultText: '{ "b": 1 "a": ${1:0}' }
                                ]
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "|}', schema, {
                                count: 3,
                                items: [
                                    { label: 'a', documentation: 'A', resultText: '{ "a": ${1:0}' }
                                ]
                            })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ a|}', schema, {
                                count: 3,
                                items: [
                                    { label: 'a', documentation: 'A', resultText: '{ "a": ${1:0}}' }
                                ]
                            })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "a": 1,|}', schema, {
                                count: 2,
                                items: [
                                    { label: 'b', documentation: 'B', resultText: '{ "a": 1,"b": "$1"}' },
                                    { label: 'cool', documentation: 'C', resultText: '{ "a": 1,"cool": $1}' }
                                ]
                            })];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ |, "a": 1}', schema, {
                                count: 2,
                                items: [
                                    { label: 'b', documentation: 'B', resultText: '{ "b": "$1", "a": 1}' },
                                    { label: 'cool', documentation: 'C', resultText: '{ "cool": $1, "a": 1}' }
                                ]
                            })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "a": 1 "b|"}', schema, {
                                items: [
                                    { label: 'b', documentation: 'B', resultText: '{ "a": 1 "b": "$1"}' },
                                ]
                            })];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "c|"\n"b": "v"}', schema, {
                                items: [
                                    { label: 'a', resultText: '{ "a": ${1:0},\n"b": "v"}' },
                                    { label: 'cool', resultText: '{ "cool": $1,\n"b": "v"}' },
                                    { label: 'b', notAvailable: true }
                                ]
                            })];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ c|\n"b": "v"}', schema, {
                                items: [
                                    { label: 'a', resultText: '{ "a": ${1:0},\n"b": "v"}' },
                                    { label: 'cool', resultText: '{ "cool": $1,\n"b": "v"}' },
                                    { label: 'b', notAvailable: true }
                                ]
                            })];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Complete value with schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                'a': {
                                    enum: ['John', 'Jeff', 'George']
                                },
                                'c': {
                                    type: 'array',
                                    items: {
                                        type: 'string'
                                    }
                                }
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ "a": | }', schema, {
                                count: 3,
                                items: [
                                    { label: '"John"', resultText: '{ "a": "John" }' },
                                    { label: '"Jeff"', resultText: '{ "a": "Jeff" }' },
                                    { label: '"George"', resultText: '{ "a": "George" }' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "a": "J| }', schema, {
                                count: 3,
                                items: [
                                    { label: '"John"', resultText: '{ "a": "John"' },
                                    { label: '"Jeff"', resultText: '{ "a": "Jeff"' },
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "a": "John"|, "b": 1 }', schema, {
                                count: 3,
                                items: [
                                    { label: '"John"', resultText: '{ "a": "John", "b": 1 }' }
                                ]
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Complete array value with schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                'c': {
                                    type: 'array',
                                    items: {
                                        type: 'number',
                                        enum: [1, 2]
                                    }
                                }
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ "c": [ | ] }', schema, {
                                items: [
                                    { label: '1', resultText: '{ "c": [ 1 ] }' },
                                    { label: '2', resultText: '{ "c": [ 2 ] }' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "c": [ 1, | ] }', schema, {
                                items: [
                                    { label: '1', resultText: '{ "c": [ 1, 1 ] }' },
                                    { label: '2', resultText: '{ "c": [ 1, 2 ] }' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "c": [ | 1] }', schema, {
                                items: [
                                    { label: '1', resultText: '{ "c": [ 1, 1] }' },
                                    { label: '2', resultText: '{ "c": [ 2, 1] }' }
                                ]
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Complete array value with schema 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                'c': {
                                    type: 'array',
                                    items: [
                                        { enum: [1, 2] }, { enum: [3, 4] }, { enum: [5, 6] }
                                    ]
                                }
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ "c": [ | ] }', schema, {
                                items: [
                                    { label: '1', resultText: '{ "c": [ 1 ] }' },
                                    { label: '2', resultText: '{ "c": [ 2 ] }' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "c": [ 1, | ] }', schema, {
                                items: [
                                    { label: '3', resultText: '{ "c": [ 1, 3 ] }' },
                                    { label: '4', resultText: '{ "c": [ 1, 4 ] }' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "c": [ 1, 3, 6| ] }', schema, {
                                items: [
                                    { label: '5', resultText: '{ "c": [ 1, 3, 5 ] }' },
                                    { label: '6', resultText: '{ "c": [ 1, 3, 6 ] }' }
                                ]
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "c": [ | 1] }', schema, {
                                items: [
                                    { label: '1', resultText: '{ "c": [ 1, 1] }' },
                                    { label: '2', resultText: '{ "c": [ 2, 1] }' }
                                ]
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Complete array value with schema 3 (issue #81459)', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: "object",
                            properties: {
                                "a": {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            foo: {
                                                type: 'string'
                                            },
                                            bar: {
                                                type: 'string'
                                            }
                                        }
                                    }
                                }
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ "a" : [ { "foo": "a", | } ] }', schema, {
                                items: [
                                    { label: 'bar', resultText: '{ "a" : [ { "foo": "a", "bar": "$1" } ] }' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "a" : [ { "bar": "a" }|, { } ] }', schema, {
                                items: [
                                    { label: 'foo', notAvailable: true }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Complete value with schema: booleans, null', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                'a': {
                                    type: 'boolean'
                                },
                                'b': {
                                    type: ['boolean', 'null']
                                },
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ "a": | }', schema, {
                                count: 2,
                                items: [
                                    { label: 'true', resultText: '{ "a": true }' },
                                    { label: 'false', resultText: '{ "a": false }' },
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "b": "| }', schema, {
                                count: 3,
                                items: [
                                    { label: 'true', resultText: '{ "b": true' },
                                    { label: 'false', resultText: '{ "b": false' },
                                    { label: 'null', resultText: '{ "b": null' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Complete with nested schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var content, schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        content = '{|}';
                        schema = {
                            oneOf: [{
                                    type: 'object',
                                    properties: {
                                        'a': {
                                            type: 'number',
                                            description: 'A'
                                        },
                                        'b': {
                                            type: 'string',
                                            description: 'B'
                                        },
                                    }
                                }, {
                                    type: 'array'
                                }]
                        };
                        return [4 /*yield*/, testCompletionsFor(content, schema, {
                                count: 2,
                                items: [
                                    { label: 'a', documentation: 'A' },
                                    { label: 'b', documentation: 'B' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Complete with required anyOf', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            anyOf: [{
                                    type: 'object',
                                    required: ['a', 'b'],
                                    properties: {
                                        'a': {
                                            type: 'string',
                                            description: 'A'
                                        },
                                        'b': {
                                            type: 'string',
                                            description: 'B'
                                        },
                                    }
                                }, {
                                    type: 'object',
                                    required: ['c', 'd'],
                                    properties: {
                                        'c': {
                                            type: 'string',
                                            description: 'C'
                                        },
                                        'd': {
                                            type: 'string',
                                            description: 'D'
                                        },
                                    }
                                }]
                        };
                        return [4 /*yield*/, testCompletionsFor('{|}', schema, {
                                count: 4,
                                items: [
                                    { label: 'a', documentation: 'A' },
                                    { label: 'b', documentation: 'B' },
                                    { label: 'c', documentation: 'C' },
                                    { label: 'd', documentation: 'D' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "a": "", |}', schema, {
                                count: 1,
                                items: [
                                    { label: 'b', documentation: 'B' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Complete with anyOf', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            anyOf: [{
                                    type: 'object',
                                    properties: {
                                        'type': {
                                            enum: ['house']
                                        },
                                        'b': {
                                            type: 'string'
                                        },
                                    }
                                }, {
                                    type: 'object',
                                    properties: {
                                        'type': {
                                            enum: ['appartment']
                                        },
                                        'c': {
                                            type: 'string'
                                        },
                                    }
                                }]
                        };
                        return [4 /*yield*/, testCompletionsFor('{|}', schema, {
                                count: 3,
                                items: [
                                    { label: 'type' },
                                    { label: 'b' },
                                    { label: 'c' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "type": "appartment", |}', schema, {
                                count: 1,
                                items: [
                                    { label: 'c' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Complete with oneOf', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            oneOf: [{
                                    type: 'object',
                                    allOf: [{
                                            properties: {
                                                'a': {
                                                    type: 'string',
                                                    description: 'A'
                                                }
                                            }
                                        },
                                        {
                                            anyOf: [{
                                                    properties: {
                                                        'b1': {
                                                            type: 'string',
                                                            description: 'B1'
                                                        }
                                                    },
                                                }, {
                                                    properties: {
                                                        'b2': {
                                                            type: 'string',
                                                            description: 'B2'
                                                        }
                                                    },
                                                }]
                                        }]
                                }, {
                                    type: 'object',
                                    properties: {
                                        'c': {
                                            type: 'string',
                                            description: 'C'
                                        },
                                        'd': {
                                            type: 'string',
                                            description: 'D'
                                        },
                                    }
                                }]
                        };
                        return [4 /*yield*/, testCompletionsFor('{|}', schema, {
                                count: 5,
                                items: [
                                    { label: 'a', documentation: 'A' },
                                    { label: 'b1', documentation: 'B1' },
                                    { label: 'b2', documentation: 'B2' },
                                    { label: 'c', documentation: 'C' },
                                    { label: 'd', documentation: 'D' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "b1": "", |}', schema, {
                                count: 2,
                                items: [
                                    { label: 'a', documentation: 'A' },
                                    { label: 'b2', documentation: 'B2' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Complete with oneOf and enums', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            oneOf: [{
                                    type: 'object',
                                    properties: {
                                        'type': {
                                            type: 'string',
                                            enum: ['1', '2']
                                        },
                                        'a': {
                                            type: 'object',
                                            properties: {
                                                'x': {
                                                    type: 'string'
                                                },
                                                'y': {
                                                    type: 'string'
                                                }
                                            },
                                            "required": ['x', 'y']
                                        },
                                        'b': {}
                                    },
                                }, {
                                    type: 'object',
                                    properties: {
                                        'type': {
                                            type: 'string',
                                            enum: ['3']
                                        },
                                        'a': {
                                            type: 'object',
                                            properties: {
                                                'x': {
                                                    type: 'string'
                                                },
                                                'z': {
                                                    type: 'string'
                                                }
                                            },
                                            "required": ['x', 'z']
                                        },
                                        'c': {}
                                    },
                                }]
                        };
                        return [4 /*yield*/, testCompletionsFor('{|}', schema, {
                                count: 4,
                                items: [
                                    { label: 'type' },
                                    { label: 'a' },
                                    { label: 'b' },
                                    { label: 'c' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "type": |}', schema, {
                                count: 3,
                                items: [
                                    { label: '"1"' },
                                    { label: '"2"' },
                                    { label: '"3"' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "a": { "x": "", "y": "" }, "type": |}', schema, {
                                count: 2,
                                items: [
                                    { label: '"1"' },
                                    { label: '"2"' }
                                ]
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "type": "1", "a" : { | }', schema, {
                                count: 2,
                                items: [
                                    { label: 'x' },
                                    { label: 'y' }
                                ]
                            })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "type": "1", "a" : { "x": "", "z":"" }, |', schema, {
                                // both alternatives have errors: intellisense proposes all options
                                count: 2,
                                items: [
                                    { label: 'b' },
                                    { label: 'c' }
                                ]
                            })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "a" : { "x": "", "z":"" }, |', schema, {
                                count: 2,
                                items: [
                                    { label: 'type' },
                                    { label: 'c' }
                                ]
                            })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Escaping no schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testCompletionsFor('[ { "\\\\${1:b}": "John" }, { "|" }', null, {
                            items: [
                                { label: '\\${1:b}' }
                            ]
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('[ { "\\\\${1:b}": "John" }, { | }', null, {
                                items: [
                                    { label: '\\${1:b}', resultText: '[ { "\\\\${1:b}": "John" }, { "\\\\\\\\\\${1:b\\}" }' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('[ { "name": "\\{" }, { "name": | }', null, {
                                items: [
                                    { label: '"\\{"' }
                                ]
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Escaping with schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                '{\\}': {
                                    default: "{\\}",
                                    defaultSnippets: [{ body: "${1:const}" }],
                                    enum: ['John{\\}']
                                }
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ | }', schema, {
                                items: [
                                    { label: '{\\}', resultText: '{ "{\\\\\\\\\\}": $1 }' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "{\\\\}": | }', schema, {
                                items: [
                                    { label: '"{\\\\}"', resultText: '{ "{\\\\}": "{\\\\\\\\\\}" }' },
                                    { label: '"John{\\\\}"', resultText: '{ "{\\\\}": "John{\\\\\\\\\\}" }' },
                                    { label: '"const"', resultText: '{ "{\\\\}": "${1:const}" }' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Escaping with schema - #13716', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                'url': {
                                    default: "http://foo/bar"
                                }
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ | }', schema, {
                                items: [
                                    { label: 'url', resultText: '{ "url": "${1:http://foo/bar}" }' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Sanititize', function () {
        return __awaiter(this, void 0, void 0, function () {
            var longLabel, schema;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        longLabel = repeat('abcd', 20);
                        schema = {
                            type: 'object',
                            properties: (_a = {
                                    'a\nb': {
                                        default: 1
                                    }
                                },
                                _a[longLabel] = {
                                    default: 2
                                },
                                _a)
                        };
                        return [4 /*yield*/, testCompletionsFor('{ | }', schema, {
                                items: [
                                    { label: 'a↵b', resultText: '{ "a\\\\nb": ${1:1} }' },
                                    { label: 'abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcda...', resultText: "{ \"" + longLabel + "\": ${1:2} }" }
                                ]
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Enum and defaults', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                prop: {
                                    type: ['boolean', 'string'],
                                    enum: [false, 'rcodetools'],
                                    default: ''
                                }
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ "prop": | }', schema, {
                                items: [
                                    { label: 'false', resultText: '{ "prop": false }' },
                                    { label: '"rcodetools"', resultText: '{ "prop": "rcodetools" }' },
                                    { label: '""', resultText: '{ "prop": "" }' }
                                ],
                                count: 3
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('examples', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                prop: {
                                    type: ['string'],
                                    examples: ['a', 'b'],
                                    default: 'c'
                                }
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ "prop": | }', schema, {
                                items: [
                                    { label: '"a"', resultText: '{ "prop": "a" }' },
                                    { label: '"b"', resultText: '{ "prop": "b" }' },
                                    { label: '"c"', resultText: '{ "prop": "c" }' }
                                ],
                                count: 3
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Const', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                prop: {
                                    type: 'string',
                                    const: 'hello'
                                },
                                propBool: {
                                    type: 'boolean',
                                    const: false
                                }
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ "prop": | }', schema, {
                                items: [
                                    { label: '"hello"', resultText: '{ "prop": "hello" }' },
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "propBool": | }', schema, {
                                items: [
                                    { label: 'false', resultText: '{ "propBool": false }' }
                                ],
                                count: 1
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('$schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                        };
                        return [4 /*yield*/, testCompletionsFor('{ "$sc| }', null, {
                                items: [
                                    { label: '$schema', resultText: '{ "\\$schema": $1' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "$schema": | }', schema, {
                                items: [
                                    { label: '"http://myschemastore/test1"', resultText: '{ "$schema": "http://myschemastore/test1" }' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "$schema": "|', schema, {
                                items: [
                                    { label: '"http://myschemastore/test1"', resultText: '{ "$schema": "http://myschemastore/test1"' }
                                ]
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "$schema": "h|', schema, {
                                items: [
                                    { label: '"http://myschemastore/test1"', resultText: '{ "$schema": "http://myschemastore/test1"' }
                                ]
                            })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "$schema": "http://myschemastore/test1"| }', schema, {
                                items: [
                                    { label: '"http://myschemastore/test1"', resultText: '{ "$schema": "http://myschemastore/test1" }' }
                                ]
                            })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('root default proposals', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema1, schema2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema1 = {
                            type: 'object',
                            default: {
                                hello: 'world'
                            }
                        };
                        schema2 = {
                            anyOf: [
                                {
                                    default: {}
                                },
                                {
                                    defaultSnippets: [{ label: 'def1', description: 'def1Desc', body: { hello: '${1:world}' } },
                                        { body: { "${1:hello}": ["${2:world}"] } }]
                                }
                            ],
                            type: 'object',
                            default: {
                                hello: 'world'
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('|', schema1, {
                                items: [
                                    { label: '{"hello":"world"}', resultText: '{\n\t"hello": "world"\n\\}' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('|', schema2, {
                                items: [
                                    { label: '{}', resultText: '{$1}' },
                                    { label: 'def1', documentation: 'def1Desc', resultText: '{\n\t"hello": "${1:world}"\n}' },
                                    { label: '{"hello":["world"]}', resultText: '{\n\t"${1:hello}": [\n\t\t"${2:world}"\n\t]\n}' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Default snippet', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'array',
                            items: {
                                type: 'object',
                                defaultSnippets: [
                                    { label: 'foo', bodyText: '{\n\t"foo": "${1:b}"\n}' },
                                    { label: 'foo2', body: { key1: '^$1' } }
                                ]
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('|', schema, {
                                items: [
                                    { label: 'foo', resultText: '[\n\t{\n\t\t"foo": "${1:b}"\n\t}\n]' },
                                    { label: 'foo2', resultText: '[\n\t{\n\t\t"key1": $1\n\t}\n]' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Deprecation message', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                'prop1': {
                                    deprecationMessage: "Prop is deprecated"
                                },
                                'prop2': {
                                    type: 'string'
                                },
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ |', schema, {
                                items: [
                                    { label: 'prop2' },
                                    { label: 'prop1', notAvailable: true }
                                ]
                            })];
                    case 1:
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
                                    enum: ['e1', 'e2', 'e3'],
                                    enumDescriptions: ['E1', 'E2', 'E3'],
                                },
                                'prop2': {
                                    description: 'prop2',
                                    enum: ['e1', 'e2', 'e3'],
                                },
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ "prop1": |', schema, {
                                items: [
                                    { label: '"e1"', documentation: 'E1' },
                                    { label: '"e2"', documentation: 'E2' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "prop2": |', schema, {
                                items: [
                                    { label: '"e1"', documentation: 'prop2' },
                                    { label: '"e2"', documentation: 'prop2' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Enum markdown description', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                'prop1': {
                                    enum: ['e1', 'e2', 'e3'],
                                    markdownEnumDescriptions: ['*E1*', '*E2*', '*E3*'],
                                },
                                'prop2': {
                                    enum: ['e1', 'e2', 'e3'],
                                    enumDescriptions: ['E1', 'E2', 'E3'],
                                    markdownEnumDescriptions: ['*E1*', '*E2*', '*E3*'],
                                },
                                'prop3': {
                                    description: 'Hello',
                                    markdownDescription: '*Hello*',
                                    enum: ['e1', 'e2', 'e3'],
                                    markdownEnumDescriptions: ['*E1*', '*E2*', '*E3*'],
                                },
                                'prop4': {
                                    markdownDescription: '*prop4*',
                                    enum: ['e1', 'e2', 'e3'],
                                },
                                'prop5': {
                                    description: 'prop5',
                                    markdownDescription: '*prop5*',
                                    enum: ['e1', 'e2', 'e3'],
                                },
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ "prop1": |', schema, {
                                items: [
                                    { label: '"e1"', documentation: { kind: 'markdown', value: '*E1*' } },
                                    { label: '"e2"', documentation: { kind: 'markdown', value: '*E2*' } }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "prop2": |', schema, {
                                items: [
                                    { label: '"e1"', documentation: { kind: 'markdown', value: '*E1*' } },
                                    { label: '"e2"', documentation: { kind: 'markdown', value: '*E2*' } }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "prop3": |', schema, {
                                items: [
                                    { label: '"e1"', documentation: { kind: 'markdown', value: '*E1*' } },
                                    { label: '"e2"', documentation: { kind: 'markdown', value: '*E2*' } }
                                ]
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "prop4": |', schema, {
                                items: [
                                    { label: '"e1"', documentation: { kind: 'markdown', value: '*prop4*' } },
                                    { label: '"e2"', documentation: { kind: 'markdown', value: '*prop4*' } }
                                ]
                            })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "prop5": |', schema, {
                                items: [
                                    { label: '"e1"', documentation: { kind: 'markdown', value: '*prop5*' } },
                                    { label: '"e2"', documentation: { kind: 'markdown', value: '*prop5*' } }
                                ]
                            })];
                    case 5:
                        _a.sent();
                        // without markdown capability
                        return [4 /*yield*/, testCompletionsFor('{ "prop1": |', schema, {
                                items: [
                                    { label: '"e1"', documentation: undefined },
                                ]
                            }, {})];
                    case 6:
                        // without markdown capability
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "prop2": |', schema, {
                                items: [
                                    { label: '"e1"', documentation: 'E1' },
                                ]
                            }, {})];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('In comment', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testCompletionsFor('[{ "name": "John", "age": 44 }, { /* | */ }', null, {
                            count: 0
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('[{ "name": "John", "age": 44 }, {\n // |', null, {
                                count: 0
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('DoNotSuggest', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                'prop1': {
                                    doNotSuggest: true
                                },
                                'prop2': {
                                    doNotSuggest: false
                                },
                                'prop3': {
                                    doNotSuggest: false
                                },
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ |', schema, {
                                items: [
                                    { label: 'prop2' },
                                    { label: 'prop3' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('suggestSortText', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                'prop1': {
                                    suggestSortText: 'a'
                                },
                                'prop2': {
                                    suggestSortText: 'b'
                                },
                                'prop3': {
                                    doNotSuggest: false
                                },
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ |', schema, {
                                items: [
                                    { label: 'prop2', sortText: 'b' },
                                    { label: 'prop3', sortText: undefined }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Primary property', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            oneOf: [{
                                    properties: {
                                        type: {
                                            enum: ['foo'],
                                        },
                                        prop1: {
                                            enum: ['e1', 'e2']
                                        }
                                    }
                                }, {
                                    type: 'object',
                                    properties: {
                                        type: {
                                            enum: ['bar'],
                                        },
                                        prop1: {
                                            enum: ['f1', 'f2']
                                        }
                                    }
                                }]
                        };
                        return [4 /*yield*/, testCompletionsFor('{ "type": |', schema, {
                                items: [
                                    { label: '"foo"' },
                                    { label: '"bar"' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "type": "f|', schema, {
                                items: [
                                    { label: '"foo"' },
                                    { label: '"bar"' }
                                ]
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{ "type": "foo|"', schema, {
                                items: [
                                    { label: '"foo"' },
                                    { label: '"bar"' }
                                ]
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Property with values', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            type: 'object',
                            properties: {
                                object: {
                                    type: 'object'
                                },
                                string: {
                                    type: 'string'
                                },
                                boolean: {
                                    type: 'boolean'
                                },
                                array: {
                                    type: 'array'
                                },
                                oneEnum: {
                                    enum: ['foo'],
                                },
                                multiEnum: {
                                    enum: ['foo', 'bar'],
                                },
                                default: {
                                    default: 'foo',
                                },
                                defaultSnippet: {
                                    defaultSnippets: [{ body: 'foo' }]
                                },
                                defaultSnippets: {
                                    defaultSnippets: [{ body: 'foo' }, { body: 'bar' }]
                                },
                                snippetAndEnum: {
                                    defaultSnippets: [{ body: 'foo' }],
                                    enum: ['foo', 'bar']
                                },
                                defaultAndEnum: {
                                    default: 'foo',
                                    enum: ['foo', 'bar']
                                },
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('{ |', schema, {
                                items: [
                                    { label: 'object', resultText: '{ "object": {$1}' },
                                    { label: 'array', resultText: '{ "array": [$1]' },
                                    { label: 'string', resultText: '{ "string": "$1"' },
                                    { label: 'boolean', resultText: '{ "boolean": $1' },
                                    { label: 'oneEnum', resultText: '{ "oneEnum": "${1:foo}"' },
                                    { label: 'multiEnum', resultText: '{ "multiEnum": $1' },
                                    { label: 'default', resultText: '{ "default": "${1:foo}"' },
                                    { label: 'defaultSnippet', resultText: '{ "defaultSnippet": "foo"' },
                                    { label: 'defaultSnippets', resultText: '{ "defaultSnippets": $1' },
                                    { label: 'snippetAndEnum', resultText: '{ "snippetAndEnum": $1' },
                                    { label: 'defaultAndEnum', resultText: '{ "defaultAndEnum": $1' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test("if then and else", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testCompletionsFor("{|}", {
                            if: { properties: { a: { type: "string" } } }
                        }, { count: 1, items: [{ label: "a", resultText: '{"a": "$1"}' }] })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor("{|}", {
                                if: { properties: { a: { type: "string" } }, required: ["a"] }, then: { properties: { b: { type: "string" } } }, properties: { c: { type: "string" } }
                            }, { count: 2, items: [{ label: "a", resultText: '{"a": "$1"}' }, { label: "c", resultText: '{"c": "$1"}' }] })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{"a":"test",|}', {
                                if: { properties: { a: { type: "string" } }, required: ["a"] }, then: { properties: { b: { type: "string" } } }, else: { properties: { c: { type: "string" } } }
                            }, { count: 1, items: [{ label: "b", resultText: '{"a":"test","b": "$1"}' }] })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, testCompletionsFor('{"a":"test",|}', {
                                if: { properties: { a: { type: "string" } }, required: ["a"] }, then: { properties: { b: { type: "string" } } }
                            }, { count: 1, items: [{ label: "b", resultText: '{"a":"test","b": "$1"}' }] })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    test('Filering same label, issue #1062', function () {
        return __awaiter(this, void 0, void 0, function () {
            var schema;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = {
                            "type": "array",
                            "items": {
                                "enum": [
                                    "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg1",
                                    "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg2",
                                    "_abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg1",
                                    "_abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg2"
                                ]
                            }
                        };
                        return [4 /*yield*/, testCompletionsFor('[ |', schema, {
                                count: 4,
                                items: [
                                    { label: '"abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcd...', resultText: '[ "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg1"' },
                                    { label: '"abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg2"', resultText: '[ "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg2"' },
                                    { label: '"_abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabc...', resultText: '[ "_abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg1"' },
                                    { label: '"_abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg2"', resultText: '[ "_abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg2"' }
                                ]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
});
