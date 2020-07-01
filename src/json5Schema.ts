/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export type JSON5SchemaRef = JSON5Schema | boolean;

export interface JSON5Schema {
	id?: string;
	$id?: string;
	$schema?: string;
	type?: string | string[];
	title?: string;
	default?: any;
	definitions?: { [name: string]: JSON5Schema };
	description?: string;
	properties?: JSON5SchemaMap;
	patternProperties?: JSON5SchemaMap;
	additionalProperties?: boolean | JSON5SchemaRef;
	minProperties?: number;
	maxProperties?: number;
	dependencies?: JSON5SchemaMap | { [prop: string]: string[] };
	items?: JSON5SchemaRef | JSON5SchemaRef[];
	minItems?: number;
	maxItems?: number;
	uniqueItems?: boolean;
	additionalItems?: boolean | JSON5SchemaRef;
	pattern?: string;
	minLength?: number;
	maxLength?: number;
	minimum?: number;
	maximum?: number;
	exclusiveMinimum?: boolean | number;
	exclusiveMaximum?: boolean | number;
	multipleOf?: number;
	required?: string[];
	$ref?: string;
	anyOf?: JSON5SchemaRef[];
	allOf?: JSON5SchemaRef[];
	oneOf?: JSON5SchemaRef[];
	not?: JSON5SchemaRef;
	enum?: any[];
	format?: string;

	// schema draft 06
	const?: any;
	contains?: JSON5SchemaRef;
	propertyNames?: JSON5SchemaRef;
	examples?: any[];

	// schema draft 07
	$comment?: string;
	if?: JSON5SchemaRef;
	then?: JSON5SchemaRef;
	else?: JSON5SchemaRef;

	// VSCode extensions

	defaultSnippets?: { label?: string; description?: string; markdownDescription?: string; body?: any; bodyText?: string; }[]; // VSCode extension: body: a object that will be converted to a JSON string. bodyText: text with \t and \n
	errorMessage?: string; // VSCode extension
	patternErrorMessage?: string; // VSCode extension
	deprecationMessage?: string; // VSCode extension
	enumDescriptions?: string[]; // VSCode extension
	markdownEnumDescriptions?: string[]; // VSCode extension
	markdownDescription?: string; // VSCode extension
	doNotSuggest?: boolean; // VSCode extension
	suggestSortText?: string;  // VSCode extension
	allowComments?: boolean; // VSCode extension
	allowTrailingCommas?: boolean; // VSCode extension
}

export interface JSON5SchemaMap {
	[name: string]: JSON5SchemaRef;
}
