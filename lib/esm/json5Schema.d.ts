export declare type JSON5SchemaRef = JSON5Schema | boolean;
export interface JSON5Schema {
    id?: string;
    $id?: string;
    $schema?: string;
    type?: string | string[];
    title?: string;
    default?: any;
    definitions?: {
        [name: string]: JSON5Schema;
    };
    description?: string;
    properties?: JSON5SchemaMap;
    patternProperties?: JSON5SchemaMap;
    additionalProperties?: boolean | JSON5SchemaRef;
    minProperties?: number;
    maxProperties?: number;
    dependencies?: JSON5SchemaMap | {
        [prop: string]: string[];
    };
    items?: JSON5SchemaRef | JSON5SchemaRef[];
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    additionalItems?: boolean | JSON5SchemaRef;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: boolean | number;
    exclusiveMaximum?: boolean | number;
    multipleOf?: number;
    required?: string[];
    $ref?: string;
    anyOf?: JSON5SchemaRef[];
    allOf?: JSON5SchemaRef[];
    oneOf?: JSON5SchemaRef[];
    not?: JSON5SchemaRef;
    enum?: any[];
    format?: string;
    const?: any;
    contains?: JSON5SchemaRef;
    propertyNames?: JSON5SchemaRef;
    examples?: any[];
    $comment?: string;
    if?: JSON5SchemaRef;
    then?: JSON5SchemaRef;
    else?: JSON5SchemaRef;
    defaultSnippets?: {
        label?: string;
        description?: string;
        markdownDescription?: string;
        body?: any;
        bodyText?: string;
    }[];
    errorMessage?: string;
    patternErrorMessage?: string;
    deprecationMessage?: string;
    enumDescriptions?: string[];
    markdownEnumDescriptions?: string[];
    markdownDescription?: string;
    doNotSuggest?: boolean;
    suggestSortText?: string;
    allowComments?: boolean;
    allowTrailingCommas?: boolean;
}
export interface JSON5SchemaMap {
    [name: string]: JSON5SchemaRef;
}
