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
        define(["require", "exports", "../utils/json5", "assert"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var json5_1 = require("../utils/json5");
    var assert = require("assert");
    suite('JSON5 Stringify', function () {
        test('Object', function () {
            var obj = {
                key1: 'Hello',
                key2: true,
                key3: 1.3,
                key4: null,
                key5: { key1: '', key2: false }
            };
            assert.equal(json5_1.stringifyObject(obj, '', JSON.stringify), '{\n\t"key1": "Hello",\n\t"key2": true,\n\t"key3": 1.3,\n\t"key4": null,\n\t"key5": {\n\t\t"key1": "",\n\t\t"key2": false\n\t}\n}');
        });
        test('Array', function () {
            var arr = [
                'Hello', {}, [1234], []
            ];
            assert.equal(json5_1.stringifyObject(arr, '', JSON.stringify), JSON.stringify(arr, null, '\t'));
        });
    });
});
