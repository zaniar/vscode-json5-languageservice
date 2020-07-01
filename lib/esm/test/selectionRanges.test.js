/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import 'mocha';
import * as assert from 'assert';
import { getLanguageService, TextDocument } from '../json5LanguageService';
function assertRanges(content, expected) {
    var message = "Test " + content;
    var offset = content.indexOf('|');
    content = content.substr(0, offset) + content.substr(offset + 1);
    var ls = getLanguageService({});
    var document = TextDocument.create('test://foo.json', 'json', 1, content);
    var jsonDoc = ls.parseJSON5Document(document);
    var actualRanges = ls.getSelectionRanges(document, [document.positionAt(offset)], jsonDoc);
    var offsetPairs = [];
    var curr = actualRanges[0];
    while (curr) {
        offsetPairs.push([document.offsetAt(curr.range.start), document.getText(curr.range)]);
        curr = curr.parent;
    }
    message += "\n" + JSON.stringify(offsetPairs) + " should equal to " + JSON.stringify(expected);
    assert.deepEqual(offsetPairs, expected, message);
}
suite('JSON5 SelectionRange', function () {
    test('Strings', function () {
        assertRanges('"ab|cd"', [
            [1, 'abcd'],
            [0, '"abcd"']
        ]);
        assertRanges('"|abcd"', [
            [1, 'abcd'],
            [0, '"abcd"']
        ]);
        assertRanges('"abcd|"', [
            [1, 'abcd'],
            [0, '"abcd"']
        ]);
        assertRanges('|"abcd"', [
            [0, '"abcd"']
        ]);
        assertRanges('"abcd"|', [
            [0, '"abcd"']
        ]);
    });
    test('Bools, Numbers and Nulls', function () {
        assertRanges('|true', [
            [0, 'true']
        ]);
        assertRanges('false|', [
            [0, 'false']
        ]);
        assertRanges('fal|se', [
            [0, 'false']
        ]);
        assertRanges('|1', [
            [0, '1']
        ]);
        assertRanges('5677|', [
            [0, '5677']
        ]);
        assertRanges('567.|7', [
            [0, '567.7']
        ]);
        assertRanges('|null', [
            [0, 'null']
        ]);
        assertRanges('null|', [
            [0, 'null']
        ]);
        assertRanges('nu|ll', [
            [0, 'null']
        ]);
    });
    test('Properties', function () {
        assertRanges('{ "f|oo": true, "bar": "bit" }', [
            [3, 'foo'],
            [2, '"foo"'],
            [2, '"foo": true'],
            [2, '"foo": true,'],
            [1, ' "foo": true, "bar": "bit" '],
            [0, '{ "foo": true, "bar": "bit" }'],
        ]);
        assertRanges('{ "foo"|: true, "bar": "bit" }', [
            [2, '"foo"'],
            [2, '"foo": true'],
            [2, '"foo": true,'],
            [1, ' "foo": true, "bar": "bit" '],
            [0, '{ "foo": true, "bar": "bit" }'],
        ]);
        assertRanges('{ "foo":| true, "bar": "bit" }', [
            [2, '"foo": true'],
            [2, '"foo": true,'],
            [1, ' "foo": true, "bar": "bit" '],
            [0, '{ "foo": true, "bar": "bit" }'],
        ]);
        assertRanges('{ "foo": |true, "bar": "bit" }', [
            [9, 'true'],
            [2, '"foo": true'],
            [2, '"foo": true,'],
            [1, ' "foo": true, "bar": "bit" '],
            [0, '{ "foo": true, "bar": "bit" }'],
        ]);
        assertRanges('{ "foo": true|, "bar": "bit" }', [
            [9, 'true'],
            [2, '"foo": true'],
            [2, '"foo": true,'],
            [1, ' "foo": true, "bar": "bit" '],
            [0, '{ "foo": true, "bar": "bit" }'],
        ]);
        assertRanges('{ "foo": true,| "bar": "bit" }', [
            [1, ' "foo": true, "bar": "bit" '],
            [0, '{ "foo": true, "bar": "bit" }'],
        ]);
        assertRanges('{ "foo": true, |"bar": "bit" }', [
            [15, '"bar"'],
            [15, '"bar": "bit"'],
            [1, ' "foo": true, "bar": "bit" '],
            [0, '{ "foo": true, "bar": "bit" }'],
        ]);
        assertRanges('{ "foo": true, "bar": "bit"| }', [
            [22, '"bit"'],
            [15, '"bar": "bit"'],
            [1, ' "foo": true, "bar": "bit" '],
            [0, '{ "foo": true, "bar": "bit" }'],
        ]);
        assertRanges('{ "line1": "Foo|Bar" }', [
            [12, 'FooBar'],
            [11, '"FooBar"'],
            [2, '"line1": "FooBar"'],
            [1, ' "line1": "FooBar" '],
            [0, '{ "line1": "FooBar" }'],
        ]);
    });
    test('Objects', function () {
        assertRanges('|{}', [
            [0, '{}']
        ]);
        assertRanges('{|}', [
            [0, '{}']
        ]);
        assertRanges('{|  }', [
            [1, '  '],
            [0, '{  }']
        ]);
    });
    test('Array', function () {
        assertRanges('|[[ ], []]', [
            [0, '[[ ], []]']
        ]);
        assertRanges('[|[ ], []]', [
            [1, '[ ]'],
            [1, '[ ],'],
            [1, '[ ], []'],
            [0, '[[ ], []]']
        ]);
        assertRanges('[[| ], []]', [
            [2, ' '],
            [1, '[ ]'],
            [1, '[ ],'],
            [1, '[ ], []'],
            [0, '[[ ], []]']
        ]);
    });
});
