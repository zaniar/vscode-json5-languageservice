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
        define(["require", "exports", "../parser/json5Parser", "../utils/strings", "../utils/colors", "../json5LanguageTypes"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Parser = require("../parser/json5Parser");
    var Strings = require("../utils/strings");
    var colors_1 = require("../utils/colors");
    var json5LanguageTypes_1 = require("../json5LanguageTypes");
    var JSON5DocumentSymbols = /** @class */ (function () {
        function JSON5DocumentSymbols(schemaService) {
            this.schemaService = schemaService;
        }
        JSON5DocumentSymbols.prototype.findDocumentSymbols = function (document, doc, context) {
            var _this = this;
            if (context === void 0) { context = { resultLimit: Number.MAX_VALUE }; }
            var root = doc.root;
            if (!root) {
                return [];
            }
            var limit = context.resultLimit || Number.MAX_VALUE;
            // special handling for key bindings
            var resourceString = document.uri;
            if ((resourceString === 'vscode://defaultsettings/keybindings.json') || Strings.endsWith(resourceString.toLowerCase(), '/user/keybindings.json')) {
                if (root.type === 'array') {
                    var result_1 = [];
                    for (var _i = 0, _a = root.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.type === 'object') {
                            for (var _b = 0, _c = item.properties; _b < _c.length; _b++) {
                                var property = _c[_b];
                                if (property.keyNode.value === 'key' && property.valueNode) {
                                    var location = json5LanguageTypes_1.Location.create(document.uri, getRange(document, item));
                                    result_1.push({ name: Parser.getNodeValue(property.valueNode), kind: json5LanguageTypes_1.SymbolKind.Function, location: location });
                                    limit--;
                                    if (limit <= 0) {
                                        if (context && context.onResultLimitExceeded) {
                                            context.onResultLimitExceeded(resourceString);
                                        }
                                        return result_1;
                                    }
                                }
                            }
                        }
                    }
                    return result_1;
                }
            }
            var toVisit = [
                { node: root, containerName: '' }
            ];
            var nextToVisit = 0;
            var limitExceeded = false;
            var result = [];
            var collectOutlineEntries = function (node, containerName) {
                if (node.type === 'array') {
                    node.items.forEach(function (node) {
                        if (node) {
                            toVisit.push({ node: node, containerName: containerName });
                        }
                    });
                }
                else if (node.type === 'object') {
                    node.properties.forEach(function (property) {
                        var valueNode = property.valueNode;
                        if (valueNode) {
                            if (limit > 0) {
                                limit--;
                                var location = json5LanguageTypes_1.Location.create(document.uri, getRange(document, property));
                                var childContainerName = containerName ? containerName + '.' + property.keyNode.value : property.keyNode.value;
                                result.push({ name: _this.getKeyLabel(property), kind: _this.getSymbolKind(valueNode.type), location: location, containerName: containerName });
                                toVisit.push({ node: valueNode, containerName: childContainerName });
                            }
                            else {
                                limitExceeded = true;
                            }
                        }
                    });
                }
            };
            // breath first traversal
            while (nextToVisit < toVisit.length) {
                var next = toVisit[nextToVisit++];
                collectOutlineEntries(next.node, next.containerName);
            }
            if (limitExceeded && context && context.onResultLimitExceeded) {
                context.onResultLimitExceeded(resourceString);
            }
            return result;
        };
        JSON5DocumentSymbols.prototype.findDocumentSymbols2 = function (document, doc, context) {
            var _this = this;
            if (context === void 0) { context = { resultLimit: Number.MAX_VALUE }; }
            var root = doc.root;
            if (!root) {
                return [];
            }
            var limit = context.resultLimit || Number.MAX_VALUE;
            // special handling for key bindings
            var resourceString = document.uri;
            if ((resourceString === 'vscode://defaultsettings/keybindings.json') || Strings.endsWith(resourceString.toLowerCase(), '/user/keybindings.json')) {
                if (root.type === 'array') {
                    var result_2 = [];
                    for (var _i = 0, _a = root.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.type === 'object') {
                            for (var _b = 0, _c = item.properties; _b < _c.length; _b++) {
                                var property = _c[_b];
                                if (property.keyNode.value === 'key' && property.valueNode) {
                                    var range = getRange(document, item);
                                    var selectionRange = getRange(document, property.keyNode);
                                    result_2.push({ name: Parser.getNodeValue(property.valueNode), kind: json5LanguageTypes_1.SymbolKind.Function, range: range, selectionRange: selectionRange });
                                    limit--;
                                    if (limit <= 0) {
                                        if (context && context.onResultLimitExceeded) {
                                            context.onResultLimitExceeded(resourceString);
                                        }
                                        return result_2;
                                    }
                                }
                            }
                        }
                    }
                    return result_2;
                }
            }
            var result = [];
            var toVisit = [
                { node: root, result: result }
            ];
            var nextToVisit = 0;
            var limitExceeded = false;
            var collectOutlineEntries = function (node, result) {
                if (node.type === 'array') {
                    node.items.forEach(function (node, index) {
                        if (node) {
                            if (limit > 0) {
                                limit--;
                                var range = getRange(document, node);
                                var selectionRange = range;
                                var name = String(index);
                                var symbol = { name: name, kind: _this.getSymbolKind(node.type), range: range, selectionRange: selectionRange, children: [] };
                                result.push(symbol);
                                toVisit.push({ result: symbol.children, node: node });
                            }
                            else {
                                limitExceeded = true;
                            }
                        }
                    });
                }
                else if (node.type === 'object') {
                    node.properties.forEach(function (property) {
                        var valueNode = property.valueNode;
                        if (valueNode) {
                            if (limit > 0) {
                                limit--;
                                var range = getRange(document, property);
                                var selectionRange = getRange(document, property.keyNode);
                                var symbol = { name: _this.getKeyLabel(property), kind: _this.getSymbolKind(valueNode.type), range: range, selectionRange: selectionRange, children: [] };
                                result.push(symbol);
                                toVisit.push({ result: symbol.children, node: valueNode });
                            }
                            else {
                                limitExceeded = true;
                            }
                        }
                    });
                }
            };
            // breath first traversal
            while (nextToVisit < toVisit.length) {
                var next = toVisit[nextToVisit++];
                collectOutlineEntries(next.node, next.result);
            }
            if (limitExceeded && context && context.onResultLimitExceeded) {
                context.onResultLimitExceeded(resourceString);
            }
            return result;
        };
        JSON5DocumentSymbols.prototype.getSymbolKind = function (nodeType) {
            switch (nodeType) {
                case 'object':
                    return json5LanguageTypes_1.SymbolKind.Module;
                case 'string':
                    return json5LanguageTypes_1.SymbolKind.String;
                case 'number':
                    return json5LanguageTypes_1.SymbolKind.Number;
                case 'array':
                    return json5LanguageTypes_1.SymbolKind.Array;
                case 'boolean':
                    return json5LanguageTypes_1.SymbolKind.Boolean;
                default: // 'null'
                    return json5LanguageTypes_1.SymbolKind.Variable;
            }
        };
        JSON5DocumentSymbols.prototype.getKeyLabel = function (property) {
            var name = property.keyNode.value;
            if (name) {
                name = name.replace(/[\n]/g, '↵');
            }
            if (name && name.trim()) {
                return name;
            }
            return "\"" + name + "\"";
        };
        JSON5DocumentSymbols.prototype.findDocumentColors = function (document, doc, context) {
            return this.schemaService.getSchemaForResource(document.uri, doc).then(function (schema) {
                var result = [];
                if (schema) {
                    var limit = context && typeof context.resultLimit === 'number' ? context.resultLimit : Number.MAX_VALUE;
                    var matchingSchemas = doc.getMatchingSchemas(schema.schema);
                    var visitedNode = {};
                    for (var _i = 0, matchingSchemas_1 = matchingSchemas; _i < matchingSchemas_1.length; _i++) {
                        var s = matchingSchemas_1[_i];
                        if (!s.inverted && s.schema && (s.schema.format === 'color' || s.schema.format === 'color-hex') && s.node && s.node.type === 'string') {
                            var nodeId = String(s.node.offset);
                            if (!visitedNode[nodeId]) {
                                var color = colors_1.colorFromHex(Parser.getNodeValue(s.node));
                                if (color) {
                                    var range = getRange(document, s.node);
                                    result.push({ color: color, range: range });
                                }
                                visitedNode[nodeId] = true;
                                limit--;
                                if (limit <= 0) {
                                    if (context && context.onResultLimitExceeded) {
                                        context.onResultLimitExceeded(document.uri);
                                    }
                                    return result;
                                }
                            }
                        }
                    }
                }
                return result;
            });
        };
        JSON5DocumentSymbols.prototype.getColorPresentations = function (document, doc, color, range) {
            var result = [];
            var red256 = Math.round(color.red * 255), green256 = Math.round(color.green * 255), blue256 = Math.round(color.blue * 255);
            function toTwoDigitHex(n) {
                var r = n.toString(16);
                return r.length !== 2 ? '0' + r : r;
            }
            var label;
            if (color.alpha === 1) {
                label = "#" + toTwoDigitHex(red256) + toTwoDigitHex(green256) + toTwoDigitHex(blue256);
            }
            else {
                label = "#" + toTwoDigitHex(red256) + toTwoDigitHex(green256) + toTwoDigitHex(blue256) + toTwoDigitHex(Math.round(color.alpha * 255));
            }
            result.push({ label: label, textEdit: json5LanguageTypes_1.TextEdit.replace(range, JSON.stringify(label)) });
            return result;
        };
        return JSON5DocumentSymbols;
    }());
    exports.JSON5DocumentSymbols = JSON5DocumentSymbols;
    function getRange(document, node) {
        return json5LanguageTypes_1.Range.create(document.positionAt(node.offset), document.positionAt(node.offset + node.length));
    }
});
