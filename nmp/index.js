/*!
 * css-box-shadow-parser v1.0.0
 * Parse CSS box-shadow values into structured layer objects.
 * https://github.com/html-code-generator/css-box-shadow-parser
 * MIT License
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.BoxShadowParser = factory();
    }
}(
    typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this,
    () => {
        const NO_SHADOW = new Set(['none', 'initial', 'inherit', 'unset', 'revert', 'revert-layer']);
        const UNRESOLVED_COLOR_HEX = '#000000';

        const NAMED_COLORS = {
            aliceblue: '#f0f8ff', antiquewhite: '#faebd7', aqua: '#00ffff',
            aquamarine: '#7fffd4', azure: '#f0ffff', beige: '#f5f5dc',
            bisque: '#ffe4c4', black: '#000000', blanchedalmond: '#ffebcd',
            blue: '#0000ff', blueviolet: '#8a2be2', brown: '#a52a2a',
            burlywood: '#deb887', cadetblue: '#5f9ea0', chartreuse: '#7fff00',
            chocolate: '#d2691e', coral: '#ff7f50', cornflowerblue: '#6495ed',
            cornsilk: '#fff8dc', crimson: '#dc143c', cyan: '#00ffff',
            darkblue: '#00008b', darkcyan: '#008b8b', darkgoldenrod: '#b8860b',
            darkgray: '#a9a9a9', darkgreen: '#006400', darkgrey: '#a9a9a9',
            darkkhaki: '#bdb76b', darkmagenta: '#8b008b', darkolivegreen: '#556b2f',
            darkorange: '#ff8c00', darkorchid: '#9932cc', darkred: '#8b0000',
            darksalmon: '#e9967a', darkseagreen: '#8fbc8f', darkslateblue: '#483d8b',
            darkslategray: '#2f4f4f', darkslategrey: '#2f4f4f', darkturquoise: '#00ced1',
            darkviolet: '#9400d3', deeppink: '#ff1493', deepskyblue: '#00bfff',
            dimgray: '#696969', dimgrey: '#696969', dodgerblue: '#1e90ff',
            firebrick: '#b22222', floralwhite: '#fffaf0', forestgreen: '#228b22',
            fuchsia: '#ff00ff', gainsboro: '#dcdcdc', ghostwhite: '#f8f8ff',
            gold: '#ffd700', goldenrod: '#daa520', gray: '#808080',
            green: '#008000', greenyellow: '#adff2f', grey: '#808080',
            honeydew: '#f0fff0', hotpink: '#ff69b4', indianred: '#cd5c5c',
            indigo: '#4b0082', ivory: '#fffff0', khaki: '#f0e68c',
            lavender: '#e6e6fa', lavenderblush: '#fff0f5', lawngreen: '#7cfc00',
            lemonchiffon: '#fffacd', lightblue: '#add8e6', lightcoral: '#f08080',
            lightcyan: '#e0ffff', lightgoldenrodyellow: '#fafad2', lightgray: '#d3d3d3',
            lightgreen: '#90ee90', lightgrey: '#d3d3d3', lightpink: '#ffb6c1',
            lightsalmon: '#ffa07a', lightseagreen: '#20b2aa', lightskyblue: '#87cefa',
            lightslategray: '#778899', lightslategrey: '#778899', lightsteelblue: '#b0c4de',
            lightyellow: '#ffffe0', lime: '#00ff00', limegreen: '#32cd32',
            linen: '#faf0e6', magenta: '#ff00ff', maroon: '#800000',
            mediumaquamarine: '#66cdaa', mediumblue: '#0000cd', mediumorchid: '#ba55d3',
            mediumpurple: '#9370db', mediumseagreen: '#3cb371', mediumslateblue: '#7b68ee',
            mediumspringgreen: '#00fa9a', mediumturquoise: '#48d1cc', mediumvioletred: '#c71585',
            midnightblue: '#191970', mintcream: '#f5fffa', mistyrose: '#ffe4e1',
            moccasin: '#ffe4b5', navajowhite: '#ffdead', navy: '#000080',
            oldlace: '#fdf5e6', olive: '#808000', olivedrab: '#6b8e23',
            orange: '#ffa500', orangered: '#ff4500', orchid: '#da70d6',
            palegoldenrod: '#eee8aa', palegreen: '#98fb98', paleturquoise: '#afeeee',
            palevioletred: '#db7093', papayawhip: '#ffefd5', peachpuff: '#ffdab9',
            peru: '#cd853f', pink: '#ffc0cb', plum: '#dda0dd',
            powderblue: '#b0e0e6', purple: '#800080', rebeccapurple: '#663399',
            red: '#ff0000', rosybrown: '#bc8f8f', royalblue: '#4169e1',
            saddlebrown: '#8b4513', salmon: '#fa8072', sandybrown: '#f4a460',
            seagreen: '#2e8b57', seashell: '#fff5ee', sienna: '#a0522d',
            silver: '#c0c0c0', skyblue: '#87ceeb', slateblue: '#6a5acd',
            slategray: '#708090', slategrey: '#708090', snow: '#fffafa',
            springgreen: '#00ff7f', steelblue: '#4682b4', tan: '#d2b48c',
            teal: '#008080', thistle: '#d8bfd8', tomato: '#ff6347',
            turquoise: '#40e0d0', violet: '#ee82ee', wheat: '#f5deb3',
            white: '#ffffff', whitesmoke: '#f5f5f5', yellow: '#ffff00',
            yellowgreen: '#9acd32',
        };

        // ── Regexes ───────────────────────────────────────────────────────────

        const RE_COLOR_FN   = /\b(?:rgba?|hsla?|oklch|oklab|lch|lab|hwb|color)\s*\([^()]*\)/i;
        const RE_COLOR_HEX  = /#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{4}\b|#[0-9a-fA-F]{3}\b/;
        const RE_COLOR_NAME = new RegExp(`\\b(?:transparent|currentcolor|${Object.keys(NAMED_COLORS).join('|')})\\b`, 'i');
        const RE_LENGTH     = /[+-]?(?:\d*\.)?\d+(?:px|r?em|%|v(?:[hw]|min|max)|ch|ex|cm|mm|in|p[tc]|q)?(?=\s|$)/g;

        // ── Math helpers ──────────────────────────────────────────────────────

        const clamp      = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
        const roundAlpha = (v)         => Math.round(clamp(v, 0, 1) * 100) / 100;

        // ── Color helpers ─────────────────────────────────────────────────────

        const parseChannel = (raw) => {
            const v = raw.trim();
            const n = parseFloat(v);
            return v.endsWith('%') ? clamp(n, 0, 100) * 2.55 : clamp(n, 0, 255);
        };

        const parseAlpha = (raw) => {
            if (raw === undefined || raw === null || raw === '') return 1;
            const v = raw.trim();
            return roundAlpha(v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v));
        };

        const toHex = (r, g, b) =>
            '#' + [r, g, b]
                .map((v) => Math.round(clamp(Number(v), 0, 255)).toString(16).padStart(2, '0'))
                .join('');

        const hslToRgb = (h, s, l) => {
            const hue   = ((h % 360) + 360) % 360;
            const sat   = clamp(s, 0, 100) / 100;
            const light = clamp(l, 0, 100) / 100;
            const k = (n) => (n + hue / 30) % 12;
            const a = sat * Math.min(light, 1 - light);
            const f = (n) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
            return [f(0) * 255, f(8) * 255, f(4) * 255];
        };

        const colorToHex = (color) => {
            if (!color) return { hex: UNRESOLVED_COLOR_HEX, alpha: 1 };
            const s = color.trim().toLowerCase();

            if (/^#[0-9a-f]{6}$/.test(s))
                return { hex: s, alpha: 1 };

            if (/^#[0-9a-f]{3}$/.test(s))
                return { hex: '#' + [...s.slice(1)].map((c) => c + c).join(''), alpha: 1 };

            if (/^#[0-9a-f]{8}$/.test(s))
                return { hex: s.slice(0, 7), alpha: roundAlpha(parseInt(s.slice(7, 9), 16) / 255) };

            if (/^#[0-9a-f]{4}$/.test(s))
                return {
                    hex:   '#' + [...s.slice(1, 4)].map((c) => c + c).join(''),
                    alpha: roundAlpha(parseInt(s[4] + s[4], 16) / 255),
                };

            const rgb = s.match(/^rgba?\(\s*([+-]?(?:\d*\.)?\d+%?)\s*(?:,|\s)\s*([+-]?(?:\d*\.)?\d+%?)\s*(?:,|\s)\s*([+-]?(?:\d*\.)?\d+%?)(?:\s*(?:,|\/)\s*([+-]?(?:\d*\.)?\d+%?))?\s*\)$/);
            if (rgb)
                return { hex: toHex(parseChannel(rgb[1]), parseChannel(rgb[2]), parseChannel(rgb[3])), alpha: parseAlpha(rgb[4]) };

            const hsl = s.match(/^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*(?:,|\s)\s*([+-]?(?:\d*\.)?\d+)%\s*(?:,|\s)\s*([+-]?(?:\d*\.)?\d+)%(?:\s*(?:,|\/)\s*([+-]?(?:\d*\.)?\d+%?))?\s*\)$/);
            if (hsl) {
                const [r, g, b] = hslToRgb(parseFloat(hsl[1]), parseFloat(hsl[2]), parseFloat(hsl[3]));
                return { hex: toHex(r, g, b), alpha: parseAlpha(hsl[4]) };
            }

            if (s === 'transparent')  return { hex: UNRESOLVED_COLOR_HEX, alpha: 0 };
            if (s === 'currentcolor') return { hex: UNRESOLVED_COLOR_HEX, alpha: 1 };
            if (NAMED_COLORS[s])      return { hex: NAMED_COLORS[s],       alpha: 1 };

            return { hex: UNRESOLVED_COLOR_HEX, alpha: 1 };
        };

        // ── Shadow helpers ────────────────────────────────────────────────────

        /**
         * Splits a compound box-shadow value into individual tokens.
         * Commas inside color functions (e.g. rgba(0,0,0,0.5)) are ignored.
         *
         * @param {string} shadow
         * @returns {string[]}
         */
        const splitShadows = (shadow) => {
            if (typeof shadow !== 'string') return [];
            const result = [];
            let depth = 0, current = '';

            for (const char of shadow) {
                if (char === '(')                    depth += 1;
                else if (char === ')' && depth > 0)  depth -= 1;
                else if (char === ',' && depth === 0) {
                    if (current.trim()) result.push(current.trim());
                    current = '';
                    continue;
                }
                current += char;
            }

            if (current.trim()) result.push(current.trim());
            return result;
        };

        const extractColor = (value) => {
            let color = null, rest = value;

            const tryExtract = (re) => {
                const m = rest.match(re);
                if (!m) return false;
                color = m[0];
                rest  = `${rest.slice(0, m.index)} ${rest.slice(m.index + m[0].length)}`.trim();
                return true;
            };

            tryExtract(RE_COLOR_FN) || tryExtract(RE_COLOR_HEX) || tryExtract(RE_COLOR_NAME);
            return { color, rest };
        };

        // ── Public API ────────────────────────────────────────────────────────

        /**
         * @typedef  {Object}  BoxShadowLayer
         * @property {boolean} inset
         * @property {number}  x
         * @property {number}  y
         * @property {number}  blur
         * @property {number}  spread
         * @property {string}  color  - original CSS color token
         * @property {number}  alpha  - opacity 0–1
         * @property {string}  hex    - resolved 6-digit hex
         */

        /**
         * Parses a single shadow token.
         *
         * @param  {string} raw
         * @returns {BoxShadowLayer|null}
         */
        const parseSingle = (raw) => {
            if (typeof raw !== 'string') return null;

            let value = raw.trim();
            if (!value || NO_SHADOW.has(value.toLowerCase())) return null;

            const inset = /\binset\b/i.test(value);
            value = value.replace(/\binset\b/gi, ' ').trim();

            const { color, rest } = extractColor(value);
            const lengths = rest.match(RE_LENGTH) || [];
            if (lengths.length < 2) return null;

            const { hex, alpha } = colorToHex(color);

            return {
                inset,
                x:      parseFloat(lengths[0]),
                y:      parseFloat(lengths[1]),
                blur:   parseFloat(lengths[2]) || 0,
                spread: parseFloat(lengths[3]) || 0,
                color:  color || UNRESOLVED_COLOR_HEX,
                alpha,
                hex,
            };
        };

        /**
         * Parses a full CSS box-shadow value (single or multi-layer).
         * Also accepts a full CSS declaration: "box-shadow: ...;"
         *
         * @param  {string} shadow
         * @returns {BoxShadowLayer[]}
         *
         * @example
         * parse('4px 4px 10px rgba(0,0,0,0.4)')
         * parse('box-shadow: inset 0 2px 4px rgba(0,0,0,.24);')
         * parse('0 1px 2px #0002, 0 4px 8px #0002')
         */
        const parse = (shadow) => {
            if (typeof shadow !== 'string') return [];
            const value = shadow.trim().replace(/^box-shadow\s*:\s*/i, '').replace(/;$/, '').trim();
            if (!value || NO_SHADOW.has(value.toLowerCase())) return [];
            return splitShadows(value).map(parseSingle).filter(Boolean);
        };

        return { parse, split: splitShadows, parseSingle: parseSingle };
    }
));
