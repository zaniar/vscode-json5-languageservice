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
import { getNodePath, getNodeValue } from '../parser/json5Parser';
import { TextDocument, Range, ErrorCode, getLanguageService } from '../json5LanguageService';
suite('JSON5 Parser', function () {
    function isValid(json) {
        var jsonDoc = toDocument(json).jsonDoc;
        assert.equal(jsonDoc.syntaxErrors.length, 0);
    }
    function isInvalid(json) {
        var expectedErrors = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            expectedErrors[_i - 1] = arguments[_i];
        }
        var jsonDoc = toDocument(json).jsonDoc;
        if (expectedErrors.length === 0) {
            assert.ok(jsonDoc.syntaxErrors.length > 0, json);
        }
        else {
            assert.deepEqual(jsonDoc.syntaxErrors.map(function (e) { return e.code; }), expectedErrors, json);
        }
        // these should be caught by the parser, not the last-ditch guard
        assert.notEqual(jsonDoc.syntaxErrors[0].message, 'Invalid JSON5', json);
    }
    function toDocument(text) {
        var textDoc = TextDocument.create('foo://bar/file.json', 'json', 0, text);
        var ls = getLanguageService({});
        var jsonDoc = ls.parseJSON55Document(textDoc);
        return { textDoc: textDoc, jsonDoc: jsonDoc };
    }
    function toRange(text, offset, length) {
        var textDoc = TextDocument.create('foo://bar/file.json', 'json', 0, text);
        return Range.create(textDoc.positionAt(offset), textDoc.positionAt(offset + length));
    }
    function validate(text, schema) {
        var _a = toDocument(text), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
        return jsonDoc.validate(textDoc, schema);
    }
    function assertObject(node, expectedProperties) {
        assert.equal(node.type, 'object');
        assert.equal(node.properties.length, expectedProperties.length);
        var keyList = node.properties.map(function (p) { return p.keyNode.value; });
        assert.deepEqual(keyList, expectedProperties);
    }
    test('Invalid body', function () {
        var jsonDoc = toDocument('*').jsonDoc;
        assert.equal(jsonDoc.syntaxErrors.length, 1);
        isInvalid('{}[]');
    });
    test('Trailing Whitespace', function () {
        isValid('{}\n\n');
    });
    test('No content', function () {
        isValid('');
        isValid('   ');
        isValid('\n\n');
        isValid('/*hello*/  ');
    });
    test('Objects', function () {
        isValid('{}');
        isValid('{"key": "value"}');
        isValid('{"key1": true, "key2": 3, "key3": [null], "key4": { "nested": {}}}');
        isValid('{"constructor": true }');
        isInvalid('{');
        isInvalid('{3:3}');
        isInvalid('{\'key\': 3}');
        isInvalid('{"key" 3}', ErrorCode.ColonExpected);
        isInvalid('{"key":3 "key2": 4}', ErrorCode.CommaExpected);
        isInvalid('{"key":42, }', ErrorCode.TrailingComma);
        isInvalid('{"key:42', ErrorCode.UnexpectedEndOfString, ErrorCode.ColonExpected);
    });
    test('Arrays', function () {
        isValid('[]');
        isValid('[1, 2]');
        isValid('[1, "string", false, {}, [null]]');
        isInvalid('[');
        isInvalid('[,]', ErrorCode.ValueExpected);
        isInvalid('[1 2]', ErrorCode.CommaExpected);
        isInvalid('[true false]', ErrorCode.CommaExpected);
        isInvalid('[1, ]', ErrorCode.TrailingComma);
        isInvalid('[[]', ErrorCode.CommaOrCloseBacketExpected);
        isInvalid('["something"');
        isInvalid('[magic]');
    });
    test('Strings', function () {
        isValid('["string"]');
        isValid('["\\"\\\\\\/\\b\\f\\n\\r\\t\\u1234\\u12AB"]');
        isValid('["\\\\"]');
        isInvalid('["');
        isInvalid('["]');
        isInvalid('["\\z"]');
        isInvalid('["\\u"]');
        isInvalid('["\\u123"]');
        isInvalid('["\\u123Z"]');
        isInvalid('[\'string\']');
        isInvalid('"\tabc"', ErrorCode.InvalidCharacter);
    });
    test('Numbers', function () {
        isValid('[0, -1, 186.1, 0.123, -1.583e+4, 1.583E-4, 5e8]');
        isInvalid('[+1]');
        isInvalid('[01]');
        isInvalid('[1.]');
        isInvalid('[1.1+3]');
        isInvalid('[1.4e]');
        isInvalid('[-A]');
    });
    test('Comments', function () {
        isValid('/*d*/ { } /*e*/');
        isInvalid('/*d { }');
    });
    test('Simple AST', function () {
        {
            var jsonDoc = toDocument('{}').jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var node = jsonDoc.getNodeFromOffset(1);
            assert.equal(node.type, 'object');
            assert.deepEqual(getNodePath(node), []);
            assert.strictEqual(jsonDoc.getNodeFromOffset(2), undefined);
        }
        {
            var jsonDoc = toDocument('[null]').jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var node = jsonDoc.getNodeFromOffset(2);
            assert.equal(node.type, 'null');
            assert.deepEqual(getNodePath(node), [0]);
        }
        {
            var jsonDoc = toDocument('{"a":true}').jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var node = jsonDoc.getNodeFromOffset(3);
            assert.equal(node.type, 'string');
            assert.deepEqual(getNodePath(node), ['a']);
            node = jsonDoc.getNodeFromOffset(4);
            assert.equal(node.type, 'property');
            node = jsonDoc.getNodeFromOffset(0);
            assert.equal(node.type, 'object');
            node = jsonDoc.getNodeFromOffset(10);
            assert.equal(node, undefined);
            node = jsonDoc.getNodeFromOffset(5);
            assert.equal(node.type, 'boolean');
            assert.deepEqual(getNodePath(node), ['a']);
        }
    });
    test('Nested AST', function () {
        var content = '{\n\t"key" : {\n\t"key2": 42\n\t}\n}';
        var jsonDoc = toDocument(content).jsonDoc;
        assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
        var node = jsonDoc.getNodeFromOffset(content.indexOf('key2') + 2);
        var location = getNodePath(node);
        assert.deepEqual(location, ['key', 'key2']);
        node = jsonDoc.getNodeFromOffset(content.indexOf('42') + 1);
        location = getNodePath(node);
        assert.deepEqual(location, ['key', 'key2']);
    });
    test('Nested AST in Array', function () {
        var jsonDoc = toDocument('{"key":[{"key2":42}]}').jsonDoc;
        assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
        var node = jsonDoc.getNodeFromOffset(17);
        var location = getNodePath(node);
        assert.deepEqual(location, ['key', 0, 'key2']);
    });
    test('Multiline', function () {
        {
            var content = '{\n\t\n}';
            var jsonDoc = toDocument(content).jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var node = jsonDoc.getNodeFromOffset(content.indexOf('\t') + 1);
            assert.notEqual(node, null);
        }
        {
            var content = '{\n"first":true\n\n}';
            var jsonDoc = toDocument(content).jsonDoc;
            var node = jsonDoc.getNodeFromOffset(content.length - 2);
            assert.equal(node.type, 'object');
            node = jsonDoc.getNodeFromOffset(content.length - 4);
            assert.equal(node.type, 'boolean');
        }
    });
    test('Expand errors to entire tokens', function () {
        var content = '{\n"key":32,\nerror\n}';
        var jsonDoc = toDocument(content).jsonDoc;
        assert.equal(jsonDoc.syntaxErrors.length, 2);
        assert.deepEqual(jsonDoc.syntaxErrors[0].range, toRange(content, content.indexOf('error'), 5));
    });
    test('Errors at the end of the file', function () {
        var content = '{\n"key":32\n ';
        var jsonDoc = toDocument(content).jsonDoc;
        assert.equal(jsonDoc.syntaxErrors.length, 1);
        assert.deepEqual(jsonDoc.syntaxErrors[0].range, toRange(content, 9, 1));
    });
    test('Getting keys out of an object', function () {
        var content = '{\n"key":32,\n\n"key2":45}';
        var jsonDoc = toDocument(content).jsonDoc;
        assert.equal(jsonDoc.syntaxErrors.length, 0);
        var node = jsonDoc.getNodeFromOffset(content.indexOf('32,\n') + 4);
        assertObject(node, ['key', 'key2']);
    });
    test('Missing colon', function () {
        var content = '{\n"key":32,\n"key2"\n"key3": 4 }';
        var jsonDoc = toDocument(content).jsonDoc;
        assert.equal(jsonDoc.syntaxErrors.length, 1);
        assert.equal(jsonDoc.syntaxErrors[0].code, ErrorCode.ColonExpected);
        var root = jsonDoc.root;
        assertObject(root, ['key', 'key2', 'key3']);
    });
    test('Missing comma', function () {
        var content = '{\n"key":32,\n"key2": 1 \n"key3": 4 }';
        var jsonDoc = toDocument(content).jsonDoc;
        assert.equal(jsonDoc.syntaxErrors.length, 1);
        assert.equal(jsonDoc.syntaxErrors[0].code, ErrorCode.CommaExpected);
        assertObject(jsonDoc.root, ['key', 'key2', 'key3']);
    });
    test('Validate types', function () {
        var str = '{"number": 3.4, "integer": 42, "string": "some string", "boolean":true, "null":null, "object":{}, "array":[1, 2]}';
        var _a = toDocument(str), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
        assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
        var semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object'
        });
        assert.strictEqual(semanticErrors.length, 0);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'array'
        });
        assert.strictEqual(semanticErrors.length, 1);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "number": {
                    type: 'number'
                },
                "integer": {
                    type: 'integer'
                },
                "string": {
                    type: 'string'
                },
                "boolean": {
                    type: 'boolean'
                },
                "null": {
                    type: 'null'
                },
                "object": {
                    type: 'object'
                },
                "array": {
                    type: 'array'
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 0);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "number": {
                    type: 'array'
                },
                "integer": {
                    type: 'string'
                },
                "string": {
                    type: 'object'
                },
                "boolean": {
                    type: 'null'
                },
                "null": {
                    type: 'integer'
                },
                "object": {
                    type: 'boolean'
                },
                "array": {
                    type: 'number'
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 7);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "number": {
                    type: 'integer'
                },
            }
        });
        assert.strictEqual(semanticErrors.length, 1);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "integer": {
                    type: 'number'
                },
            }
        });
        assert.strictEqual(semanticErrors.length, 0);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "array": {
                    type: 'array',
                    items: {
                        type: 'integer'
                    }
                },
            }
        });
        assert.strictEqual(semanticErrors.length, 0);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "array": {
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
            }
        });
        assert.strictEqual(semanticErrors.length, 2);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "array": false,
            }
        });
        assert.strictEqual(semanticErrors.length, 1);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "array": true,
            }
        });
        assert.strictEqual(semanticErrors.length, 0);
    });
    test('Required properties', function () {
        var str = '{"integer": 42, "string": "some string", "boolean":true}';
        var _a = toDocument(str), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
        assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
        var semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            required: ['string']
        });
        assert.strictEqual(semanticErrors.length, 0);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            required: ['notpresent']
        });
        assert.strictEqual(semanticErrors.length, 1);
    });
    test('Arrays', function () {
        var str = '[1, 2, 3]';
        var _a = toDocument(str), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
        assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
        var semanticErrors = jsonDoc.validate(textDoc, {
            type: 'array',
            items: {
                type: 'number'
            },
            minItems: 1,
            maxItems: 5
        });
        assert.strictEqual(semanticErrors.length, 0);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'array',
            items: {
                type: 'number'
            },
            minItems: 10
        });
        assert.strictEqual(semanticErrors.length, 1);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'array',
            items: {
                type: 'number'
            },
            maxItems: 2
        });
        assert.strictEqual(semanticErrors.length, 1);
    });
    test('Strings', function () {
        var str = '{"one":"test"}';
        var _a = toDocument(str), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
        assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
        var semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'string',
                    minLength: 1,
                    maxLength: 10
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 0);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'string',
                    minLength: 10,
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 1);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'string',
                    maxLength: 3,
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 1);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'string',
                    pattern: '^test$'
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 0);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'string',
                    pattern: 'fail'
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 1);
        var schemaWithURI = {
            type: 'object',
            properties: {
                "one": {
                    type: 'string',
                    format: 'uri'
                }
            }
        };
        semanticErrors = jsonDoc.validate(textDoc, schemaWithURI);
        assert.strictEqual(semanticErrors.length, 1);
        assert.strictEqual(semanticErrors[0].message, 'String is not a URI: URI with a scheme is expected.');
        semanticErrors = validate('{"one":"http://foo/bar"}', schemaWithURI);
        assert.strictEqual(semanticErrors.length, 0);
        semanticErrors = validate('{"one":""}', schemaWithURI);
        assert.strictEqual(semanticErrors.length, 1);
        assert.strictEqual(semanticErrors[0].message, 'String is not a URI: URI expected.');
        semanticErrors = validate('{"one":"//foo/bar"}', schemaWithURI);
        assert.strictEqual(semanticErrors.length, 1);
        assert.strictEqual(semanticErrors[0].message, 'String is not a URI: URI with a scheme is expected.');
        var schemaWithURIReference = {
            type: 'object',
            properties: {
                "one": {
                    type: 'string',
                    format: 'uri-reference'
                }
            }
        };
        semanticErrors = validate('{"one":""}', schemaWithURIReference);
        assert.strictEqual(semanticErrors.length, 1, 'uri-reference');
        assert.strictEqual(semanticErrors[0].message, 'String is not a URI: URI expected.');
        semanticErrors = validate('{"one":"//foo/bar"}', schemaWithURIReference);
        assert.strictEqual(semanticErrors.length, 0, 'uri-reference');
        var schemaWithEMail = {
            type: 'object',
            properties: {
                "mail": {
                    type: 'string',
                    format: 'email'
                }
            }
        };
        semanticErrors = validate('{"mail":"foo@bar.com"}', schemaWithEMail);
        assert.strictEqual(semanticErrors.length, 0, "email");
        semanticErrors = validate('{"mail":"foo"}', schemaWithEMail);
        assert.strictEqual(semanticErrors.length, 1, "email");
        assert.strictEqual(semanticErrors[0].message, 'String is not an e-mail address.');
        var schemaWithColor = {
            type: 'object',
            properties: {
                "color": {
                    type: 'string',
                    format: 'color-hex'
                }
            }
        };
        semanticErrors = validate('{"color":"#FF00FF"}', schemaWithColor);
        assert.strictEqual(semanticErrors.length, 0, "email");
        semanticErrors = validate('{"color":"#FF00F"}', schemaWithColor);
        assert.strictEqual(semanticErrors.length, 1, "email");
        assert.strictEqual(semanticErrors[0].message, 'Invalid color format. Use #RGB, #RGBA, #RRGGBB or #RRGGBBAA.');
        var schemaWithDateTime = {
            type: 'object',
            properties: {
                "date-time": {
                    type: 'string',
                    format: 'date-time'
                },
                "date": {
                    type: 'string',
                    format: 'date'
                },
                "time": {
                    type: 'string',
                    format: 'time'
                }
            }
        };
        semanticErrors = validate('{"date-time":"1985-04-12T23:20:50.52Z"}', schemaWithDateTime);
        assert.strictEqual(semanticErrors.length, 0, "date-time");
        semanticErrors = validate('{"date-time":"1996-12-19T16:39:57-08:00"}', schemaWithDateTime);
        assert.strictEqual(semanticErrors.length, 0, "date-time");
        semanticErrors = validate('{"date-time":"1990-12-31T23:59:60Z"}', schemaWithDateTime);
        assert.strictEqual(semanticErrors.length, 0, "date-time");
        semanticErrors = validate('{"date-time":"1937-01-01T12:00:27.87+00:20"}', schemaWithDateTime);
        assert.strictEqual(semanticErrors.length, 0, "date-time");
        semanticErrors = validate('{"date-time":"198a-04-12T23:20:50.52Z"}', schemaWithDateTime);
        assert.strictEqual(semanticErrors.length, 1, "date-time");
        assert.strictEqual(semanticErrors[0].message, 'String is not a RFC3339 date-time.');
        semanticErrors = validate('{"date-time":"198a-04-12"}', schemaWithDateTime);
        assert.strictEqual(semanticErrors.length, 1, "date-time");
        assert.strictEqual(semanticErrors[0].message, 'String is not a RFC3339 date-time.');
        semanticErrors = validate('{"date-time":""}', schemaWithDateTime);
        assert.strictEqual(semanticErrors.length, 1, "date-time");
        assert.strictEqual(semanticErrors[0].message, 'String is not a RFC3339 date-time.');
        semanticErrors = validate('{"date":"1937-01-01"}', schemaWithDateTime);
        assert.strictEqual(semanticErrors.length, 0, "date");
        semanticErrors = validate('{"date":"23:20:50.52Z"}', schemaWithDateTime);
        assert.strictEqual(semanticErrors.length, 1, "date");
        assert.strictEqual(semanticErrors[0].message, 'String is not a RFC3339 date.');
        semanticErrors = validate('{"time":"23:20:50.52Z"}', schemaWithDateTime);
        assert.strictEqual(semanticErrors.length, 0, "time");
        semanticErrors = validate('{"time":"198a-04-12T23:20:50.52Z"}', schemaWithDateTime);
        assert.strictEqual(semanticErrors.length, 1, "time");
        assert.strictEqual(semanticErrors[0].message, 'String is not a RFC3339 time.');
    });
    test('Numbers', function () {
        var str = '{"one": 13.45e+1}';
        var _a = toDocument(str), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
        assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
        var semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'number',
                    minimum: 1,
                    maximum: 135
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 0);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'number',
                    minimum: 200,
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 1, 'below minimum');
        assert.strictEqual(semanticErrors[0].message, 'Value is below the minimum of 200.');
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'number',
                    maximum: 130,
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 1, 'above maximum');
        assert.strictEqual(semanticErrors[0].message, 'Value is above the maximum of 130.');
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'number',
                    minimum: 134.5,
                    exclusiveMinimum: true
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 1, 'at exclusive mininum');
        assert.strictEqual(semanticErrors[0].message, 'Value is below the exclusive minimum of 134.5.');
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'number',
                    minimum: 134.5,
                    exclusiveMinimum: false
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 0);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'number',
                    exclusiveMinimum: 134.5
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 1, 'at exclusive mininum');
        assert.strictEqual(semanticErrors[0].message, 'Value is below the exclusive minimum of 134.5.');
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'number',
                    maximum: 134.5,
                    exclusiveMaximum: true
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 1, 'at exclusive mininum');
        assert.strictEqual(semanticErrors[0].message, 'Value is above the exclusive maximum of 134.5.');
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'number',
                    maximum: 134.5,
                    exclusiveMaximum: false
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 0);
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'number',
                    exclusiveMaximum: 134.5
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 1, 'at exclusive mininum');
        assert.strictEqual(semanticErrors[0].message, 'Value is above the exclusive maximum of 134.5.');
        semanticErrors = jsonDoc.validate(textDoc, {
            type: 'object',
            properties: {
                "one": {
                    type: 'number',
                    minimum: 134.5,
                    maximum: 134.5
                }
            }
        });
        assert.strictEqual(semanticErrors.length, 0, 'equal to min and max');
    });
    test('getNodeFromOffset', function () {
        var content = '{"a": 1,\n\n"d": 2}';
        var jsonDoc = toDocument(content).jsonDoc;
        assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
        var node = jsonDoc.getNodeFromOffset(content.indexOf(': 2') + 1);
        assert.strictEqual(node.type, 'property');
    });
    test('Duplicate keys', function () {
        {
            var jsonDoc = toDocument('{"a": 1, "a": 2}').jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 2, 'Keys should not be the same');
        }
        {
            var jsonDoc = toDocument('{"a": { "a": 2, "a": 3}}').jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 2, 'Keys should not be the same');
        }
        {
            var jsonDoc = toDocument('[{ "a": 2, "a": 3, "a": 7}]').jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 3, 'Keys should not be the same');
        }
    });
    test('allOf', function () {
        var schema = {
            id: 'test://schemas/main',
            allOf: [
                {
                    type: 'object'
                },
                {
                    properties: {
                        'prop1': {
                            type: 'number'
                        }
                    }
                },
                {
                    properties: {
                        'prop2': {
                            type: 'boolean'
                        }
                    }
                }
            ]
        };
        {
            var _a = toDocument('{"prop1": 42, "prop2": true}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('{"prop1": 42, "prop2": 123}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
    });
    test('anyOf', function () {
        var schema = {
            id: 'test://schemas/main',
            anyOf: [
                {
                    properties: {
                        'prop1': {
                            type: 'number'
                        }
                    }
                },
                {
                    properties: {
                        'prop2': {
                            type: 'boolean'
                        }
                    }
                }
            ]
        };
        {
            var str = '{"prop1": 42, "prop2": true}';
            var _a = toDocument(str), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('{"prop1": 42, "prop2": 123}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _c = toDocument('{"prop1": "a string", "prop2": 123}'), textDoc = _c.textDoc, jsonDoc = _c.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
    });
    test('oneOf', function () {
        var schema = {
            id: 'test://schemas/main',
            oneOf: [
                {
                    properties: {
                        'prop1': {
                            type: 'number'
                        }
                    }
                },
                {
                    properties: {
                        'prop2': {
                            type: 'boolean'
                        }
                    }
                }
            ]
        };
        {
            var _a = toDocument('{"prop1": 42, "prop2": true}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        {
            var _b = toDocument('{"prop1": 42, "prop2": 123}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _c = toDocument('{"prop1": "a string", "prop2": 123}'), textDoc = _c.textDoc, jsonDoc = _c.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
    });
    test('not', function () {
        var schema = {
            id: 'test://schemas/main',
            not: {
                properties: {
                    'prop1': {
                        type: 'number'
                    }
                }
            }
        };
        {
            var _a = toDocument('{"prop1": 42, "prop2": true}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        {
            var _b = toDocument('{"prop1": "test"}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
    });
    test('if/then/else', function () {
        var schema = {
            id: 'test://schemas/main',
            if: {
                properties: {
                    foo: {
                        const: 'bar'
                    }
                }
            },
            then: {
                properties: {
                    abc: {
                        type: 'boolean'
                    }
                }
            },
            else: {
                properties: {
                    abc: {
                        type: 'string'
                    }
                }
            }
        };
        {
            var _a = toDocument('{"foo": "bar", "abc": true}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('{"foo": "bar", "abc": "baz"}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        {
            var _c = toDocument('{"foo": "test", "abc": true}'), textDoc = _c.textDoc, jsonDoc = _c.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        {
            var _d = toDocument('{"foo": "test", "abc": "baz"}'), textDoc = _d.textDoc, jsonDoc = _d.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
    });
    test('nested if/then/else', function () {
        var schema = {
            id: 'test://schemas/main',
            if: {
                properties: {
                    foo: {
                        const: 'bar'
                    }
                }
            },
            then: {
                properties: {
                    abc: {
                        type: 'boolean'
                    }
                }
            },
            else: {
                if: {
                    properties: {
                        foo: {
                            const: 'baz'
                        }
                    }
                },
                then: {
                    properties: {
                        abc: {
                            type: 'array'
                        }
                    }
                },
                else: {
                    properties: {
                        abc: {
                            type: 'string'
                        }
                    }
                }
            }
        };
        {
            var _a = toDocument('{"foo": "bar", "abc": true}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('{"foo": "bar", "abc": "baz"}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        {
            var _c = toDocument('{"foo": "baz", "abc": []}'), textDoc = _c.textDoc, jsonDoc = _c.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _d = toDocument('{"foo": "baz", "abc": "baz"}'), textDoc = _d.textDoc, jsonDoc = _d.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        {
            var _e = toDocument('{"foo": "test", "abc": true}'), textDoc = _e.textDoc, jsonDoc = _e.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        {
            var _f = toDocument('{"foo": "test", "abc": "baz"}'), textDoc = _f.textDoc, jsonDoc = _f.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
    });
    test('minProperties', function () {
        var _a = toDocument('{"prop1": 42, "prop2": true}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
        var schema = {
            minProperties: 2
        };
        var semanticErrors = jsonDoc.validate(textDoc, schema);
        assert.strictEqual(semanticErrors.length, 0);
        schema.minProperties = 1;
        semanticErrors = jsonDoc.validate(textDoc, schema);
        assert.strictEqual(semanticErrors.length, 0);
        schema.minProperties = 3;
        semanticErrors = jsonDoc.validate(textDoc, schema);
        assert.strictEqual(semanticErrors.length, 1);
    });
    test('maxProperties', function () {
        var _a = toDocument('{"prop1": 42, "prop2": true}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
        var schema = {
            maxProperties: 2
        };
        var semanticErrors = jsonDoc.validate(textDoc, schema);
        assert.strictEqual(semanticErrors.length, 0);
        schema.maxProperties = 3;
        semanticErrors = jsonDoc.validate(textDoc, schema);
        assert.strictEqual(semanticErrors.length, 0);
        schema.maxProperties = 1;
        semanticErrors = jsonDoc.validate(textDoc, schema);
        assert.strictEqual(semanticErrors.length, 1);
    });
    test('patternProperties', function () {
        var schema = {
            id: 'test://schemas/main',
            patternProperties: {
                '^prop\\d$': {
                    type: 'number'
                }
            }
        };
        {
            var _a = toDocument('{"prop1": 42, "prop2": 42}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('{"prop1": 42, "prop2": true}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        {
            var _c = toDocument('{"prop1": 42, "prop2": 123, "aprop3": true}'), textDoc = _c.textDoc, jsonDoc = _c.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        schema = {
            id: 'test://schemas/main',
            patternProperties: {
                '^prop\\d$': true,
                '^invalid$': false
            }
        };
        {
            var _d = toDocument('{"prop1": 42 }'), textDoc = _d.textDoc, jsonDoc = _d.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _e = toDocument('{"invalid": 42 }'), textDoc = _e.textDoc, jsonDoc = _e.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
    });
    test('additionalProperties', function () {
        var schema = {
            additionalProperties: {
                type: 'number'
            }
        };
        {
            var _a = toDocument('{"prop1": 42, "prop2": 42}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('{"prop1": 42, "prop2": true}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        schema = {
            properties: {
                "prop1": {
                    type: 'boolean'
                }
            },
            additionalProperties: {
                type: 'number'
            }
        };
        {
            var _c = toDocument('{"prop1": true, "prop2": 42}'), textDoc = _c.textDoc, jsonDoc = _c.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        schema = {
            properties: {
                "prop1": {
                    type: 'boolean'
                }
            },
            additionalProperties: false
        };
        {
            var _d = toDocument('{"prop1": true, "prop2": 42}'), textDoc = _d.textDoc, jsonDoc = _d.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        {
            var _e = toDocument('{"prop1": true}'), textDoc = _e.textDoc, jsonDoc = _e.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
    });
    test('enum', function () {
        var schema = {
            properties: {
                'prop': {
                    enum: ['violin', 'harmonica', 'banjo']
                }
            }
        };
        {
            var _a = toDocument('{"prop": "harmonica"}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('{"prop": "harp"}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        schema = {
            properties: {
                'prop': {
                    enum: [1, 42, 999]
                }
            }
        };
        {
            var _c = toDocument('{"prop": 42}'), textDoc = _c.textDoc, jsonDoc = _c.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _d = toDocument('{"prop": 1337}'), textDoc = _d.textDoc, jsonDoc = _d.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        schema = {
            properties: {
                'prop': {
                    enum: ['violin', { "name": "David" }, null]
                }
            }
        };
        {
            var _e = toDocument('{"prop": { "name": "David" }}'), textDoc = _e.textDoc, jsonDoc = _e.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
    });
    test('const', function () {
        var schema = {
            properties: {
                'prop': {
                    const: 'violin'
                }
            }
        };
        {
            var _a = toDocument('{"prop": "violin"}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('{"prop": "harmonica"}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
            assert.strictEqual(semanticErrors[0].code, ErrorCode.EnumValueMismatch);
        }
        {
            var schema_1 = {
                properties: {
                    'prop': {
                        const: { foo: 2 }
                    }
                }
            };
            var _c = toDocument('{"prop": { "foo": 2 }'), textDoc = _c.textDoc, jsonDoc = _c.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema_1);
            assert.strictEqual(semanticErrors.length, 0);
        }
    });
    test('oneOf const', function () {
        var schema = {
            properties: {
                'prop': {
                    oneOf: [
                        {
                            "const": 0,
                            "title": "Value of 0"
                        },
                        {
                            "const": 1,
                            "title": "Value of 1"
                        },
                        {
                            "const": 2,
                            "title": "Value of 2"
                        }
                    ]
                }
            }
        };
        {
            var _a = toDocument('{"prop": 0}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('{"prop": 4}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
            assert.strictEqual(semanticErrors[0].code, ErrorCode.EnumValueMismatch);
        }
    });
    test('propertyNames', function () {
        var schema = {
            propertyNames: {
                type: 'string',
                minLength: 2,
                maxLength: 6
            }
        };
        {
            var _a = toDocument('{"violin": true}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('{"harmonica": false, "violin": true}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
            assert.strictEqual(semanticErrors[0].message, "String is longer than the maximum length of 6.");
        }
    });
    test('uniqueItems', function () {
        var _a = toDocument('[1, 2, 3]'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
        var schema = {
            type: 'array',
            uniqueItems: true
        };
        {
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('[1, 2, 3, 2]'), textDoc_1 = _b.textDoc, jsonDoc_1 = _b.jsonDoc;
            var semanticErrors = jsonDoc_1.validate(textDoc_1, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        {
            var _c = toDocument('[1, 2, "string", 52, "string"]'), textDoc_2 = _c.textDoc, jsonDoc_2 = _c.jsonDoc;
            var semanticErrors = jsonDoc_2.validate(textDoc_2, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
    });
    test('containsItem', function () {
        var schema = {
            type: 'array',
            contains: { type: "number", const: 3 }
        };
        {
            var _a = toDocument('[1, 2, 3]'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('[1, 2, 5]'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
    });
    test('items as array', function () {
        var schema = {
            type: 'array',
            items: [
                {
                    type: 'integer'
                },
                {
                    type: 'boolean'
                },
                {
                    type: 'string'
                }
            ]
        };
        {
            var _a = toDocument('[1, true, "string"]'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('["string", 1, true]'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 3);
        }
        {
            var _c = toDocument('[1, true, "string", "another", 42]'), textDoc = _c.textDoc, jsonDoc = _c.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
    });
    test('additionalItems', function () {
        var schema = {
            type: 'array',
            items: [
                {
                    type: 'integer'
                },
                {
                    type: 'boolean'
                },
                {
                    type: 'string'
                }
            ],
            additionalItems: false
        };
        {
            var _a = toDocument('[1, true, "string"]'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('[1, true, "string", 42]'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
        schema = {
            type: 'array',
            items: [
                {
                    type: 'integer'
                },
                {
                    type: 'boolean'
                },
                {
                    type: 'string'
                }
            ],
            additionalItems: {
                type: "boolean"
            }
        };
        {
            var _c = toDocument('[1, true, "string"]'), textDoc = _c.textDoc, jsonDoc = _c.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _d = toDocument('[1, true, "string", false, true]'), textDoc = _d.textDoc, jsonDoc = _d.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _e = toDocument('[1, true, "string", true, "Hello"]'), textDoc = _e.textDoc, jsonDoc = _e.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
    });
    test('multipleOf', function () {
        var schema = {
            type: 'array',
            items: {
                type: 'integer',
                multipleOf: 2
            }
        };
        {
            var _a = toDocument('[42]'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('[43]'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
    });
    test('dependencies with array', function () {
        var schema = {
            type: 'object',
            properties: {
                a: {
                    type: 'boolean'
                }
            },
            dependencies: {
                a: ['b']
            }
        };
        {
            var _a = toDocument('{"a":true, "b":42}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('{}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _c = toDocument('{"a":true}'), textDoc = _c.textDoc, jsonDoc = _c.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
    });
    test('dependencies with schema', function () {
        var schema = {
            type: 'object',
            properties: {
                a: {
                    type: 'boolean'
                }
            },
            dependencies: {
                a: {
                    properties: {
                        b: {
                            type: 'integer'
                        }
                    }
                }
            }
        };
        {
            var _a = toDocument('{"a":true, "b":42}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('{}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _c = toDocument('{"a":true}'), textDoc = _c.textDoc, jsonDoc = _c.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _d = toDocument('{"a":true, "b": "string"}'), textDoc = _d.textDoc, jsonDoc = _d.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
    });
    test('type as array', function () {
        var schema = {
            type: 'object',
            properties: {
                'prop': {
                    type: ['number', 'string']
                }
            }
        };
        {
            var _a = toDocument('{"prop": 42}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _b = toDocument('{"prop": "string"}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 0);
        }
        {
            var _c = toDocument('{"prop": true}'), textDoc = _c.textDoc, jsonDoc = _c.jsonDoc;
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
        }
    });
    test('deprecated', function () {
        var _a = toDocument('{"prop": 42}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
        var schema = {
            type: 'object',
            properties: {
                'prop': {
                    deprecationMessage: "Prop is deprecated"
                }
            }
        };
        var semanticErrors = jsonDoc.validate(textDoc, schema);
        assert.strictEqual(semanticErrors.length, 1);
    });
    test('Strings with spaces', function () {
        var _a = toDocument('{"key1":"first string", "key2":["second string"]}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
        assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
        var node = jsonDoc.getNodeFromOffset(9);
        assert.strictEqual(getNodeValue(node), 'first string');
        node = jsonDoc.getNodeFromOffset(34);
        assert.strictEqual(getNodeValue(node), 'second string');
    });
    test('Schema information on node', function () {
        var jsonDoc = toDocument('{"key":42}').jsonDoc;
        assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
        var schema = {
            type: 'object',
            properties: {
                'key': {
                    oneOf: [{
                            type: 'number',
                            description: 'this is a number'
                        }, {
                            type: 'string',
                            description: 'this is a string'
                        }]
                }
            }
        };
        var node = jsonDoc.getNodeFromOffset(7);
        assert.strictEqual(node.type, 'number');
        assert.strictEqual(getNodeValue(node), 42);
        var matchingSchemas = jsonDoc.getMatchingSchemas(schema);
        var schemas = matchingSchemas.filter(function (s) { return s.node === node && !s.inverted; }).map(function (s) { return s.schema; });
        assert.ok(Array.isArray(schemas));
        // 0 is the most specific schema,
        // 1 is the schema that contained the "oneOf" clause,
        assert.strictEqual(schemas.length, 2);
        assert.strictEqual(schemas[0].description, 'this is a number');
    });
    test('parse with comments', function () {
        function parse(v) {
            var jsonDoc = toDocument(v).jsonDoc;
            assert.equal(jsonDoc.syntaxErrors.length, 0);
            return getNodeValue(jsonDoc.root);
        }
        var value = parse('// comment\n{\n"far": "boo"\n}');
        assert.equal(value.far, 'boo');
        value = parse('/* comm\nent\nent */\n{\n"far": "boo"\n}');
        assert.equal(value.far, 'boo');
        value = parse('{\n"far": "boo"\n}');
        assert.equal(value.far, 'boo');
    });
    test('parse with comments collected', function () {
        function assertParse(v, expectedComments) {
            var jsonDoc = toDocument(v).jsonDoc;
            assert.equal(jsonDoc.comments.length, expectedComments);
        }
        assertParse('// comment\n{\n"far": "boo"\n}', 1);
        assertParse('/* comm\nent\nent */\n{\n"far": "boo"\n}', 1);
        assertParse('{\n"far": "boo"\n}', 0);
    });
    test('validate alternatives', function () {
        var schema = {
            type: 'object',
            properties: {
                'key': {
                    oneOf: [{
                            type: 'object',
                            properties: {
                                type: {
                                    enum: ['foo']
                                },
                                prop1: {
                                    type: 'boolean'
                                },
                                prop2: {
                                    type: 'boolean'
                                }
                            }
                        }, {
                            type: 'object',
                            properties: {
                                type: {
                                    enum: ['bar']
                                },
                                prop2: {
                                    type: 'number'
                                }
                            }
                        }]
                }
            }
        };
        {
            var _a = toDocument('{"key":{"type":"foo", "prop2":1 }}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
            assert.strictEqual(semanticErrors[0].message, 'Incorrect type. Expected "boolean".');
        }
        {
            var _b = toDocument('{"key":{"type":"bar", "prop1":true, "prop2":false }}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
            assert.strictEqual(semanticErrors[0].message, 'Incorrect type. Expected "number".');
        }
    });
    test('validate alternatives 2', function () {
        var schema = {
            type: 'object',
            properties: {
                'key': {
                    oneOf: [{
                            type: 'object',
                            properties: {
                                type: {
                                    enum: ['foo']
                                },
                                prop1: {
                                    enum: ['v1, v2']
                                },
                                prop2: {
                                    enum: ['w1', 'w2']
                                }
                            }
                        }, {
                            type: 'object',
                            properties: {
                                type: {
                                    enum: ['bar']
                                },
                                prop2: {
                                    enum: ['x1', 'x2']
                                }
                            }
                        }]
                }
            }
        };
        {
            var _a = toDocument('{"key":{"type":"foo", "prop2":"x1" }}'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
            assert.strictEqual(semanticErrors[0].message, 'Value is not accepted. Valid values: "w1", "w2".');
        }
        {
            var _b = toDocument('{"key":{"type":"bar", "prop1":"v1", "prop2":"w1" }}'), textDoc = _b.textDoc, jsonDoc = _b.jsonDoc;
            assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
            var semanticErrors = jsonDoc.validate(textDoc, schema);
            assert.strictEqual(semanticErrors.length, 1);
            assert.strictEqual(semanticErrors[0].message, 'Value is not accepted. Valid values: "x1", "x2".');
        }
    });
    test('enum value merge', function () {
        var schema = {
            type: 'object',
            properties: {
                'key': {
                    oneOf: [{
                            enum: ["a", "b"]
                        }, {
                            enum: ["c", "d"]
                        }]
                }
            }
        };
        var _a = toDocument('{"key":3 }'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
        assert.strictEqual(jsonDoc.syntaxErrors.length, 0);
        var semanticErrors = jsonDoc.validate(textDoc, schema);
        assert.strictEqual(semanticErrors.length, 1);
        assert.strictEqual(semanticErrors[0].message, 'Value is not accepted. Valid values: "a", "b", "c", "d".');
    });
    test('validate API', function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, textDoc, jsonDoc, ls, res, schema;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = toDocument('{ "pages": [  "pages/index", "pages/log", ] }'), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
                        ls = getLanguageService({});
                        return [4 /*yield*/, ls.doValidation(textDoc, jsonDoc)];
                    case 1:
                        res = _b.sent();
                        assert.strictEqual(res.length, 1);
                        assert.strictEqual(res[0].message, 'Trailing comma');
                        return [4 /*yield*/, ls.doValidation(textDoc, jsonDoc, { trailingCommas: 'error' })];
                    case 2:
                        res = _b.sent();
                        assert.strictEqual(res.length, 1);
                        assert.strictEqual(res[0].message, 'Trailing comma');
                        return [4 /*yield*/, ls.doValidation(textDoc, jsonDoc, { trailingCommas: 'ignore' })];
                    case 3:
                        res = _b.sent();
                        assert.strictEqual(res.length, 0);
                        schema = { type: 'object', required: ['foo'] };
                        return [4 /*yield*/, ls.doValidation(textDoc, jsonDoc, { trailingCommas: 'ignore' }, schema)];
                    case 4:
                        res = _b.sent();
                        assert.strictEqual(res.length, 1);
                        assert.strictEqual(res[0].message, 'Missing property "foo".');
                        return [2 /*return*/];
                }
            });
        });
    });
});
