import { JSON5Schema, JSON5SchemaRef } from '../json5Schema';
import { TextDocument, ASTNode, ObjectASTNode, ArrayASTNode, BooleanASTNode, NumberASTNode, StringASTNode, NullASTNode, PropertyASTNode, JSON5Path, ErrorCode, Diagnostic, DiagnosticSeverity, Range } from '../json5LanguageTypes';
export interface IRange {
    offset: number;
    length: number;
}
export interface IProblem {
    location: IRange;
    severity: DiagnosticSeverity;
    code?: ErrorCode;
    message: string;
}
export declare abstract class ASTNodeImpl {
    abstract readonly type: 'object' | 'property' | 'array' | 'number' | 'boolean' | 'null' | 'string';
    offset: number;
    length: number;
    readonly parent: ASTNode | undefined;
    constructor(parent: ASTNode | undefined, offset: number, length?: number);
    get children(): ASTNode[];
    toString(): string;
}
export declare class NullASTNodeImpl extends ASTNodeImpl implements NullASTNode {
    type: 'null';
    value: null;
    constructor(parent: ASTNode | undefined, offset: number);
}
export declare class BooleanASTNodeImpl extends ASTNodeImpl implements BooleanASTNode {
    type: 'boolean';
    value: boolean;
    constructor(parent: ASTNode | undefined, boolValue: boolean, offset: number);
}
export declare class ArrayASTNodeImpl extends ASTNodeImpl implements ArrayASTNode {
    type: 'array';
    items: ASTNode[];
    constructor(parent: ASTNode | undefined, offset: number);
    get children(): ASTNode[];
}
export declare class NumberASTNodeImpl extends ASTNodeImpl implements NumberASTNode {
    type: 'number';
    isInteger: boolean;
    value: number;
    constructor(parent: ASTNode | undefined, offset: number);
}
export declare class StringASTNodeImpl extends ASTNodeImpl implements StringASTNode {
    type: 'string';
    value: string;
    constructor(parent: ASTNode | undefined, offset: number, length?: number);
}
export declare class PropertyASTNodeImpl extends ASTNodeImpl implements PropertyASTNode {
    type: 'property';
    keyNode: StringASTNode;
    valueNode?: ASTNode;
    colonOffset: number;
    constructor(parent: ObjectASTNode | undefined, offset: number, keyNode: StringASTNode);
    get children(): ASTNode[];
}
export declare class ObjectASTNodeImpl extends ASTNodeImpl implements ObjectASTNode {
    type: 'object';
    properties: PropertyASTNode[];
    constructor(parent: ASTNode | undefined, offset: number);
    get children(): ASTNode[];
}
export declare function asSchema(schema: JSON5SchemaRef): JSON5Schema;
export declare function asSchema(schema: JSON5SchemaRef | undefined): JSON5Schema | undefined;
export interface JSON5DocumentConfig {
    collectComments?: boolean;
}
export interface IApplicableSchema {
    node: ASTNode;
    inverted?: boolean;
    schema: JSON5Schema;
}
export declare enum EnumMatch {
    Key = 0,
    Enum = 1
}
export interface ISchemaCollector {
    schemas: IApplicableSchema[];
    add(schema: IApplicableSchema): void;
    merge(other: ISchemaCollector): void;
    include(node: ASTNode): boolean;
    newSub(): ISchemaCollector;
}
export declare class ValidationResult {
    problems: IProblem[];
    propertiesMatches: number;
    propertiesValueMatches: number;
    primaryValueMatches: number;
    enumValueMatch: boolean;
    enumValues: any[] | undefined;
    constructor();
    hasProblems(): boolean;
    mergeAll(validationResults: ValidationResult[]): void;
    merge(validationResult: ValidationResult): void;
    mergeEnumValues(validationResult: ValidationResult): void;
    mergePropertyMatch(propertyValidationResult: ValidationResult): void;
    compare(other: ValidationResult): number;
}
export declare function newJSON5Document(root: ASTNode, diagnostics?: Diagnostic[]): JSON5Document;
export declare function getNodeValue(node: ASTNode): any;
export declare function getNodePath(node: ASTNode): JSON5Path;
export declare function contains(node: ASTNode, offset: number, includeRightBound?: boolean): boolean;
export declare class JSON5Document {
    readonly root: ASTNode | undefined;
    readonly syntaxErrors: Diagnostic[];
    readonly comments: Range[];
    constructor(root: ASTNode | undefined, syntaxErrors?: Diagnostic[], comments?: Range[]);
    getNodeFromOffset(offset: number, includeRightBound?: boolean): ASTNode | undefined;
    visit(visitor: (node: ASTNode) => boolean): void;
    validate(textDocument: TextDocument, schema: JSON5Schema | undefined): Diagnostic[] | undefined;
    getMatchingSchemas(schema: JSON5Schema, focusOffset?: number, exclude?: ASTNode): IApplicableSchema[];
}
export declare function parse(textDocument: TextDocument, config?: JSON5DocumentConfig): JSON5Document;
