import * as Parser from '../parser/json5Parser';
import * as SchemaService from './json5SchemaService';
import { JSON5WorkerContribution } from '../json5Contributions';
import { TextDocument, PromiseConstructor, Thenable, Position, Hover } from '../json5LanguageTypes';
export declare class JSON5Hover {
    private schemaService;
    private contributions;
    private promise;
    constructor(schemaService: SchemaService.IJSON5SchemaService, contributions: JSON5WorkerContribution[] | undefined, promiseConstructor: PromiseConstructor);
    doHover(document: TextDocument, position: Position, doc: Parser.JSON5Document): Thenable<Hover | null>;
}
