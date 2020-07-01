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
import * as SchemaService from '../services/json5SchemaService';
import * as Parser from '../parser/json5Parser';
import * as fs from 'fs';
import * as url from 'url';
import * as path from 'path';
import { getLanguageService, TextDocument } from '../json5LanguageService';
function toDocument(text, config) {
    var textDoc = TextDocument.create('foo://bar/file.json', 'json', 0, text);
    var jsonDoc = Parser.parse(textDoc, config);
    return { textDoc: textDoc, jsonDoc: jsonDoc };
}
suite('JSON5 Schema', function () {
    var fixureDocuments = {
        'http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json': 'deploymentTemplate.json',
        'http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json': 'deploymentParameters.json',
        'http://schema.management.azure.com/schemas/2015-01-01/Microsoft.Authorization.json': 'Microsoft.Authorization.json',
        'http://schema.management.azure.com/schemas/2015-01-01/Microsoft.Resources.json': 'Microsoft.Resources.json',
        'http://schema.management.azure.com/schemas/2014-04-01-preview/Microsoft.Sql.json': 'Microsoft.Sql.json',
        'http://schema.management.azure.com/schemas/2014-06-01/Microsoft.Web.json': 'Microsoft.Web.json',
        'http://schema.management.azure.com/schemas/2014-04-01/SuccessBricks.ClearDB.json': 'SuccessBricks.ClearDB.json',
        'http://schema.management.azure.com/schemas/2015-08-01/Microsoft.Compute.json': 'Microsoft.Compute.json'
    };
    function newMockRequestService(schemas, accesses) {
        if (schemas === void 0) { schemas = {}; }
        if (accesses === void 0) { accesses = []; }
        return function (uri) {
            if (uri.length && uri[uri.length - 1] === '#') {
                uri = uri.substr(0, uri.length - 1);
            }
            var schema = schemas[uri];
            if (schema) {
                if (accesses.indexOf(uri) === -1) {
                    accesses.push(uri);
                }
                return Promise.resolve(JSON.stringify(schema));
            }
            var fileName = fixureDocuments[uri];
            if (fileName) {
                return new Promise(function (c, e) {
                    var fixturePath = path.join(__dirname, '../../../src/test/fixtures', fileName);
                    fs.readFile(fixturePath, 'UTF-8', function (err, result) {
                        err ? e("Resource not found") : c(result.toString());
                    });
                });
            }
            return Promise.reject("Resource not found");
        };
    }
    var workspaceContext = {
        resolveRelativePath: function (relativePath, resource) {
            return url.resolve(resource, relativePath);
        }
    };
    test('Resolving $refs', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                service.setSchemaContributions({
                    schemas: {
                        "https://myschemastore/main": {
                            id: 'https://myschemastore/main',
                            type: 'object',
                            properties: {
                                child: {
                                    '$ref': 'https://myschemastore/child'
                                }
                            }
                        },
                        "https://myschemastore/child": {
                            id: 'https://myschemastore/child',
                            type: 'bool',
                            description: 'Test description'
                        }
                    }
                });
                return [2 /*return*/, service.getResolvedSchema('https://myschemastore/main').then(function (fs) {
                        var _a;
                        assert.deepEqual((_a = fs === null || fs === void 0 ? void 0 : fs.schema.properties) === null || _a === void 0 ? void 0 : _a['child'], {
                            id: 'https://myschemastore/child',
                            type: 'bool',
                            description: 'Test description'
                        });
                    })];
            });
        });
    });
    test('Resolving $refs 2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                service.setSchemaContributions({
                    schemas: {
                        "http://json.schemastore.org/swagger-2.0": {
                            id: 'http://json.schemastore.org/swagger-2.0',
                            type: 'object',
                            properties: {
                                "responseValue": {
                                    "$ref": "#/definitions/jsonReference"
                                }
                            },
                            definitions: {
                                "jsonReference": {
                                    "type": "object",
                                    "required": ["$ref"],
                                    "properties": {
                                        "$ref": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                return [2 /*return*/, service.getResolvedSchema('http://json.schemastore.org/swagger-2.0').then(function (fs) {
                        var _a;
                        assert.deepEqual((_a = fs === null || fs === void 0 ? void 0 : fs.schema.properties) === null || _a === void 0 ? void 0 : _a['responseValue'], {
                            type: 'object',
                            required: ["$ref"],
                            properties: { $ref: { type: 'string' } }
                        });
                    })];
            });
        });
    });
    test('Resolving $refs 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                service.setSchemaContributions({
                    schemas: {
                        "https://myschemastore/main/schema1.json": {
                            id: 'https://myschemastore/schema1.json',
                            type: 'object',
                            properties: {
                                p1: {
                                    '$ref': 'schema2.json#/definitions/hello'
                                },
                                p2: {
                                    '$ref': './schema2.json#/definitions/hello'
                                },
                                p3: {
                                    '$ref': '/main/schema2.json#/definitions/hello'
                                }
                            }
                        },
                        "https://myschemastore/main/schema2.json": {
                            id: 'https://myschemastore/main/schema2.json',
                            definitions: {
                                "hello": {
                                    "type": "string",
                                    "enum": ["object"],
                                }
                            }
                        }
                    }
                });
                return [2 /*return*/, service.getResolvedSchema('https://myschemastore/main/schema1.json').then(function (fs) {
                        var _a, _b, _c;
                        assert.deepEqual((_a = fs === null || fs === void 0 ? void 0 : fs.schema.properties) === null || _a === void 0 ? void 0 : _a['p1'], {
                            type: 'string',
                            enum: ["object"]
                        });
                        assert.deepEqual((_b = fs === null || fs === void 0 ? void 0 : fs.schema.properties) === null || _b === void 0 ? void 0 : _b['p2'], {
                            type: 'string',
                            enum: ["object"]
                        });
                        assert.deepEqual((_c = fs === null || fs === void 0 ? void 0 : fs.schema.properties) === null || _c === void 0 ? void 0 : _c['p3'], {
                            type: 'string',
                            enum: ["object"]
                        });
                    })];
            });
        });
    });
    test('Resolving $refs 3', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                service.setSchemaContributions({
                    schemas: {
                        "https://myschemastore/main/schema1.json": {
                            id: 'https://myschemastore/schema1.json',
                            type: 'object',
                            properties: {
                                p1: {
                                    '$ref': 'schema2.json#/definitions/hello'
                                },
                                p2: {
                                    '$ref': './schema2.json#/definitions/hello'
                                },
                                p3: {
                                    '$ref': '/main/schema2.json#/definitions/hello'
                                }
                            }
                        },
                        "https://myschemastore/main/schema2.json": {
                            id: 'https://myschemastore/main/schema2.json',
                            definitions: {
                                "hello": {
                                    "type": "string",
                                    "enum": ["object"],
                                }
                            }
                        }
                    }
                });
                return [2 /*return*/, service.getResolvedSchema('https://myschemastore/main/schema1.json').then(function (fs) {
                        var _a, _b, _c;
                        assert.deepEqual((_a = fs === null || fs === void 0 ? void 0 : fs.schema.properties) === null || _a === void 0 ? void 0 : _a['p1'], {
                            type: 'string',
                            enum: ["object"]
                        });
                        assert.deepEqual((_b = fs === null || fs === void 0 ? void 0 : fs.schema.properties) === null || _b === void 0 ? void 0 : _b['p2'], {
                            type: 'string',
                            enum: ["object"]
                        });
                        assert.deepEqual((_c = fs === null || fs === void 0 ? void 0 : fs.schema.properties) === null || _c === void 0 ? void 0 : _c['p3'], {
                            type: 'string',
                            enum: ["object"]
                        });
                    })];
            });
        });
    });
    test('FileSchema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                service.setSchemaContributions({
                    schemas: {
                        "test://schemas/main": {
                            id: 'test://schemas/main',
                            type: 'object',
                            properties: {
                                child: {
                                    type: 'object',
                                    properties: {
                                        'grandchild': {
                                            type: 'number',
                                            description: 'Meaning of Life'
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                return [2 /*return*/, service.getResolvedSchema('test://schemas/main').then(function (fs) {
                        var section = fs === null || fs === void 0 ? void 0 : fs.getSection(['child', 'grandchild']);
                        assert.equal(section === null || section === void 0 ? void 0 : section.description, 'Meaning of Life');
                    })];
            });
        });
    });
    test('Array FileSchema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                service.setSchemaContributions({
                    schemas: {
                        "test://schemas/main": {
                            id: 'test://schemas/main',
                            type: 'object',
                            properties: {
                                child: {
                                    type: 'array',
                                    items: {
                                        'type': 'object',
                                        'properties': {
                                            'grandchild': {
                                                type: 'number',
                                                description: 'Meaning of Life'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                return [2 /*return*/, service.getResolvedSchema('test://schemas/main').then(function (fs) {
                        var section = fs === null || fs === void 0 ? void 0 : fs.getSection(['child', '0', 'grandchild']);
                        assert.equal(section === null || section === void 0 ? void 0 : section.description, 'Meaning of Life');
                    })];
            });
        });
    });
    test('Missing subschema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                service.setSchemaContributions({
                    schemas: {
                        "test://schemas/main": {
                            id: 'test://schemas/main',
                            type: 'object',
                            properties: {
                                child: {
                                    type: 'object'
                                }
                            }
                        }
                    }
                });
                return [2 /*return*/, service.getResolvedSchema('test://schemas/main').then(function (fs) {
                        var section = fs === null || fs === void 0 ? void 0 : fs.getSection(['child', 'grandchild']);
                        assert.strictEqual(section, undefined);
                    })];
            });
        });
    });
    test('Preloaded Schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, id, schema;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                id = 'https://myschemastore/test1';
                schema = {
                    type: 'object',
                    properties: {
                        child: {
                            type: 'object',
                            properties: {
                                'grandchild': {
                                    type: 'number',
                                    description: 'Meaning of Life'
                                }
                            }
                        }
                    }
                };
                service.registerExternalSchema(id, ['*.json'], schema);
                return [2 /*return*/, service.getSchemaForResource('test.json').then(function (schema) {
                        var section = schema === null || schema === void 0 ? void 0 : schema.getSection(['child', 'grandchild']);
                        assert.equal(section === null || section === void 0 ? void 0 : section.description, 'Meaning of Life');
                    })];
            });
        });
    });
    test('Multiple matches', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, id1, schema1, id2, schema2;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                id1 = 'https://myschemastore/test1';
                schema1 = {
                    type: 'object',
                    properties: {
                        foo: {
                            enum: [1],
                        }
                    }
                };
                id2 = 'https://myschemastore/test2';
                schema2 = {
                    type: 'object',
                    properties: {
                        bar: {
                            enum: [2],
                        }
                    }
                };
                service.registerExternalSchema(id1, ['*.json'], schema1);
                service.registerExternalSchema(id2, ['test.json'], schema2);
                return [2 /*return*/, service.getSchemaForResource('test.json').then(function (schema) {
                        var _a = toDocument(JSON.stringify({ foo: true, bar: true })), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
                        var problems = jsonDoc.validate(textDoc, schema === null || schema === void 0 ? void 0 : schema.schema);
                        assert.equal(problems === null || problems === void 0 ? void 0 : problems.length, 2);
                    })];
            });
        });
    });
    test('External Schema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, id, schema;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                id = 'https://myschemastore/test1';
                schema = {
                    type: 'object',
                    properties: {
                        child: {
                            type: 'object',
                            properties: {
                                'grandchild': {
                                    type: 'number',
                                    description: 'Meaning of Life'
                                }
                            }
                        }
                    }
                };
                service.registerExternalSchema(id, ['*.json'], schema);
                return [2 /*return*/, service.getSchemaForResource('test.json').then(function (schema) {
                        var section = schema === null || schema === void 0 ? void 0 : schema.getSection(['child', 'grandchild']);
                        assert.equal(section === null || section === void 0 ? void 0 : section.description, 'Meaning of Life');
                    })];
            });
        });
    });
    test('Resolving in-line $refs', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, id, schema;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                id = 'https://myschemastore/test1';
                schema = {
                    id: 'test://schemas/main',
                    type: 'object',
                    definitions: {
                        'grandchild': {
                            type: 'number',
                            description: 'Meaning of Life'
                        }
                    },
                    properties: {
                        child: {
                            type: 'array',
                            items: {
                                'type': 'object',
                                'properties': {
                                    'grandchild': {
                                        $ref: '#/definitions/grandchild'
                                    }
                                }
                            }
                        }
                    }
                };
                service.registerExternalSchema(id, ['*.json'], schema);
                return [2 /*return*/, service.getSchemaForResource('test.json').then(function (fs) {
                        var section = fs === null || fs === void 0 ? void 0 : fs.getSection(['child', '0', 'grandchild']);
                        assert.equal(section === null || section === void 0 ? void 0 : section.description, 'Meaning of Life');
                    })];
            });
        });
    });
    test('Resolving in-line $refs automatically for external schemas', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, id, schema, fsm;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                id = 'https://myschemastore/test1';
                schema = {
                    id: 'test://schemas/main',
                    type: 'object',
                    definitions: {
                        'grandchild': {
                            type: 'number',
                            description: 'Meaning of Life'
                        }
                    },
                    properties: {
                        child: {
                            type: 'array',
                            items: {
                                'type': 'object',
                                'properties': {
                                    'grandchild': {
                                        $ref: '#/definitions/grandchild'
                                    }
                                }
                            }
                        }
                    }
                };
                fsm = service.registerExternalSchema(id, ['*.json'], schema);
                return [2 /*return*/, fsm.getResolvedSchema().then(function (fs) {
                        var section = fs.getSection(['child', '0', 'grandchild']);
                        assert.equal(section === null || section === void 0 ? void 0 : section.description, 'Meaning of Life');
                    })];
            });
        });
    });
    test('Clearing External Schemas', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, id1, schema1, id2, schema2;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                id1 = 'http://myschemastore/test1';
                schema1 = {
                    type: 'object',
                    properties: {
                        child: {
                            type: 'number'
                        }
                    }
                };
                id2 = 'http://myschemastore/test2';
                schema2 = {
                    type: 'object',
                    properties: {
                        child: {
                            type: 'string'
                        }
                    }
                };
                service.registerExternalSchema(id1, ['test.json', 'bar.json'], schema1);
                return [2 /*return*/, service.getSchemaForResource('test.json').then(function (schema) {
                        var section = schema === null || schema === void 0 ? void 0 : schema.getSection(['child']);
                        assert.equal(section === null || section === void 0 ? void 0 : section.type, 'number');
                        service.clearExternalSchemas();
                        service.registerExternalSchema(id2, ['*.json'], schema2);
                        return service.getSchemaForResource('test.json').then(function (schema) {
                            var section = schema === null || schema === void 0 ? void 0 : schema.getSection(['child']);
                            assert.equal(section === null || section === void 0 ? void 0 : section.type, 'string');
                        });
                    })];
            });
        });
    });
    test('Schema contributions', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, id2, schema2;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                service.setSchemaContributions({
                    schemas: {
                        "http://myschemastore/myschemabar": {
                            id: 'http://myschemastore/myschemabar',
                            type: 'object',
                            properties: {
                                foo: {
                                    type: 'string'
                                }
                            }
                        }
                    },
                    schemaAssociations: [
                        {
                            pattern: ['*.bar'],
                            uris: ['http://myschemastore/myschemabar', 'http://myschemastore/myschemafoo']
                        }
                    ]
                });
                id2 = 'http://myschemastore/myschemafoo';
                schema2 = {
                    type: 'object',
                    properties: {
                        child: {
                            type: 'string'
                        }
                    }
                };
                service.registerExternalSchema(id2, undefined, schema2);
                return [2 /*return*/, service.getSchemaForResource('main.bar').then(function (resolvedSchema) {
                        var _a;
                        assert.deepEqual(resolvedSchema === null || resolvedSchema === void 0 ? void 0 : resolvedSchema.errors, []);
                        assert.equal(2, (_a = resolvedSchema === null || resolvedSchema === void 0 ? void 0 : resolvedSchema.schema.allOf) === null || _a === void 0 ? void 0 : _a.length);
                        service.clearExternalSchemas();
                        return service.getSchemaForResource('main.bar').then(function (resolvedSchema) {
                            assert.equal(resolvedSchema === null || resolvedSchema === void 0 ? void 0 : resolvedSchema.errors.length, 1);
                            assert.equal(resolvedSchema === null || resolvedSchema === void 0 ? void 0 : resolvedSchema.errors[0], "Problems loading reference 'http://myschemastore/myschemafoo': Unable to load schema from 'http://myschemastore/myschemafoo': Resource not found.");
                            service.clearExternalSchemas();
                            service.registerExternalSchema(id2, undefined, schema2);
                            return service.getSchemaForResource('main.bar').then(function (resolvedSchema) {
                                assert.equal(resolvedSchema === null || resolvedSchema === void 0 ? void 0 : resolvedSchema.errors.length, 0);
                            });
                        });
                    })];
            });
        });
    });
    test('Exclusive file patterns', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, positives, negatives, _i, positives_1, positive, _a, _b, _c, negatives_1, negative, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                        service.setSchemaContributions({
                            schemas: {
                                "http://myschemastore/myschemabar": {
                                    maxProperties: 0
                                }
                            },
                            schemaAssociations: [
                                {
                                    pattern: ['/folder/*.json', '!/folder/bar/*.json', '/folder/bar/zoo.json'],
                                    uris: ['http://myschemastore/myschemabar']
                                }
                            ]
                        });
                        positives = ['/folder/a.json', '/folder/bar.json', '/folder/bar/zoo.json'];
                        negatives = ['/folder/bar/a.json', '/folder/bar/z.json'];
                        _i = 0, positives_1 = positives;
                        _f.label = 1;
                    case 1:
                        if (!(_i < positives_1.length)) return [3 /*break*/, 4];
                        positive = positives_1[_i];
                        _b = (_a = assert).ok;
                        return [4 /*yield*/, service.getSchemaForResource(positive)];
                    case 2:
                        _b.apply(_a, [_f.sent(), positive]);
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _c = 0, negatives_1 = negatives;
                        _f.label = 5;
                    case 5:
                        if (!(_c < negatives_1.length)) return [3 /*break*/, 8];
                        negative = negatives_1[_c];
                        _e = (_d = assert).ok;
                        return [4 /*yield*/, service.getSchemaForResource(negative)];
                    case 6:
                        _e.apply(_d, [!(_f.sent()), negative]);
                        _f.label = 7;
                    case 7:
                        _c++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/];
                }
            });
        });
    });
    test('Resolving circular $refs', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, input, _a, textDoc, jsonDoc;
            return __generator(this, function (_b) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                input = {
                    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                    "contentVersion": "1.0.0.0",
                    "resources": [
                        {
                            "name": "SQLServer",
                            "type": "Microsoft.Sql/servers",
                            "location": "West US",
                            "apiVersion": "2014-04-01-preview",
                            "dependsOn": [],
                            "tags": {
                                "displayName": "SQL Server"
                            },
                            "properties": {
                                "administratorLogin": "asdfasd",
                                "administratorLoginPassword": "asdfasdfasd"
                            }
                        }
                    ]
                };
                _a = toDocument(JSON.stringify(input)), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
                return [2 /*return*/, service.getSchemaForResource('file://doc/mydoc.json', jsonDoc).then(function (resolveSchema) {
                        assert.deepEqual(resolveSchema === null || resolveSchema === void 0 ? void 0 : resolveSchema.errors, []);
                        var content = JSON.stringify(resolveSchema === null || resolveSchema === void 0 ? void 0 : resolveSchema.schema);
                        assert.equal(content.indexOf('$ref'), -1); // no more $refs
                        var problems = jsonDoc.validate(textDoc, resolveSchema === null || resolveSchema === void 0 ? void 0 : resolveSchema.schema);
                        assert.deepEqual(problems, []);
                    })];
            });
        });
    });
    test('Resolving circular $refs, invalid document', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, input, _a, textDoc, jsonDoc;
            return __generator(this, function (_b) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                input = {
                    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                    "contentVersion": "1.0.0.0",
                    "resources": [
                        {
                            "name": "foo",
                            "type": "Microsoft.Resources/deployments",
                            "apiVersion": "2015-01-01",
                        }
                    ]
                };
                _a = toDocument(JSON.stringify(input)), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
                return [2 /*return*/, service.getSchemaForResource('file://doc/mydoc.json', jsonDoc).then(function (resolveSchema) {
                        assert.deepEqual(resolveSchema === null || resolveSchema === void 0 ? void 0 : resolveSchema.errors, []);
                        var content = JSON.stringify(resolveSchema === null || resolveSchema === void 0 ? void 0 : resolveSchema.schema);
                        assert.equal(content.indexOf('$ref'), -1); // no more $refs
                        var problems = jsonDoc.validate(textDoc, resolveSchema === null || resolveSchema === void 0 ? void 0 : resolveSchema.schema);
                        assert.equal(problems === null || problems === void 0 ? void 0 : problems.length, 1);
                    })];
            });
        });
    });
    test('$refs in $ref', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, id0, id1, schema0, schema1, fsm0, fsm1;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                id0 = "foo://bar/bar0";
                id1 = "foo://bar/bar1";
                schema0 = {
                    "allOf": [
                        {
                            $ref: id1
                        }
                    ]
                };
                schema1 = {
                    $ref: "#/definitions/foo",
                    definitions: {
                        foo: {
                            type: 'object',
                        }
                    },
                };
                fsm0 = service.registerExternalSchema(id0, ['*.json'], schema0);
                fsm1 = service.registerExternalSchema(id1, [], schema1);
                return [2 /*return*/, fsm0.getResolvedSchema().then(function (fs0) {
                        var _a;
                        assert.equal(((_a = fs0 === null || fs0 === void 0 ? void 0 : fs0.schema.allOf) === null || _a === void 0 ? void 0 : _a[0]).type, 'object');
                    })];
            });
        });
    });
    test('$refs in $ref - circular', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                service.setSchemaContributions({
                    schemas: {
                        "https://myschemastore/main": {
                            type: 'object',
                            properties: {
                                responseValue: {
                                    "$ref": "#/definitions/shellConfiguration"
                                },
                                hops: {
                                    "$ref": "#/definitions/hop1"
                                }
                            },
                            definitions: {
                                shellConfiguration: {
                                    $ref: '#definitions/shellConfiguration',
                                    type: 'object'
                                },
                                hop1: {
                                    $ref: '#definitions/hop2',
                                },
                                hop2: {
                                    $ref: '#definitions/hop1',
                                    type: 'object'
                                }
                            }
                        }
                    }
                });
                return [2 /*return*/, service.getResolvedSchema('https://myschemastore/main').then(function (fs) {
                        var _a, _b;
                        assert.deepEqual((_a = fs === null || fs === void 0 ? void 0 : fs.schema.properties) === null || _a === void 0 ? void 0 : _a['responseValue'], {
                            type: 'object'
                        });
                        assert.deepEqual((_b = fs === null || fs === void 0 ? void 0 : fs.schema.properties) === null || _b === void 0 ? void 0 : _b['hops'], {
                            type: 'object'
                        });
                    })];
            });
        });
    });
    test('$refs with encoded characters', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, id0, schema, fsm0;
            return __generator(this, function (_a) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                id0 = "foo://bar/bar0";
                schema = {
                    definitions: {
                        'Foo<number>': {
                            type: 'object',
                        }
                    },
                    "type": "object",
                    "properties": {
                        "p1": { "enum": ["v1", "v2"] },
                        "p2": { "$ref": "#/definitions/Foo%3Cnumber%3E" }
                    }
                };
                fsm0 = service.registerExternalSchema(id0, ['*.json'], schema);
                return [2 /*return*/, fsm0.getResolvedSchema().then(function (fs0) {
                        var _a;
                        assert.deepEqual(fs0.errors, []);
                        assert.equal(((_a = fs0 === null || fs0 === void 0 ? void 0 : fs0.schema.properties) === null || _a === void 0 ? void 0 : _a.p2).type, 'object');
                    })];
            });
        });
    });
    test('Validate Azure Resource Definition', function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, input, _a, textDoc, jsonDoc;
            return __generator(this, function (_b) {
                service = new SchemaService.JSON5SchemaService(newMockRequestService(), workspaceContext);
                input = {
                    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                    "contentVersion": "1.0.0.0",
                    "resources": [
                        {
                            "apiVersion": "2015-06-15",
                            "type": "Microsoft.Compute/virtualMachines",
                            "name": "a",
                            "location": "West US",
                            "properties": {
                                "hardwareProfile": {
                                    "vmSize": "Small"
                                },
                                "osProfile": {
                                    "computername": "a",
                                    "adminUsername": "a",
                                    "adminPassword": "a"
                                },
                                "storageProfile": {
                                    "imageReference": {
                                        "publisher": "a",
                                        "offer": "a",
                                        "sku": "a",
                                        "version": "latest"
                                    },
                                    "osDisk": {
                                        "name": "osdisk",
                                        "vhd": {
                                            "uri": "[concat('http://', 'b','.blob.core.windows.net/',variables('vmStorageAccountContainerName'),'/',variables('OSDiskName'),'.vhd')]"
                                        },
                                        "caching": "ReadWrite",
                                        "createOption": "FromImage"
                                    }
                                },
                                "networkProfile": {
                                    "networkInterfaces": [
                                        {
                                            "id": "[resourceId('Microsoft.Network/networkInterfaces',variables('nicName'))]"
                                        }
                                    ]
                                },
                                "diagnosticsProfile": {
                                    "bootDiagnostics": {
                                        "enabled": "true",
                                        "storageUri": "[concat('http://',parameters('newStorageAccountName'),'.blob.core.windows.net')]"
                                    }
                                }
                            }
                        }
                    ]
                };
                _a = toDocument(JSON.stringify(input)), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
                return [2 /*return*/, service.getSchemaForResource('file://doc/mydoc.json', jsonDoc).then(function (resolvedSchema) {
                        assert.deepEqual(resolvedSchema === null || resolvedSchema === void 0 ? void 0 : resolvedSchema.errors, []);
                        var problems = jsonDoc.validate(textDoc, resolvedSchema === null || resolvedSchema === void 0 ? void 0 : resolvedSchema.schema);
                        assert.equal(problems === null || problems === void 0 ? void 0 : problems.length, 1);
                        assert.equal(problems === null || problems === void 0 ? void 0 : problems[0].message, 'Missing property "computerName".');
                    })];
            });
        });
    });
    test('Complex enums', function () {
        var input = {
            "group": {
                "kind": "build",
                "isDefault": false
            }
        };
        var schema = {
            "type": "object",
            "properties": {
                "group": {
                    "oneOf": [
                        {
                            "type": "string"
                        },
                        {
                            "type": "object",
                            "properties": {
                                "kind": {
                                    "type": "string",
                                    "default": "none",
                                    "description": "The task\"s execution group."
                                },
                                "isDefault": {
                                    "type": "boolean",
                                    "default": false,
                                    "description": "Defines if this task is the default task in the group."
                                }
                            }
                        }
                    ],
                    "enum": [
                        {
                            "kind": "build",
                            "isDefault": true
                        },
                        {
                            "kind": "build",
                            "isDefault": false
                        },
                        {
                            "kind": "test",
                            "isDefault": true
                        },
                        {
                            "kind": "test",
                            "isDefault": false
                        },
                        "build",
                        "test",
                        "none"
                    ]
                }
            }
        };
        var _a = toDocument(JSON.stringify(input)), textDoc = _a.textDoc, jsonDoc = _a.jsonDoc;
        var problems = jsonDoc.validate(textDoc, schema);
        assert.equal(problems === null || problems === void 0 ? void 0 : problems.length, 0);
    });
    test('clearSchema', function () {
        return __awaiter(this, void 0, void 0, function () {
            var mainSchemaURI, aSchemaURI1, bSchemaURI1, schemas, accesses, schemaRequestService, ls, testDoc, validation;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mainSchemaURI = "http://foo/main.schema.json";
                        aSchemaURI1 = "http://foo/a.schema.json";
                        bSchemaURI1 = "http://foo/b.schema.json";
                        schemas = (_a = {},
                            _a[mainSchemaURI] = {
                                type: 'object',
                                properties: {
                                    bar: {
                                        $ref: aSchemaURI1
                                    }
                                }
                            },
                            _a[aSchemaURI1] = {
                                type: 'object',
                                properties: {
                                    a: {
                                        type: 'string'
                                    }
                                }
                            },
                            _a[bSchemaURI1] = {
                                type: 'boolean',
                            },
                            _a);
                        accesses = [];
                        schemaRequestService = newMockRequestService(schemas, accesses);
                        ls = getLanguageService({ workspaceContext: workspaceContext, schemaRequestService: schemaRequestService });
                        testDoc = toDocument(JSON.stringify({ $schema: mainSchemaURI, bar: { a: 1 } }));
                        return [4 /*yield*/, ls.doValidation(testDoc.textDoc, testDoc.jsonDoc)];
                    case 1:
                        validation = _b.sent();
                        assert.deepEqual(validation.map(function (v) { return v.message; }), ['Incorrect type. Expected "string".']);
                        assert.deepEqual([mainSchemaURI, aSchemaURI1], accesses); // b in not loaded as it is not references
                        accesses.length = 0;
                        // add a dependency to b
                        schemas[aSchemaURI1] = {
                            type: 'object',
                            properties: {
                                a: {
                                    $ref: bSchemaURI1
                                }
                            }
                        };
                        ls.resetSchema(aSchemaURI1);
                        return [4 /*yield*/, ls.doValidation(testDoc.textDoc, testDoc.jsonDoc)];
                    case 2:
                        validation = _b.sent();
                        assert.deepEqual(validation.map(function (v) { return v.message; }), ['Incorrect type. Expected "boolean".']);
                        assert.deepEqual([mainSchemaURI, aSchemaURI1, bSchemaURI1], accesses); // main, a and b are loaded
                        // change to be but no reset
                        schemas[bSchemaURI1] = {
                            type: 'number'
                        };
                        accesses.length = 0;
                        return [4 /*yield*/, ls.doValidation(testDoc.textDoc, testDoc.jsonDoc)];
                    case 3:
                        validation = _b.sent();
                        assert.deepEqual(validation.map(function (v) { return v.message; }), ['Incorrect type. Expected "boolean".']);
                        assert.deepEqual([], accesses); // no loades as there was no reset
                        // do the reset
                        ls.resetSchema(bSchemaURI1);
                        return [4 /*yield*/, ls.doValidation(testDoc.textDoc, testDoc.jsonDoc)];
                    case 4:
                        validation = _b.sent();
                        assert.deepEqual(validation.map(function (v) { return v.message; }), []);
                        assert.deepEqual([mainSchemaURI, aSchemaURI1, bSchemaURI1], accesses); // main, a and b are loaded, main, a depend on b
                        accesses.length = 0;
                        // remove the dependency
                        schemas[aSchemaURI1] = {
                            type: 'object',
                            properties: {
                                a: {
                                    type: 'boolean'
                                }
                            }
                        };
                        ls.resetSchema(aSchemaURI1);
                        return [4 /*yield*/, ls.doValidation(testDoc.textDoc, testDoc.jsonDoc)];
                    case 5:
                        validation = _b.sent();
                        assert.deepEqual(validation.map(function (v) { return v.message; }), ['Incorrect type. Expected "boolean".']);
                        assert.deepEqual([mainSchemaURI, aSchemaURI1], accesses);
                        accesses.length = 0;
                        ls.resetSchema(bSchemaURI1);
                        return [4 /*yield*/, ls.doValidation(testDoc.textDoc, testDoc.jsonDoc)];
                    case 6:
                        validation = _b.sent();
                        assert.deepEqual(validation.map(function (v) { return v.message; }), ['Incorrect type. Expected "boolean".']);
                        assert.deepEqual([], accesses); // b is not depended anymore
                        return [2 /*return*/];
                }
            });
        });
    });
});
