# vscode-json5-languageservice
JSON5 derived from [vscode-json-languageservice](https://github.com/microsoft/vscode-json-languageservice).

[![npm Package](https://img.shields.io/npm/v/vscode-json-languageservice.svg?style=flat-square)](https://www.npmjs.org/package/vscode-json-languageservice)
[![NPM Downloads](https://img.shields.io/npm/dm/vscode-json-languageservice.svg)](https://npmjs.org/package/vscode-json-languageservice)
[![Build Status](https://travis-ci.org/Microsoft/vscode-json-languageservice.svg?branch=master)](https://travis-ci.org/Microsoft/vscode-json-languageservice)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Why?
----
The _vscode-json-languageservice_ contains the language smarts behind the JSON editing experience of Visual Studio Code
and the Monaco editor.
 - *doValidation* analyses an input string and returns syntax and lint errros.
 - *doComplete* provides completion proposals for a given location. *doResolve* resolves a completion proposal
 - *doResolve* resolves a completion proposals.
 - *doHover* provides a hover text for a given location.
 - *findDocumentSymbols* provides all symbols in the given document
 - *findDocumentColors* provides all color symbols in the given document, *getColorPresentations* returns available color formats for a color symbol.
 - *format* formats the code at the given range.
 - *getFoldingRanges* gets folding ranges for the given document
 - *getSelectionRanges* gets selection ranges for a given location.

 - use *parseJSON5Document* create a JSON5 document from source code, or *newJSON5Document* to create the document from an AST.

Installation
------------

    npm install --save zaniar/vscode-json5-languageservice
