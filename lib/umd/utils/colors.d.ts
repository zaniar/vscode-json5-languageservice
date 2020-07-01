import { Color } from "../json5LanguageTypes";
export declare function hexDigit(charCode: number): number;
export declare function colorFromHex(text: string): Color | undefined;
export declare function colorFrom256RGB(red: number, green: number, blue: number, alpha?: number): {
    red: number;
    green: number;
    blue: number;
    alpha: number;
};
