/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISchemaContributions } from './json5SchemaService';

import * as nls from 'vscode-nls';
const localize = nls.loadMessageBundle();

export const schemaContributions: ISchemaContributions = {
	schemaAssociations: [],
	schemas: {
		// refer to the latest schema
		'http://json-schema.org/schema#': {
			$ref: 'http://json-schema.org/draft-07/schema#'
		},
		// bundle the schema-schema to include (localized) descriptions
		'http://json-schema.org/draft-04/schema#': {
			'title': localize('schema.json', 'Describes a JSON5 file using a schema. See json-schema.org for more info.'),
			'$schema': 'http://json-schema.org/draft-04/schema#',
			'definitions': {
				'schemaArray': {
					'type': 'array',
					'minItems': 1,
					'items': {
						'$ref': '#'
					}
				},
				'positiveInteger': {
					'type': 'integer',
					'minimum': 0
				},
				'positiveIntegerDefault0': {
					'allOf': [
						{
							'$ref': '#/definitions/positiveInteger'
						},
						{
							'default': 0
						}
					]
				},
				'simpleTypes': {
					'type': 'string',
					'enum': [
						'array',
						'boolean',
						'integer',
						'null',
						'number',
						'object',
						'string'
					]
				},
				'stringArray': {
					'type': 'array',
					'items': {
						'type': 'string'
					},
					'minItems': 1,
					'uniqueItems': true
				}
			},
			'type': 'object',
			'properties': {
				'id': {
					'type': 'string',
					'format': 'uri'
				},
				'$schema': {
					'type': 'string',
					'format': 'uri'
				},
				'title': {
					'type': 'string'
				},
				'description': {
					'type': 'string'
				},
				'default': {},
				'multipleOf': {
					'type': 'number',
					'minimum': 0,
					'exclusiveMinimum': true
				},
				'maximum': {
					'type': 'number'
				},
				'exclusiveMaximum': {
					'type': 'boolean',
					'default': false
				},
				'minimum': {
					'type': 'number'
				},
				'exclusiveMinimum': {
					'type': 'boolean',
					'default': false
				},
				'maxLength': {
					'allOf': [
						{
							'$ref': '#/definitions/positiveInteger'
						}
					]
				},
				'minLength': {
					'allOf': [
						{
							'$ref': '#/definitions/positiveIntegerDefault0'
						}
					]
				},
				'pattern': {
					'type': 'string',
					'format': 'regex'
				},
				'additionalItems': {
					'anyOf': [
						{
							'type': 'boolean'
						},
						{
							'$ref': '#'
						}
					],
					'default': {}
				},
				'items': {
					'anyOf': [
						{
							'$ref': '#'
						},
						{
							'$ref': '#/definitions/schemaArray'
						}
					],
					'default': {}
				},
				'maxItems': {
					'allOf': [
						{
							'$ref': '#/definitions/positiveInteger'
						}
					]
				},
				'minItems': {
					'allOf': [
						{
							'$ref': '#/definitions/positiveIntegerDefault0'
						}
					]
				},
				'uniqueItems': {
					'type': 'boolean',
					'default': false
				},
				'maxProperties': {
					'allOf': [
						{
							'$ref': '#/definitions/positiveInteger'
						}
					]
				},
				'minProperties': {
					'allOf': [
						{
							'$ref': '#/definitions/positiveIntegerDefault0'
						}
					]
				},
				'required': {
					'allOf': [
						{
							'$ref': '#/definitions/stringArray'
						}
					]
				},
				'additionalProperties': {
					'anyOf': [
						{
							'type': 'boolean'
						},
						{
							'$ref': '#'
						}
					],
					'default': {}
				},
				'definitions': {
					'type': 'object',
					'additionalProperties': {
						'$ref': '#'
					},
					'default': {}
				},
				'properties': {
					'type': 'object',
					'additionalProperties': {
						'$ref': '#'
					},
					'default': {}
				},
				'patternProperties': {
					'type': 'object',
					'additionalProperties': {
						'$ref': '#'
					},
					'default': {}
				},
				'dependencies': {
					'type': 'object',
					'additionalProperties': {
						'anyOf': [
							{
								'$ref': '#'
							},
							{
								'$ref': '#/definitions/stringArray'
							}
						]
					}
				},
				'enum': {
					'type': 'array',
					'minItems': 1,
					'uniqueItems': true
				},
				'type': {
					'anyOf': [
						{
							'$ref': '#/definitions/simpleTypes'
						},
						{
							'type': 'array',
							'items': {
								'$ref': '#/definitions/simpleTypes'
							},
							'minItems': 1,
							'uniqueItems': true
						}
					]
				},
				'format': {
					'anyOf': [
						{
							'type': 'string',
							'enum': [
								'date-time',
								'uri',
								'email',
								'hostname',
								'ipv4',
								'ipv6',
								'regex'
							]
						},
						{
							'type': 'string'
						}
					]
				},
				'allOf': {
					'allOf': [
						{
							'$ref': '#/definitions/schemaArray'
						}
					]
				},
				'anyOf': {
					'allOf': [
						{
							'$ref': '#/definitions/schemaArray'
						}
					]
				},
				'oneOf': {
					'allOf': [
						{
							'$ref': '#/definitions/schemaArray'
						}
					]
				},
				'not': {
					'allOf': [
						{
							'$ref': '#'
						}
					]
				}
			},
			'dependencies': {
				'exclusiveMaximum': [
					'maximum'
				],
				'exclusiveMinimum': [
					'minimum'
				]
			},
			'default': {}
		},
		'http://json-schema.org/draft-07/schema#': {
			'title': localize('schema.json', 'Describes a JSON5 file using a schema. See json-schema.org for more info.'),
			'definitions': {
				'schemaArray': {
					'type': 'array',
					'minItems': 1,
					'items': { '$ref': '#' }
				},
				'nonNegativeInteger': {
					'type': 'integer',
					'minimum': 0
				},
				'nonNegativeIntegerDefault0': {
					'allOf': [
						{ '$ref': '#/definitions/nonNegativeInteger' },
						{ 'default': 0 }
					]
				},
				'simpleTypes': {
					'enum': [
						'array',
						'boolean',
						'integer',
						'null',
						'number',
						'object',
						'string'
					]
				},
				'stringArray': {
					'type': 'array',
					'items': { 'type': 'string' },
					'uniqueItems': true,
					'default': []
				}
			},
			'type': ['object', 'boolean'],
			'properties': {
				'$id': {
					'type': 'string',
					'format': 'uri-reference'
				},
				'$schema': {
					'type': 'string',
					'format': 'uri'
				},
				'$ref': {
					'type': 'string',
					'format': 'uri-reference'
				},
				'$comment': {
					'type': 'string'
				},
				'title': {
					'type': 'string'
				},
				'description': {
					'type': 'string'
				},
				'default': true,
				'readOnly': {
					'type': 'boolean',
					'default': false
				},
				'examples': {
					'type': 'array',
					'items': true
				},
				'multipleOf': {
					'type': 'number',
					'exclusiveMinimum': 0
				},
				'maximum': {
					'type': 'number'
				},
				'exclusiveMaximum': {
					'type': 'number'
				},
				'minimum': {
					'type': 'number'
				},
				'exclusiveMinimum': {
					'type': 'number'
				},
				'maxLength': { '$ref': '#/definitions/nonNegativeInteger' },
				'minLength': { '$ref': '#/definitions/nonNegativeIntegerDefault0' },
				'pattern': {
					'type': 'string',
					'format': 'regex'
				},
				'additionalItems': { '$ref': '#' },
				'items': {
					'anyOf': [
						{ '$ref': '#' },
						{ '$ref': '#/definitions/schemaArray' }
					],
					'default': true
				},
				'maxItems': { '$ref': '#/definitions/nonNegativeInteger' },
				'minItems': { '$ref': '#/definitions/nonNegativeIntegerDefault0' },
				'uniqueItems': {
					'type': 'boolean',
					'default': false
				},
				'contains': { '$ref': '#' },
				'maxProperties': { '$ref': '#/definitions/nonNegativeInteger' },
				'minProperties': { '$ref': '#/definitions/nonNegativeIntegerDefault0' },
				'required': { '$ref': '#/definitions/stringArray' },
				'additionalProperties': { '$ref': '#' },
				'definitions': {
					'type': 'object',
					'additionalProperties': { '$ref': '#' },
					'default': {}
				},
				'properties': {
					'type': 'object',
					'additionalProperties': { '$ref': '#' },
					'default': {}
				},
				'patternProperties': {
					'type': 'object',
					'additionalProperties': { '$ref': '#' },
					'propertyNames': { 'format': 'regex' },
					'default': {}
				},
				'dependencies': {
					'type': 'object',
					'additionalProperties': {
						'anyOf': [
							{ '$ref': '#' },
							{ '$ref': '#/definitions/stringArray' }
						]
					}
				},
				'propertyNames': { '$ref': '#' },
				'const': true,
				'enum': {
					'type': 'array',
					'items': true,
					'minItems': 1,
					'uniqueItems': true
				},
				'type': {
					'anyOf': [
						{ '$ref': '#/definitions/simpleTypes' },
						{
							'type': 'array',
							'items': { '$ref': '#/definitions/simpleTypes' },
							'minItems': 1,
							'uniqueItems': true
						}
					]
				},
				'format': { 'type': 'string' },
				'contentMediaType': { 'type': 'string' },
				'contentEncoding': { 'type': 'string' },
				'if': { '$ref': '#' },
				'then': { '$ref': '#' },
				'else': { '$ref': '#' },
				'allOf': { '$ref': '#/definitions/schemaArray' },
				'anyOf': { '$ref': '#/definitions/schemaArray' },
				'oneOf': { '$ref': '#/definitions/schemaArray' },
				'not': { '$ref': '#' }
			},
			'default': true
		}
	}
};
const descriptions: { [prop: string]: string } = {
	id: localize('schema.json5.id', "A unique identifier for the schema."),
	$schema: localize('schema.json5.$schema', "The schema to verify this document against."),
	title: localize('schema.json5.title', "A descriptive title of the element."),
	description: localize('schema.json5.description', "A long description of the element. Used in hover menus and suggestions."),
	default: localize('schema.json5.default', "A default value. Used by suggestions."),
	multipleOf: localize('schema.json5.multipleOf', "A number that should cleanly divide the current value (i.e. have no remainder)."),
	maximum: localize('schema.json5.maximum', "The maximum numerical value, inclusive by default."),
	exclusiveMaximum: localize('schema.json5.exclusiveMaximum', "Makes the maximum property exclusive."),
	minimum: localize('schema.json5.minimum', "The minimum numerical value, inclusive by default."),
	exclusiveMinimum: localize('schema.json5.exclusiveMininum', "Makes the minimum property exclusive."),
	maxLength: localize('schema.json5.maxLength', "The maximum length of a string."),
	minLength: localize('schema.json5.minLength', "The minimum length of a string."),
	pattern: localize('schema.json5.pattern', "A regular expression to match the string against. It is not implicitly anchored."),
	additionalItems: localize('schema.json5.additionalItems', "For arrays, only when items is set as an array. If it is a schema, then this schema validates items after the ones specified by the items array. If it is false, then additional items will cause validation to fail."),
	items: localize('schema.json5.items', "For arrays. Can either be a schema to validate every element against or an array of schemas to validate each item against in order (the first schema will validate the first element, the second schema will validate the second element, and so on."),
	maxItems: localize('schema.json5.maxItems', "The maximum number of items that can be inside an array. Inclusive."),
	minItems: localize('schema.json5.minItems', "The minimum number of items that can be inside an array. Inclusive."),
	uniqueItems: localize('schema.json5.uniqueItems', "If all of the items in the array must be unique. Defaults to false."),
	maxProperties: localize('schema.json5.maxProperties', "The maximum number of properties an object can have. Inclusive."),
	minProperties: localize('schema.json5.minProperties', "The minimum number of properties an object can have. Inclusive."),
	required: localize('schema.json5.required', "An array of strings that lists the names of all properties required on this object."),
	additionalProperties: localize('schema.json5.additionalProperties', "Either a schema or a boolean. If a schema, then used to validate all properties not matched by 'properties' or 'patternProperties'. If false, then any properties not matched by either will cause this schema to fail."),
	definitions: localize('schema.json5.definitions', "Not used for validation. Place subschemas here that you wish to reference inline with $ref."),
	properties: localize('schema.json5.properties', "A map of property names to schemas for each property."),
	patternProperties: localize('schema.json5.patternProperties', "A map of regular expressions on property names to schemas for matching properties."),
	dependencies: localize('schema.json5.dependencies', "A map of property names to either an array of property names or a schema. An array of property names means the property named in the key depends on the properties in the array being present in the object in order to be valid. If the value is a schema, then the schema is only applied to the object if the property in the key exists on the object."),
	enum: localize('schema.json5.enum', "The set of literal values that are valid."),
	type: localize('schema.json5.type', "Either a string of one of the basic schema types (number, integer, null, array, object, boolean, string) or an array of strings specifying a subset of those types."),
	format: localize('schema.json5.format', "Describes the format expected for the value."),
	allOf: localize('schema.json5.allOf', "An array of schemas, all of which must match."),
	anyOf: localize('schema.json5.anyOf', "An array of schemas, where at least one must match."),
	oneOf: localize('schema.json5.oneOf', "An array of schemas, exactly one of which must match."),
	not: localize('schema.json5.not', "A schema which must not match."),
	$id: localize('schema.json5.$id', "A unique identifier for the schema."),
	$ref: localize('schema.json5.$ref', "Reference a definition hosted on any location."),
	$comment: localize('schema.json5.$comment', "Comments from schema authors to readers or maintainers of the schema."),
	readOnly: localize('schema.json5.readOnly', "Indicates that the value of the instance is managed exclusively by the owning authority."),
	examples: localize('schema.json5.examples', "Sample JSON5 values associated with a particular schema, for the purpose of illustrating usage."),
	contains: localize('schema.json5.contains', "An array instance is valid against \"contains\" if at least one of its elements is valid against the given schema."),
	propertyNames: localize('schema.json5.propertyNames', "If the instance is an object, this keyword validates if every property name in the instance validates against the provided schema."),
	const: localize('schema.json5.const', "An instance validates successfully against this keyword if its value is equal to the value of the keyword."),
	contentMediaType: localize('schema.json5.contentMediaType', "Describes the media type of a string property."),
	contentEncoding: localize('schema.json5.contentEncoding', "Describes the content encoding of a string property."),
	if: localize('schema.json5.if', "The validation outcome of the \"if\" subschema controls which of the \"then\" or \"else\" keywords are evaluated."),
	then: localize('schema.json5.then', "The \"if\" subschema is used for validation when the \"if\" subschema succeeds."),
	else: localize('schema.json5.else', "The \"else\" subschema is used for validation when the \"if\" subschema fails.")
};

for (const schemaName in schemaContributions.schemas) {
	const schema = schemaContributions.schemas[schemaName];
	for (const property in schema.properties) {
		let propertyObject = schema.properties[property];
		if (typeof propertyObject === 'boolean') {
			propertyObject = schema.properties[property] = {};
		}
		const description = descriptions[property];
		if (description) {
			propertyObject['description'] = description;
		} else {
			console.log(`${property}: localize('schema.json5.${property}', "")`);
		}
	}
}