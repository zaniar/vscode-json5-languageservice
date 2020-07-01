/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { JSON5SchemaService, ResolvedSchema, UnresolvedSchema } from './json5SchemaService';
import { JSON5Document } from '../parser/json5Parser';

import { TextDocument, ErrorCode, PromiseConstructor, Thenable, LanguageSettings, DocumentLanguageSettings, SeverityLevel, Diagnostic, DiagnosticSeverity, Range } from '../json5LanguageTypes';
import * as nls from 'vscode-nls';
import { JSON5SchemaRef, JSON5Schema } from '../json5Schema';
import { isDefined, isBoolean } from '../utils/objects';

const localize = nls.loadMessageBundle();

export class JSON5Validation {

	private jsonSchemaService: JSON5SchemaService;
	private promise: PromiseConstructor;

	private validationEnabled: boolean | undefined;
	private commentSeverity: DiagnosticSeverity | undefined;

	public constructor(jsonSchemaService: JSON5SchemaService, promiseConstructor: PromiseConstructor) {
		this.jsonSchemaService = jsonSchemaService;
		this.promise = promiseConstructor;
		this.validationEnabled = true;
	}

	public configure(raw: LanguageSettings) {
		if (raw) {
			this.validationEnabled = raw.validate;
			this.commentSeverity = raw.allowComments ? undefined : DiagnosticSeverity.Error;
		}
	}

	public doValidation(textDocument: TextDocument, jsonDocument: JSON5Document, documentSettings?: DocumentLanguageSettings, schema?: JSON5Schema): Thenable<Diagnostic[]> {
		if (!this.validationEnabled) {
			return this.promise.resolve([]);
		}
		const diagnostics: Diagnostic[] = [];
		const added: { [signature: string]: boolean } = {};
		const addProblem = (problem: Diagnostic) => {
			// remove duplicated messages
			const signature = problem.range.start.line + ' ' + problem.range.start.character + ' ' + problem.message;
			if (!added[signature]) {
				added[signature] = true;
				diagnostics.push(problem);
			}
		};
		const getDiagnostics = (schema: ResolvedSchema | undefined) => {
			let trailingCommaSeverity = documentSettings ? toDiagnosticSeverity(documentSettings.trailingCommas) : DiagnosticSeverity.Error;
			let commentSeverity = documentSettings ? toDiagnosticSeverity(documentSettings.comments) : this.commentSeverity;

			if (schema) {
				if (schema.errors.length && jsonDocument.root) {
					const astRoot = jsonDocument.root;
					const property = astRoot.type === 'object' ? astRoot.properties[0] : undefined;
					if (property && property.keyNode.value === '$schema') {
						const node = property.valueNode || property;
						const range = Range.create(textDocument.positionAt(node.offset), textDocument.positionAt(node.offset + node.length));
						addProblem(Diagnostic.create(range, schema.errors[0], DiagnosticSeverity.Warning, ErrorCode.SchemaResolveError));
					} else {
						const range = Range.create(textDocument.positionAt(astRoot.offset), textDocument.positionAt(astRoot.offset + 1));
						addProblem(Diagnostic.create(range, schema.errors[0], DiagnosticSeverity.Warning, ErrorCode.SchemaResolveError));
					}
				} else {
					const semanticErrors = jsonDocument.validate(textDocument, schema.schema);
					if (semanticErrors) {
						semanticErrors.forEach(addProblem);
					}
				}

				if (schemaAllowsComments(schema.schema)) {
					commentSeverity = undefined;
				}

				if (schemaAllowsTrailingCommas(schema.schema)) {
					trailingCommaSeverity = undefined;
				}
			}

			for (const p of jsonDocument.syntaxErrors) {
				if (p.code === ErrorCode.TrailingComma) {
					if (typeof trailingCommaSeverity !== 'number') {
						continue;
					}
					p.severity = trailingCommaSeverity;
				}
				addProblem(p);
			}

			if (typeof commentSeverity === 'number') {
				const message = localize('InvalidCommentToken', 'Comments are not permitted in JSON5.');
				jsonDocument.comments.forEach(c => {
					addProblem(Diagnostic.create(c, message, commentSeverity, ErrorCode.CommentNotPermitted));
				});
			}
			return diagnostics;
		};

		if (schema) {
			const id = schema.id || ('schemaservice://untitled/' + idCounter++);
			return this.jsonSchemaService.resolveSchemaContent(new UnresolvedSchema(schema), id, {}).then(resolvedSchema => {
				return getDiagnostics(resolvedSchema);
			});
		}
		return this.jsonSchemaService.getSchemaForResource(textDocument.uri, jsonDocument).then(schema => {
			return getDiagnostics(schema);
		});
	}
}

let idCounter = 0;

function schemaAllowsComments(schemaRef: JSON5SchemaRef): boolean | undefined {
	if (schemaRef && typeof schemaRef === 'object') {
		if (isBoolean(schemaRef.allowComments)) {
			return schemaRef.allowComments;
		}
		if (schemaRef.allOf) {
			for (const schema of schemaRef.allOf) {
				const allow = schemaAllowsComments(schema);
				if (isBoolean(allow)) {
					return allow;
				}
			}
		}
	}
	return undefined;
}

function schemaAllowsTrailingCommas(schemaRef: JSON5SchemaRef): boolean | undefined {
	if (schemaRef && typeof schemaRef === 'object') {
		if (isBoolean(schemaRef.allowTrailingCommas)) {
			return schemaRef.allowTrailingCommas;
		}
		const deprSchemaRef = schemaRef as any;
		if (isBoolean(deprSchemaRef['allowsTrailingCommas'])) { // deprecated
			return deprSchemaRef['allowsTrailingCommas'];
		}
		if (schemaRef.allOf) {
			for (const schema of schemaRef.allOf) {
				const allow = schemaAllowsTrailingCommas(schema);
				if (isBoolean(allow)) {
					return allow;
				}
			}
		}
	}
	return undefined;
}

function toDiagnosticSeverity(severityLevel: SeverityLevel | undefined): DiagnosticSeverity | undefined {
	switch (severityLevel) {
		case 'error': return DiagnosticSeverity.Error;
		case 'warning': return DiagnosticSeverity.Warning;
		case 'ignore': return undefined;
	}
	return undefined;
}	