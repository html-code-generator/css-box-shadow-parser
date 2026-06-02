/*!
 * css-box-shadow-parser v1.1.0
 * Type definitions for the CSS box-shadow parser.
 * https://github.com/html-code-generator/css-box-shadow-parser
 *
 * @author  HTML Code Generator
 * @website https://www.html-code-generator.com/
 * @license MIT
 */

/** A single parsed box-shadow layer. */
export interface BoxShadowLayer {
    /** True when the shadow uses the `inset` keyword. */
    inset: boolean;
    /** Horizontal offset (unitless number, px assumed). */
    x: number;
    /** Vertical offset (unitless number, px assumed). */
    y: number;
    /** Blur radius (unitless number, px assumed). */
    blur: number;
    /** Spread radius (unitless number, px assumed; can be negative). */
    spread: number;
    /** The original CSS color token as written. */
    color: string;
    /** Opacity from 0 to 1. */
    alpha: number;
    /** Resolved 6-digit hex color. */
    hex: string;
}

/**
 * Parse a full box-shadow value (single or multi-layer).
 * Accepts raw values or complete CSS declarations.
 */
export function parse(shadow: string): BoxShadowLayer[];

/** Parse a single shadow token. Returns null for invalid input. */
export function parseSingle(token: string): BoxShadowLayer | null;

/** Split a compound value on top-level commas without parsing. */
export function split(shadow: string): string[];

/** Serialize a layer object, or array of layers, back into a CSS box-shadow string. */
export function stringify(input: BoxShadowLayer | BoxShadowLayer[]): string;

export as namespace BoxShadowParser;
