import { JSON5Schema } from '../json5Schema';
import * as Parser from '../parser/json5Parser';
import { SchemaRequestService, WorkspaceContextService, PromiseConstructor, Thenable } from '../json5LanguageTypes';
export interface IJSON5SchemaService {
    /**
     * Registers a schema file in the current workspace to be applicable to files that match the pattern
     */
    registerExternalSchema(uri: string, filePatterns?: string[], unresolvedSchema?: JSON5Schema): ISchemaHandle;
    /**
     * Clears all cached schema files
     */
    clearExternalSchemas(): void;
    /**
     * Registers contributed schemas
     */
    setSchemaContributions(schemaContributions: ISchemaContributions): void;
    /**
     * Looks up the appropriate schema for the given URI
     */
    getSchemaForResource(resource: string, document?: Parser.JSON5Document): Thenable<ResolvedSchema | undefined>;
    /**
     * Returns all registered schema ids
     */
    getRegisteredSchemaIds(filter?: (scheme: string) => boolean): string[];
}
export interface SchemaAssociation {
    pattern: string[];
    uris: string[];
}
export interface ISchemaContributions {
    schemas?: {
        [id: string]: JSON5Schema;
    };
    schemaAssociations?: SchemaAssociation[];
}
export interface ISchemaHandle {
    /**
     * The schema id
     */
    url: string;
    /**
     * The schema from the file, with potential $ref references
     */
    getUnresolvedSchema(): Thenable<UnresolvedSchema>;
    /**
     * The schema from the file, with references resolved
     */
    getResolvedSchema(): Thenable<ResolvedSchema>;
}
declare type SchemaDependencies = {
    [uri: string]: true;
};
export declare class UnresolvedSchema {
    schema: JSON5Schema;
    errors: string[];
    constructor(schema: JSON5Schema, errors?: string[]);
}
export declare class ResolvedSchema {
    schema: JSON5Schema;
    errors: string[];
    constructor(schema: JSON5Schema, errors?: string[]);
    getSection(path: string[]): JSON5Schema | undefined;
    private getSectionRecursive;
}
export declare class JSON5SchemaService implements IJSON5SchemaService {
    private contributionSchemas;
    private contributionAssociations;
    private schemasById;
    private filePatternAssociations;
    private registeredSchemasIds;
    private contextService;
    private callOnDispose;
    private requestService;
    private promiseConstructor;
    private cachedSchemaForResource;
    constructor(requestService?: SchemaRequestService, contextService?: WorkspaceContextService, promiseConstructor?: PromiseConstructor);
    getRegisteredSchemaIds(filter?: (scheme: string) => boolean): string[];
    get promise(): PromiseConstructor;
    dispose(): void;
    onResourceChange(uri: string): boolean;
    setSchemaContributions(schemaContributions: ISchemaContributions): void;
    private addSchemaHandle;
    private getOrAddSchemaHandle;
    private addFilePatternAssociation;
    registerExternalSchema(uri: string, filePatterns?: string[], unresolvedSchemaContent?: JSON5Schema): ISchemaHandle;
    clearExternalSchemas(): void;
    getResolvedSchema(schemaId: string): Thenable<ResolvedSchema | undefined>;
    loadSchema(url: string): Thenable<UnresolvedSchema>;
    resolveSchemaContent(schemaToResolve: UnresolvedSchema, schemaURL: string, dependencies: SchemaDependencies): Thenable<ResolvedSchema>;
    getSchemaForResource(resource: string, document?: Parser.JSON5Document): Thenable<ResolvedSchema | undefined>;
    private createCombinedSchema;
}
export {};
