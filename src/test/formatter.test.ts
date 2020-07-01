/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getLanguageService, ClientCapabilities, Range, TextDocument } from '../json5LanguageService';
import * as assert from 'assert';

const applyEdits = TextDocument.applyEdits;

suite('JSON5 Formatter', () => {

	const ls = getLanguageService({ clientCapabilities: ClientCapabilities.LATEST });

	function format(unformatted: string, expected: string, insertSpaces = true) {
		let range: Range | undefined = undefined;
		const uri = 'test://test.json';

		const rangeStart = unformatted.indexOf('|');
		const rangeEnd = unformatted.lastIndexOf('|');
		if (rangeStart !== -1 && rangeEnd !== -1) {
			// remove '|'
			unformatted = unformatted.substring(0, rangeStart) + unformatted.substring(rangeStart + 1, rangeEnd) + unformatted.substring(rangeEnd + 1);
			var unformattedDoc = TextDocument.create(uri, 'json', 0, unformatted);
			const startPos = unformattedDoc.positionAt(rangeStart);
			const endPos = unformattedDoc.positionAt(rangeEnd);
			range = Range.create(startPos, endPos);
		}

		var document = TextDocument.create(uri, 'json', 0, unformatted);
		const edits = ls.format(document, range!, { tabSize: 2, insertSpaces: insertSpaces });
		const formatted = applyEdits(document, edits);
		assert.equal(formatted, expected);
	}

	test('object - single property', () => {
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
	test('object - multiple properties', () => {
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
	test('object - no properties ', () => {
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
	test('object - nesting', () => {
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

	test('array - single items', () => {
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

	test('array - multiple items', () => {
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

	test('array - no items', () => {
		var content = [
			'[      ]'
		].join('\n');

		var expected = [
			'[]'
		].join('\n');

		format(content, expected);
	});

	test('array - nesting', () => {
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

	test('syntax errors', () => {
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

	test('syntax errors 2', () => {
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

	test('empty lines', () => {
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
	test('single line comment', () => {
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
	test('block line comment', () => {
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
	test('single line comment on same line', () => {
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
	test('single line comment on same line 2', () => {
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
	test('block comment on same line', () => {
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

	test('block comment on same line advanced', () => {
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

	test('multiple block comments on same line', () => {
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

	test('multiple mixed comments on same line', () => {
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

	test('range', () => {
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

	test('range with existing indent', () => {
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


	test('range with existing indent - tabs', () => {
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

	test('property range - issue 14623', () => {
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
	test('block comment none-line breaking symbols', () => {
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
	test('line comment after none-line breaking symbols', () => {
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
	test('random content', () => {
		var content = [
			'a 1 b 1 3 true'
		].join('\n');

		var expected = [
			'a 1 b 1 3 true',
		].join('\n');

		format(content, expected);
	});
});