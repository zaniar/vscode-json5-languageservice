/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import * as Parser from '../parser/json5Parser';
import * as SchemaService from '../services/json5SchemaService';
import * as JsonSchema from '../json5Schema';
import { JSON5Hover } from '../services/json5Hover';

import { Hover, Position, MarkedString, TextDocument } from '../json5LanguageService';

suite('JSON5 Hover', () => {

	function testComputeInfo(value: string, schema: JsonSchema.JSON5Schema, position: Position): PromiseLike<Hover> {
		const uri = 'test://test.json';

		const schemaService = new SchemaService.JSON5SchemaService(requestService);
		const hoverProvider = new JSON5Hover(schemaService, [], Promise);
		const id = "http://myschemastore/test1";
		schemaService.registerExternalSchema(id, ["*.json"], schema);

		const document = TextDocument.create(uri, 'json', 0, value);
		const jsonDoc = Parser.parse(document);
		return hoverProvider.doHover(document, position, jsonDoc);
	}

	let requestService = function (uri: string): Promise<string> {
		return Promise.reject<string>('Resource not found');
	};

	test('Simple schema', async function () {

		const content = '{"a": 42, "b": "hello", "c": false}';
		const schema: JsonSchema.JSON5Schema = {
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
		await testComputeInfo(content, schema, { line: 0, character: 0 }).then((result) => {
			assert.deepEqual(result.contents, [MarkedString.fromPlainText('a very special object')]);
		});
		await testComputeInfo(content, schema, { line: 0, character: 1 }).then((result) => {
			assert.deepEqual(result.contents, [MarkedString.fromPlainText('A')]);
		});
		await testComputeInfo(content, schema, { line: 0, character: 32 }).then((result) => {
			assert.deepEqual(result.contents, [MarkedString.fromPlainText('C')]);
		});
		await testComputeInfo(content, schema, { line: 0, character: 7 }).then((result) => {
			assert.deepEqual(result.contents, [MarkedString.fromPlainText('A')]);
		});
	});

	test('Nested schema', async function () {

		const content = '{"a": 42, "b": "hello"}';
		const schema: JsonSchema.JSON5Schema = {
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
		await testComputeInfo(content, schema, { line: 0, character: 0 }).then((result) => {
			assert.deepEqual(result.contents, [MarkedString.fromPlainText('a very special object')]);
		});
		await testComputeInfo(content, schema, { line: 0, character: 1 }).then((result) => {
			assert.deepEqual(result.contents, [MarkedString.fromPlainText('A')]);
		});
		await testComputeInfo(content, schema, { line: 0, character: 10 }).then((result) => {
			assert.deepEqual(result.contents, [MarkedString.fromPlainText('B\n\nIt\'s B')]);
		});
	});

	test('Enum description', async function () {
		const schema: JsonSchema.JSON5Schema = {
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

		await testComputeInfo('{ "prop1": "e1', schema, { line: 0, character: 12 }).then(result => {
			assert.deepEqual(result.contents, ['prop1\n\n`e1`: E1']);
		});
		await testComputeInfo('{ "prop2": null', schema, { line: 0, character: 12 }).then(result => {
			assert.deepEqual(result.contents, ['prop2\n\n`null`: null']);
		});
		await testComputeInfo('{ "prop2": 1', schema, { line: 0, character: 11 }).then(result => {
			assert.deepEqual(result.contents, ['prop2\n\n`1`: one']);
		});
		await testComputeInfo('{ "prop2": false', schema, { line: 0, character: 12 }).then(result => {
			assert.deepEqual(result.contents, ['prop2\n\n`false`: wrong']);
		});
		await testComputeInfo('{ "prop3": null', schema, { line: 0, character: 12 }).then(result => {
			assert.deepEqual(result.contents, ['title\n\n*prop3*\n\n`null`: Set to `null`']);
		});
	});

	test('Multiline descriptions', async function () {
		const schema: JsonSchema.JSON5Schema = {
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

		await testComputeInfo('{ "prop1": "e1', schema, { line: 0, character: 12 }).then(result => {
			assert.deepEqual(result.contents, ['line1\n\nline2\n\nline3\n\n\nline4\n']);
		});
		await testComputeInfo('{ "prop2": "e1', schema, { line: 0, character: 12 }).then(result => {
			assert.deepEqual(result.contents, ['line1\n\nline2\r\n\r\nline3']);
		});
	});
});