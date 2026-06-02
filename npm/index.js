/*!
 * css-box-shadow-parser v1.1.0
 * Parse CSS box-shadow values into structured layer objects.
 * https://github.com/html-code-generator/css-box-shadow-parser
 *
 * @author  HTML Code Generator <htmlcodegenerator.com@gmail.com>
 * @website https://www.html-code-generator.com/
 * @license MIT
 */

(function (root, factory) {
    const api = factory();

    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.BoxShadowParser = api;
    }
}(
    typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this,
    () => {
        const NO_SHADOW = new Set(['none', 'initial', 'inherit', 'unset', 'revert', 'revert-layer']);
        const UNRESOLVED_COLOR_HEX = '#000000';

        const NAMED_COLORS = {
            aliceblue: '#f0f8ff',
            antiquewhite: '#faebd7',
            aqua: '#00ffff',
            aquamarine: '#7fffd4',
            azure: '#f0ffff',
            beige: '#f5f5dc',
            bisque: '#ffe4c4',
            black: '#000000',
            blanchedalmond: '#ffebcd',
            blue: '#0000ff',
            blueviolet: '#8a2be2',
            brown: '#a52a2a',
            burlywood: '#deb887',
            cadetblue: '#5f9ea0',
            chartreuse: '#7fff00',
            chocolate: '#d2691e',
            coral: '#ff7f50',
            cornflowerblue: '#6495ed',
            cornsilk: '#fff8dc',
            crimson: '#dc143c',
            cyan: '#00ffff',
            darkblue: '#00008b',
            darkcyan: '#008b8b',
            darkgoldenrod: '#b8860b',
            darkgray: '#a9a9a9',
            darkgreen: '#006400',
            darkgrey: '#a9a9a9',
            darkkhaki: '#bdb76b',
            darkmagenta: '#8b008b',
            darkolivegreen: '#556b2f',
            darkorange: '#ff8c00',
            darkorchid: '#9932cc',
            darkred: '#8b0000',
            darksalmon: '#e9967a',
            darkseagreen: '#8fbc8f',
            darkslateblue: '#483d8b',
            darkslategray: '#2f4f4f',
            darkslategrey: '#2f4f4f',
            darkturquoise: '#00ced1',
            darkviolet: '#9400d3',
            deeppink: '#ff1493',
            deepskyblue: '#00bfff',
            dimgray: '#696969',
            dimgrey: '#696969',
            dodgerblue: '#1e90ff',
            firebrick: '#b22222',
            floralwhite: '#fffaf0',
            forestgreen: '#228b22',
            fuchsia: '#ff00ff',
            gainsboro: '#dcdcdc',
            ghostwhite: '#f8f8ff',
            gold: '#ffd700',
            goldenrod: '#daa520',
            gray: '#808080',
            green: '#008000',
            greenyellow: '#adff2f',
            grey: '#808080',
            honeydew: '#f0fff0',
            hotpink: '#ff69b4',
            indianred: '#cd5c5c',
            indigo: '#4b0082',
            ivory: '#fffff0',
            khaki: '#f0e68c',
            lavender: '#e6e6fa',
            lavenderblush: '#fff0f5',
            lawngreen: '#7cfc00',
            lemonchiffon: '#fffacd',
            lightblue: '#add8e6',
            lightcoral: '#f08080',
            lightcyan: '#e0ffff',
            lightgoldenrodyellow: '#fafad2',
            lightgray: '#d3d3d3',
            lightgreen: '#90ee90',
            lightgrey: '#d3d3d3',
            lightpink: '#ffb6c1',
            lightsalmon: '#ffa07a',
            lightseagreen: '#20b2aa',
            lightskyblue: '#87cefa',
            lightslategray: '#778899',
            lightslategrey: '#778899',
            lightsteelblue: '#b0c4de',
            lightyellow: '#ffffe0',
            lime: '#00ff00',
            limegreen: '#32cd32',
            linen: '#faf0e6',
            magenta: '#ff00ff',
            maroon: '#800000',
            mediumaquamarine: '#66cdaa',
            mediumblue: '#0000cd',
            mediumorchid: '#ba55d3',
            mediumpurple: '#9370db',
            mediumseagreen: '#3cb371',
            mediumslateblue: '#7b68ee',
            mediumspringgreen: '#00fa9a',
            mediumturquoise: '#48d1cc',
            mediumvioletred: '#c71585',
            midnightblue: '#191970',
            mintcream: '#f5fffa',
            mistyrose: '#ffe4e1',
            moccasin: '#ffe4b5',
            navajowhite: '#ffdead',
            navy: '#000080',
            oldlace: '#fdf5e6',
            olive: '#808000',
            olivedrab: '#6b8e23',
            orange: '#ffa500',
            orangered: '#ff4500',
            orchid: '#da70d6',
            palegoldenrod: '#eee8aa',
            palegreen: '#98fb98',
            paleturquoise: '#afeeee',
            palevioletred: '#db7093',
            papayawhip: '#ffefd5',
            peachpuff: '#ffdab9',
            peru: '#cd853f',
            pink: '#ffc0cb',
            plum: '#dda0dd',
            powderblue: '#b0e0e6',
            purple: '#800080',
            rebeccapurple: '#663399',
            red: '#ff0000',
            rosybrown: '#bc8f8f',
            royalblue: '#4169e1',
            saddlebrown: '#8b4513',
            salmon: '#fa8072',
            sandybrown: '#f4a460',
            seagreen: '#2e8b57',
            seashell: '#fff5ee',
            sienna: '#a0522d',
            silver: '#c0c0c0',
            skyblue: '#87ceeb',
            slateblue: '#6a5acd',
            slategray: '#708090',
            slategrey: '#708090',
            snow: '#fffafa',
            springgreen: '#00ff7f',
            steelblue: '#4682b4',
            tan: '#d2b48c',
            teal: '#008080',
            thistle: '#d8bfd8',
            tomato: '#ff6347',
            turquoise: '#40e0d0',
            violet: '#ee82ee',
            wheat: '#f5deb3',
            white: '#ffffff',
            whitesmoke: '#f5f5f5',
            yellow: '#ffff00',
            yellowgreen: '#9acd32',
        };

        const RE_COLOR_HEX = /#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{4}\b|#[0-9a-fA-F]{3}\b/;
        const RE_COLOR_NAME = new RegExp(`\\b(?:transparent|currentcolor|${Object.keys(NAMED_COLORS).join('|')})\\b`, 'i');
        const RE_LENGTH = /[+-]?(?:\d*\.)?\d+(?:[eE][+-]?\d+)?(?:px|r?em|%|v(?:[hw]|min|max)|ch|ex|cm|mm|in|p[tc]|q)?(?=\s|$)/g;

        const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
        const roundAlpha = (value) => Math.round(clamp(value, 0, 1) * 100) / 100;

        const parseChannel = (raw) => {
            const value = raw.trim();
            const parsed = parseFloat(value);
            return value.endsWith('%') ? clamp(parsed, 0, 100) * 2.55 : clamp(parsed, 0, 255);
        };

        const parseAlpha = (raw) => {
            if (raw === undefined || raw === null || raw === '') return 1;
            const value = raw.trim();
            const parsed = parseFloat(value);
            return roundAlpha(value.endsWith('%') ? parsed / 100 : parsed);
        };

        const toHex = (r, g, b) => (
            '#' + [r, g, b]
                .map((value) => Math.round(clamp(Number(value), 0, 255)).toString(16).padStart(2, '0'))
                .join('')
        );

        const hslToRgb = (h, s, l) => {
            const hue = ((h % 360) + 360) % 360;
            const sat = clamp(s, 0, 100) / 100;
            const light = clamp(l, 0, 100) / 100;
            const k = (n) => (n + hue / 30) % 12;
            const a = sat * Math.min(light, 1 - light);
            const f = (n) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
            return [f(0) * 255, f(8) * 255, f(4) * 255];
        };

        const colorToHex = (color) => {
            if (!color) return { hex: UNRESOLVED_COLOR_HEX, alpha: 1 };

            const value = color.trim().toLowerCase();

            if (/^#[0-9a-f]{6}$/.test(value)) return { hex: value, alpha: 1 };

            if (/^#[0-9a-f]{3}$/.test(value)) {
                return { hex: '#' + [...value.slice(1)].map((char) => char + char).join(''), alpha: 1 };
            }

            if (/^#[0-9a-f]{8}$/.test(value)) {
                return { hex: value.slice(0, 7), alpha: roundAlpha(parseInt(value.slice(7, 9), 16) / 255) };
            }

            if (/^#[0-9a-f]{4}$/.test(value)) {
                return {
                    hex: '#' + [...value.slice(1, 4)].map((char) => char + char).join(''),
                    alpha: roundAlpha(parseInt(value[4] + value[4], 16) / 255),
                };
            }

            const rgbMatch = value.match(/^rgba?\(\s*([+-]?(?:\d*\.)?\d+%?)\s*(?:,|\s)\s*([+-]?(?:\d*\.)?\d+%?)\s*(?:,|\s)\s*([+-]?(?:\d*\.)?\d+%?)(?:\s*(?:,|\/)\s*([+-]?(?:\d*\.)?\d+%?))?\s*\)$/);
            if (rgbMatch) {
                return {
                    hex: toHex(parseChannel(rgbMatch[1]), parseChannel(rgbMatch[2]), parseChannel(rgbMatch[3])),
                    alpha: parseAlpha(rgbMatch[4]),
                };
            }

            const hslMatch = value.match(/^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*(?:,|\s)\s*([+-]?(?:\d*\.)?\d+)%\s*(?:,|\s)\s*([+-]?(?:\d*\.)?\d+)%(?:\s*(?:,|\/)\s*([+-]?(?:\d*\.)?\d+%?))?\s*\)$/);
            if (hslMatch) {
                const [r, g, b] = hslToRgb(
                    parseFloat(hslMatch[1]),
                    parseFloat(hslMatch[2]),
                    parseFloat(hslMatch[3])
                );

                return {
                    hex: toHex(r, g, b),
                    alpha: parseAlpha(hslMatch[4]),
                };
            }

            if (value === 'transparent') return { hex: UNRESOLVED_COLOR_HEX, alpha: 0 };
            if (value === 'currentcolor') return { hex: UNRESOLVED_COLOR_HEX, alpha: 1 };
            if (NAMED_COLORS[value]) return { hex: NAMED_COLORS[value], alpha: 1 };

            return { hex: UNRESOLVED_COLOR_HEX, alpha: 1 };
        };

        const splitShadows = (shadow) => {
            if (typeof shadow !== 'string') return [];

            const result = [];
            let depth = 0;
            let current = '';

            for (const char of shadow) {
                if (char === '(') {
                    depth += 1;
                } else if (char === ')' && depth > 0) {
                    depth -= 1;
                } else if (char === ',' && depth === 0) {
                    if (current.trim()) result.push(current.trim());
                    current = '';
                    continue;
                }

                current += char;
            }

            if (current.trim()) result.push(current.trim());
            return result;
        };

        const extractColorFnToken = (str) => {
            const m = str.match(/\b(?:rgba?|hsla?|oklch|oklab|lch|lab|hwb|color)\s*\(/i);
            if (!m) return null;
            let depth = 0;
            for (let i = m.index; i < str.length; i++) {
                if (str[i] === '(') depth++;
                else if (str[i] === ')') {
                    if (--depth === 0) return { match: str.slice(m.index, i + 1), index: m.index };
                }
            }
            return null;
        };

        const extractColor = (value) => {
            let color = null;
            let rest = value;

            const tryExtract = (regex) => {
                const match = rest.match(regex);
                if (!match) return false;

                color = match[0];
                rest = `${rest.slice(0, match.index)} ${rest.slice(match.index + match[0].length)}`.trim();
                return true;
            };

            const fnToken = extractColorFnToken(rest);
            if (fnToken) {
                color = fnToken.match;
                rest = `${rest.slice(0, fnToken.index)} ${rest.slice(fnToken.index + fnToken.match.length)}`.trim();
            } else {
                tryExtract(RE_COLOR_HEX) || tryExtract(RE_COLOR_NAME);
            }

            return { color, rest };
        };

        const stripCssFunctions = (str) => {
            let result = '';
            let depth = 0;
            for (let i = 0; i < str.length; i++) {
                const ch = str[i];
                if (ch === '(') {
                    if (++depth === 1) result = result.replace(/[a-zA-Z][a-zA-Z0-9_-]*\s*$/, ' ');
                } else if (ch === ')' && depth > 0) {
                    if (--depth === 0) result += ' ';
                } else if (depth === 0) {
                    result += ch;
                }
            }
            return result;
        };

        const parseSingleShadow = (raw) => {
            if (typeof raw !== 'string') return null;

            let value = raw.trim();
            if (!value || NO_SHADOW.has(value.toLowerCase())) return null;

            const inset = /\binset\b/i.test(value);
            value = value.replace(/\binset\b/gi, ' ').trim();

            const extracted = extractColor(value);
            const color = extracted.color;
            value = extracted.rest;

            const lengths = stripCssFunctions(value).match(RE_LENGTH) || [];
            if (lengths.length < 2) return null;

            const { hex, alpha } = colorToHex(color);

            return {
                inset,
                x: parseFloat(lengths[0]),
                y: parseFloat(lengths[1]),
                blur: parseFloat(lengths[2]) || 0,
                spread: parseFloat(lengths[3]) || 0,
                color: color || UNRESOLVED_COLOR_HEX,
                alpha,
                hex,
            };
        };

        const parseBoxShadow = (shadow) => {
            if (typeof shadow !== 'string') return [];

            // Accept full CSS declarations: "box-shadow: ...; " → extract value only
            let trimmed = shadow.trim().replace(/^box-shadow\s*:\s*/i, '').replace(/;$/, '').trim();
            if (!trimmed || NO_SHADOW.has(trimmed.toLowerCase())) return [];

            return splitShadows(trimmed).map(parseSingleShadow).filter(Boolean);
        };

        const lengthToCss = (value) => {
            const num = Number(value) || 0;
            return num === 0 ? '0' : `${num}px`;
        };

        const colorToCss = (layer) => {
            // Prefer the original color token when present (faithful round-trip)
            if (layer.color && typeof layer.color === 'string') return layer.color;

            const hex = typeof layer.hex === 'string' ? layer.hex : UNRESOLVED_COLOR_HEX;
            if (typeof layer.alpha === 'number' && layer.alpha < 1) {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${layer.alpha})`;
            }
            return hex;
        };

        const stringifyLayer = (layer) => {
            if (!layer || typeof layer !== 'object') return '';

            const blur = Number(layer.blur) || 0;
            const spread = Number(layer.spread) || 0;
            const parts = [];

            if (layer.inset) parts.push('inset');
            parts.push(lengthToCss(layer.x));
            parts.push(lengthToCss(layer.y));
            // blur is required when spread is present (CSS orders blur before spread)
            if (blur !== 0 || spread !== 0) parts.push(lengthToCss(blur));
            if (spread !== 0) parts.push(lengthToCss(spread));

            const color = colorToCss(layer);
            if (color) parts.push(color);

            return parts.join(' ');
        };

        const stringifyBoxShadow = (input) => {
            if (Array.isArray(input)) {
                return input.map(stringifyLayer).filter(Boolean).join(', ');
            }
            return stringifyLayer(input);
        };

        return {
            parse: parseBoxShadow,
            split: splitShadows,
            parseSingle: parseSingleShadow,
            stringify: stringifyBoxShadow,
        };
    }
));
