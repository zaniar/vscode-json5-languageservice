import { JSON5SchemaService } from './json5SchemaService';
import { JSON5Document } from '../parser/json5Parser';
import { TextDocument, PromiseConstructor, Thenable, LanguageSettings, DocumentLanguageSettings, Diagnostic } from '../json5LanguageTypes';
import { JSON5Schema } from '../json5Schema';
export declare class JSON5Validation {
    private jsonSchemaService;
    private promise;
    private validationEnabled;
    private commentSeverity;
    constructor(jsonSchemaService: JSON5SchemaService, promiseConstructor: PromiseConstructor);
    configure(raw: LanguageSettings): void;
    doValidation(textDocument: TextDocument, jsonDocument: JSON5Document, documentSettings?: DocumentLanguageSettings, schema?: JSON5Schema): Thenable<Diagnostic[]>;
}
