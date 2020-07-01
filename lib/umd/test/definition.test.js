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
        define(["require", "exports", "assert", "../json5LanguageService"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var assert = require("assert");
    var json5LanguageService_1 = require("../json5LanguageService");
    suite('JSON5 Find Definitions', function () {
        var testFindDefinitionFor = function (value, expected) {
            var offset = value.indexOf('|');
            value = value.substr(0, offset) + value.substr(offset + 1);
            var ls = json5LanguageService_1.getLanguageService({ clientCapabilities: json5LanguageService_1.ClientCapabilities.LATEST });
            var document = json5LanguageService_1.TextDocument.create('test://test/test.json', 'json', 0, value);
            var position = json5LanguageService_1.Position.create(0, offset);
            var jsonDoc = ls.parseJSON5Document(document);
            return ls.findDefinition(document, position, jsonDoc).then(function (list) {
                if (expected) {
                    assert.notDeepEqual(list, []);
                    var startOffset = list[0].targetRange.start.character;
                    assert.equal(startOffset, expected.offset);
                    assert.equal(list[0].targetRange.end.character - startOffset, expected.length);
                }
                else {
                    assert.deepEqual(list, []);
                }
            });
        };
        test('FindDefinition invalid ref', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testFindDefinitionFor('{|}', null)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor('{"name": |"John"}', null)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor('{"|name": "John"}', null)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor('{"name": "|John"}', null)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor('{"name": "John", "$ref": "#/|john/name"}', null)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor('{"name": "John", "$ref|": "#/name"}', null)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor('{"name": "John", "$ref": "#/|"}', null)];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        test('FindDefinition valid ref', function () {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, testFindDefinitionFor('{"name": "John", "$ref": "#/n|ame"}', { offset: 9, length: 6 })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor('{"name": "John", "$ref": "|#/name"}', { offset: 9, length: 6 })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor('{"name": "John", "$ref": |"#/name"}', { offset: 9, length: 6 })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor('{"name": "John", "$ref": "#/name"|}', { offset: 9, length: 6 })];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor('{"name": "John", "$ref": "#/name|"}', { offset: 9, length: 6 })];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor('{"name": "John", "$ref": "#|"}', { offset: 0, length: 29 })];
                        case 6:
                            _a.sent();
                            doc = function (ref) { return "{\"foo\": [\"bar\", \"baz\"],\"\": 0,\"a/b\": 1,\"c%d\": 2,\"e^f\": 3,\"i\\\\j\": 5,\"k\\\"l\": 6,\" \": 7,\"m~n\": 8, \"$ref\": \"|" + ref + "\"}"; };
                            return [4 /*yield*/, testFindDefinitionFor(doc('#'), { offset: 0, length: 105 })];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor(doc('#/foo'), { offset: 8, length: 14 })];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor(doc('#/foo/0'), { offset: 9, length: 5 })];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor(doc('#/foo/1'), { offset: 16, length: 5 })];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor(doc('#/foo/01'), null)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor(doc('#/'), { offset: 27, length: 1 })];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor(doc('#/a~1b'), { offset: 36, length: 1 })];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor(doc('#/c%d'), { offset: 45, length: 1 })];
                        case 14:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor(doc('#/e^f'), { offset: 54, length: 1 })];
                        case 15:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor(doc('#/i\\\\j'), { offset: 64, length: 1 })];
                        case 16:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor(doc('#/k\\"l'), { offset: 74, length: 1 })];
                        case 17:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor(doc('#/ '), { offset: 81, length: 1 })];
                        case 18:
                            _a.sent();
                            return [4 /*yield*/, testFindDefinitionFor(doc('#/m~0n'), { offset: 90, length: 1 })];
                        case 19:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
