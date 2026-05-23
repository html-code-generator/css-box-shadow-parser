# css-box-shadow-parser

Parse any CSS `box-shadow` value into structured JavaScript objects.  
Supports multi-layer shadows, all color formats, `inset`, and full CSS declarations.

---

## Features

- Parses single and multi-layer shadows
- Accepts full CSS declarations — `box-shadow: ...;`
- All color formats: `hex`, `#rrggbbaa`, `rgb()`, `rgba()`, `hsl()`, `hsla()`, named colors, `transparent`
- Returns resolved 6-digit `hex` + numeric `alpha` for every layer
- Works in **browser** (script tag) and **Node.js** (CommonJS)
- Zero dependencies

---

## Files

```
css-box-shadow-parser/
├── parser.js      — source (UMD, browser + Node)
├── demo.html      — interactive demo
└── nmp/
    ├── index.js   — standalone npm package entry
    ├── package.json
    ├── usage.js   — Node.js usage examples
    └── README.md
```

---

## Browser Usage

```html
<script src="parser.js"></script>
<script>
  const layers = BoxShadowParser.parse('4px 4px 10px rgba(0,0,0,0.4)');
  console.log(layers);
</script>
```

---

## Node.js Usage

```js
const { parse, parseSingle, split } = require('./nmp/index');

const layers = parse('4px 4px 10px rgba(0,0,0,0.4)');
console.log(layers);
```

---

## API

### `parse(shadow)` → `BoxShadowLayer[]`

Parses a full `box-shadow` value. Also accepts complete CSS declarations.

```js
parse('0 2px 8px rgba(0,0,0,0.3)')
parse('box-shadow: inset 0 2px 4px rgba(0,0,0,.24);')
parse('0 1px 2px #0002, 0 4px 8px #0002')   // multi-layer
parse('none')                                 // → []
```

### `parseSingle(token)` → `BoxShadowLayer | null`

Parses a single shadow token (no commas).

```js
parseSingle('inset 0 2px 4px coral')
```

### `split(shadow)` → `string[]`

Splits a compound value into individual tokens without parsing.

```js
split('4px 4px 0 red, inset 0 0 10px rgba(0,0,0,.5)')
// → ['4px 4px 0 red', 'inset 0 0 10px rgba(0,0,0,.5)']
```

---

## Return Type

Each layer is a `BoxShadowLayer` object:

| Property | Type      | Description                              |
|----------|-----------|------------------------------------------|
| `inset`  | `boolean` | `true` if the shadow uses `inset`        |
| `x`      | `number`  | Horizontal offset in px                  |
| `y`      | `number`  | Vertical offset in px                    |
| `blur`   | `number`  | Blur radius in px                        |
| `spread` | `number`  | Spread radius in px (can be negative)    |
| `color`  | `string`  | Original CSS color token                 |
| `alpha`  | `number`  | Opacity 0–1 (extracted from color)       |
| `hex`    | `string`  | Resolved 6-digit hex (e.g. `#663399`)    |

---

## Examples

```js
// Simple shadow
parse('4px 4px 10px rgba(0,0,0,0.4)')
// [{ inset:false, x:4, y:4, blur:10, spread:0, color:'rgba(0,0,0,0.4)', alpha:0.4, hex:'#000000' }]

// Named color
parse('0 0 28px 6px rebeccapurple')
// [{ inset:false, x:0, y:0, blur:28, spread:6, color:'rebeccapurple', alpha:1, hex:'#663399' }]

// 8-digit hex with alpha
parse('0 8px 24px #00000066')
// [{ inset:false, x:0, y:8, blur:24, spread:0, color:'#00000066', alpha:0.4, hex:'#000000' }]

// Transparent
parse('0 4px 8px transparent')
// [{ inset:false, x:0, y:4, blur:8, spread:0, color:'transparent', alpha:0, hex:'#000000' }]

// CSS keyword → empty
parse('none')    // []
parse('initial') // []
```

---

## Demo

Open `demo.html` in your browser to interactively test any box-shadow value.

---

## License

MIT
