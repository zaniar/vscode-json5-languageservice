/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Thenable, MarkedString, CompletionItem } from './json5LanguageService';

export interface JSON5WorkerContribution {
	getInfoContribution(uri: string, location: JSON5Path): Thenable<MarkedString[]>;
	collectPropertyCompletions(uri: string, location: JSON5Path, currentWord: string, addValue: boolean, isLast: boolean, result: CompletionsCollector): Thenable<any>;
	collectValueCompletions(uri: string, location: JSON5Path, propertyKey: string, result: CompletionsCollector): Thenable<any>;
	collectDefaultCompletions(uri: string, result: CompletionsCollector): Thenable<any>;
	resolveCompletion?(item: CompletionItem): Thenable<CompletionItem>;
}
export type Segment = string | number;
export type JSON5Path = Segment[];

export interface CompletionsCollector {
	add(suggestion: CompletionItem): void;
	error(message: string): void;
	log(message: string): void;
	setAsIncomplete(): void;
	getNumberOfProposals(): number;
}