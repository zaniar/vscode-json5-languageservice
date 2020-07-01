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
        define(["require", "exports", "../json5LanguageService", "assert"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var json5LanguageService_1 = require("../json5LanguageService");
    var assert = require("assert");
    var applyEdits = json5LanguageService_1.TextDocument.applyEdits;
    suite('JSON5 Formatter', function () {
        var ls = json5LanguageService_1.getLanguageService({ clientCapabilities: json5LanguageService_1.ClientCapabilities.LATEST });
        function format(unformatted, expected, insertSpaces) {
            if (insertSpaces === void 0) { insertSpaces = true; }
            var range = undefined;
            var uri = 'test://test.json';
            var rangeStart = unformatted.indexOf('|');
            var rangeEnd = unformatted.lastIndexOf('|');
            if (rangeStart !== -1 && rangeEnd !== -1) {
                // remove '|'
                unformatted = unformatted.substring(0, rangeStart) + unformatted.substring(rangeStart + 1, rangeEnd) + unformatted.substring(rangeEnd + 1);
                var unformattedDoc = json5LanguageService_1.TextDocument.create(uri, 'json', 0, unformatted);
                var startPos = unformattedDoc.positionAt(rangeStart);
                var endPos = unformattedDoc.positionAt(rangeEnd);
                range = json5LanguageService_1.Range.create(startPos, endPos);
            }
            var document = json5LanguageService_1.TextDocument.create(uri, 'json', 0, unformatted);
            var edits = ls.format(document, range, { tabSize: 2, insertSpaces: insertSpaces });
            var formatted = applyEdits(document, edits);
            assert.equal(formatted, expected);
        }
        test('object - single property', function () {
            var content = [
                '{"x" : 1}'
            ].join('\n');
            var expected = [
                '{',
                '  "x": 1',
                '}'
            ].join('\n');
            format(content, expected);
        });
        test('object - multiple properties', function () {
            var content = [
                '{"x" : 1,  "y" : "foo", "z"  : true}'
            ].join('\n');
            var expected = [
                '{',
                '  "x": 1,',
                '  "y": "foo",',
                '  "z": true',
                '}'
            ].join('\n');
            format(content, expected);
        });
        test('object - no properties ', function () {
            var content = [
                '{"x" : {    },  "y" : {}}'
            ].join('\n');
            var expected = [
                '{',
                '  "x": {},',
                '  "y": {}',
                '}'
            ].join('\n');
            format(content, expected);
        });
        test('object - nesting', function () {
            var content = [
                '{"x" : {  "y" : { "z"  : { }}, "a": true}}'
            ].join('\n');
            var expected = [
                '{',
                '  "x": {',
                '    "y": {',
                '      "z": {}',
                '    },',
                '    "a": true',
                '  }',
                '}'
            ].join('\n');
            format(content, expected);
        });
        test('array - single items', function () {
            var content = [
                '["[]"]'
            ].join('\n');
            var expected = [
                '[',
                '  "[]"',
                ']'
            ].join('\n');
            format(content, expected);
        });
        test('array - multiple items', function () {
            var content = [
                '[true,null,1.2]'
            ].join('\n');
            var expected = [
                '[',
                '  true,',
                '  null,',
                '  1.2',
                ']'
            ].join('\n');
            format(content, expected);
        });
        test('array - no items', function () {
            var content = [
                '[      ]'
            ].join('\n');
            var expected = [
                '[]'
            ].join('\n');
            format(content, expected);
        });
        test('array - nesting', function () {
            var content = [
                '[ [], [ [ {} ], "a" ]  ]'
            ].join('\n');
            var expected = [
                '[',
                '  [],',
                '  [',
                '    [',
                '      {}',
                '    ],',
                '    "a"',
                '  ]',
                ']',
            ].join('\n');
            format(content, expected);
        });
        test('syntax errors', function () {
            var content = [
                '[ null  1.2 "Hello" ]'
            ].join('\n');
            var expected = [
                '[',
                '  null  1.2 "Hello"',
                ']',
            ].join('\n');
            format(content, expected);
        });
        test('syntax errors 2', function () {
            var content = [
                '{"a":"b""c":"d" }'
            ].join('\n');
            var expected = [
                '{',
                '  "a": "b""c": "d"',
                '}',
            ].join('\n');
            format(content, expected);
        });
        test('empty lines', function () {
            var content = [
                '{',
                '"a": true,',
                '',
                '"b": true',
                '}',
            ].join('\n');
            var expected = [
                '{',
                '\t"a": true,',
                '\t"b": true',
                '}',
            ].join('\n');
            format(content, expected, false);
        });
        test('single line comment', function () {
            var content = [
                '[ ',
                '//comment',
                '"foo", "bar"',
                '] '
            ].join('\n');
            var expected = [
                '[',
                '  //comment',
                '  "foo",',
                '  "bar"',
                ']',
            ].join('\n');
            format(content, expected);
        });
        test('block line comment', function () {
            var content = [
                '[{',
                '        /*comment*/     ',
                '"foo" : true',
                '}] '
            ].join('\n');
            var expected = [
                '[',
                '  {',
                '    /*comment*/',
                '    "foo": true',
                '  }',
                ']',
            ].join('\n');
            format(content, expected);
        });
        test('single line comment on same line', function () {
            var content = [
                ' {  ',
                '        "a": {}// comment    ',
                ' } '
            ].join('\n');
            var expected = [
                '{',
                '  "a": {} // comment    ',
                '}',
            ].join('\n');
            format(content, expected);
        });
        test('single line comment on same line 2', function () {
            var content = [
                '{ //comment',
                '}'
            ].join('\n');
            var expected = [
                '{ //comment',
                '}'
            ].join('\n');
            format(content, expected);
        });
        test('block comment on same line', function () {
            var content = [
                '{      "a": {}, /*comment*/    ',
                '        /*comment*/ "b": {},    ',
                '        "c": {/*comment*/}    } ',
            ].join('\n');
            var expected = [
                '{',
                '  "a": {}, /*comment*/',
                '  /*comment*/ "b": {},',
                '  "c": { /*comment*/}',
                '}',
            ].join('\n');
            format(content, expected);
        });
        test('block comment on same line advanced', function () {
            var content = [
                ' {       "d": [',
                '             null',
                '        ] /*comment*/',
                '        ,"e": /*comment*/ [null] }',
            ].join('\n');
            var expected = [
                '{',
                '  "d": [',
                '    null',
                '  ] /*comment*/,',
                '  "e": /*comment*/ [',
                '    null',
                '  ]',
                '}',
            ].join('\n');
            format(content, expected);
        });
        test('multiple block comments on same line', function () {
            var content = [
                '{      "a": {} /*comment*/, /*comment*/   ',
                '        /*comment*/ "b": {}  /*comment*/  } '
            ].join('\n');
            var expected = [
                '{',
                '  "a": {} /*comment*/, /*comment*/',
                '  /*comment*/ "b": {} /*comment*/',
                '}',
            ].join('\n');
            format(content, expected);
        });
        test('multiple mixed comments on same line', function () {
            var content = [
                '[ /*comment*/  /*comment*/   // comment ',
                ']'
            ].join('\n');
            var expected = [
                '[ /*comment*/ /*comment*/ // comment ',
                ']'
            ].join('\n');
            format(content, expected);
        });
        test('range', function () {
            var content = [
                '{ "a": {},',
                '|"b": [null, null]|',
                '} '
            ].join('\n');
            var expected = [
                '{ "a": {},',
                '"b": [',
                '  null,',
                '  null',
                ']',
                '} ',
            ].join('\n');
            format(content, expected);
        });
        test('range with existing indent', function () {
            var content = [
                '{ "a": {},',
                '   |"b": [null],',
                '"c": {}',
                '}|'
            ].join('\n');
            var expected = [
                '{ "a": {},',
                '   "b": [',
                '    null',
                '  ],',
                '  "c": {}',
                '}',
            ].join('\n');
            format(content, expected);
        });
        test('range with existing indent - tabs', function () {
            var content = [
                '{ "a": {},',
                '|  "b": [null],   ',
                '"c": {}',
                '}|    '
            ].join('\n');
            var expected = [
                '{ "a": {},',
                '\t"b": [',
                '\t\tnull',
                '\t],',
                '\t"c": {}',
                '}',
            ].join('\n');
            format(content, expected, false);
        });
        test('property range - issue 14623', function () {
            var content = [
                '{ |"a" :| 1,',
                '  "b": 1',
                '}'
            ].join('\n');
            var expected = [
                '{ "a": 1,',
                '  "b": 1',
                '}'
            ].join('\n');
            format(content, expected, false);
        });
        test('block comment none-line breaking symbols', function () {
            var content = [
                '{ "a": [ 1',
                '/* comment */',
                ', 2',
                '/* comment */',
                ']',
                '/* comment */',
                ',',
                ' "b": true',
                '/* comment */',
                '}'
            ].join('\n');
            var expected = [
                '{',
                '  "a": [',
                '    1',
                '    /* comment */',
                '    ,',
                '    2',
                '    /* comment */',
                '  ]',
                '  /* comment */',
                '  ,',
                '  "b": true',
                '  /* comment */',
                '}',
            ].join('\n');
            format(content, expected);
        });
        test('line comment after none-line breaking symbols', function () {
            var content = [
                '{ "a":',
                '// comment',
                'null,',
                ' "b"',
                '// comment',
                ': null',
                '// comment',
                '}'
            ].join('\n');
            var expected = [
                '{',
                '  "a":',
                '  // comment',
                '  null,',
                '  "b"',
                '  // comment',
                '  : null',
                '  // comment',
                '}',
            ].join('\n');
            format(content, expected);
        });
        test('random content', function () {
            var content = [
                'a 1 b 1 3 true'
            ].join('\n');
            var expected = [
                'a 1 b 1 3 true',
            ].join('\n');
            format(content, expected);
        });
    });
});
