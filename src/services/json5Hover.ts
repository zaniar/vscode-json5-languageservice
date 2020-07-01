/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Parser from '../parser/json5Parser';
import * as SchemaService from './json5SchemaService';
import { JSON5WorkerContribution } from '../json5Contributions';
import { TextDocument, PromiseConstructor, Thenable, Position, Range, Hover, MarkedString } from '../json5LanguageTypes';

export class JSON5Hover {

	private schemaService: SchemaService.IJSON5SchemaService;
	private contributions: JSON5WorkerContribution[];
	private promise: PromiseConstructor;

	constructor(schemaService: SchemaService.IJSON5SchemaService, contributions: JSON5WorkerContribution[] = [], promiseConstructor: PromiseConstructor) {
		this.schemaService = schemaService;
		this.contributions = contributions;
		this.promise = promiseConstructor || Promise;
	}

	public doHover(document: TextDocument, position: Position, doc: Parser.JSON5Document): Thenable<Hover | null> {

		const offset = document.offsetAt(position);
		let node = doc.getNodeFromOffset(offset);
		if (!node || (node.type === 'object' || node.type === 'array') && offset > node.offset + 1 && offset < node.offset + node.length - 1) {
			return this.promise.resolve(null);
		}
		const hoverRangeNode = node;

		// use the property description when hovering over an object key
		if (node.type === 'string') {
			const parent = node.parent;
			if (parent && parent.type === 'property' && parent.keyNode === node) {
				node = parent.valueNode;
				if (!node) {
					return this.promise.resolve(null);
				}
			}
		}

		const hoverRange = Range.create(document.positionAt(hoverRangeNode.offset), document.positionAt(hoverRangeNode.offset + hoverRangeNode.length));

		var createHover = (contents: MarkedString[]) => {
			const result: Hover = {
				contents: contents,
				range: hoverRange
			};
			return result;
		};

		const location = Parser.getNodePath(node);
		for (let i = this.contributions.length - 1; i >= 0; i--) {
			const contribution = this.contributions[i];
			const promise = contribution.getInfoContribution(document.uri, location);
			if (promise) {
				return promise.then(htmlContent => createHover(htmlContent));
			}
		}

		return this.schemaService.getSchemaForResource(document.uri, doc).then((schema) => {
			if (schema && node) {
				const matchingSchemas = doc.getMatchingSchemas(schema.schema, node.offset);

				let title: string | undefined = undefined;
				let markdownDescription: string | undefined = undefined;
				let markdownEnumValueDescription: string | undefined = undefined, enumValue: string | undefined = undefined;
				matchingSchemas.every((s) => {
					if (s.node === node && !s.inverted && s.schema) {
						title = title || s.schema.title;
						markdownDescription = markdownDescription || s.schema.markdownDescription || toMarkdown(s.schema.description);
						if (s.schema.enum) {
							const idx = s.schema.enum.indexOf(Parser.getNodeValue(node));
							if (s.schema.markdownEnumDescriptions) {
								markdownEnumValueDescription = s.schema.markdownEnumDescriptions[idx];
							} else if (s.schema.enumDescriptions) {
								markdownEnumValueDescription = toMarkdown(s.schema.enumDescriptions[idx]);
							}
							if (markdownEnumValueDescription) {
								enumValue = s.schema.enum[idx];
								if (typeof enumValue !== 'string') {
									enumValue = JSON.stringify(enumValue);
								}
							}
						}
					}
					return true;
				});
				let result = '';
				if (title) {
					result = toMarkdown(title);
				}
				if (markdownDescription) {
					if (result.length > 0) {
						result += "\n\n";
					}
					result += markdownDescription;
				}
				if (markdownEnumValueDescription) {
					if (result.length > 0) {
						result += "\n\n";
					}
					result += `\`${toMarkdownCodeBlock(enumValue!)}\`: ${markdownEnumValueDescription}`;
				}
				return createHover([result]);
			}
			return null;
		});
	}
}
function toMarkdown(plain: string): string;
function toMarkdown(plain: string | undefined): string | undefined;
function toMarkdown(plain: string | undefined): string | undefined {
	if (plain) {
		const res = plain.replace(/([^\n\r])(\r?\n)([^\n\r])/gm, '$1\n\n$3'); // single new lines to \n\n (Markdown paragraph)
		return res.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&"); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
	}
	return undefined;
}

function toMarkdownCodeBlock(content: string) {
	// see https://daringfireball.net/projects/markdown/syntax#precode
	if (content.indexOf('`') !== -1) {
		return '`` ' + content + ' ``';
	}
	return content;
}