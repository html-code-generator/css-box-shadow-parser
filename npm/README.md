# css-box-shadow-parser

Parse any CSS `box-shadow` value into structured JavaScript objects.  
Works in **Node.js** and the **browser**. Zero dependencies.

---

## Install

```bash
npm install css-box-shadow-parser
```

**CDN (browser)**

```html
<script src="https://unpkg.com/css-box-shadow-parser"></script>
<script>
  const layers = BoxShadowParser.parse('4px 4px 10px rgba(0,0,0,0.4)');
</script>
```

---

## Usage

```js
const { parse, parseSingle, split } = require('css-box-shadow-parser');

// Single layer
parse('4px 4px 10px rgba(0,0,0,0.4)');

// Multi-layer
parse('0 1px 2px #0002, 0 4px 8px #0002');

// Full CSS declaration - strips "box-shadow:" and ";" automatically
parse('box-shadow: inset 0 2px 4px rgba(0,0,0,.24);');

// CSS keyword -> empty array
parse('none'); // []
```

---

## API

### `parse(shadow)` -> `BoxShadowLayer[]`

Parses a full `box-shadow` value (single or multi-layer).  
Accepts raw values **or** complete CSS declarations.

### `parseSingle(token)` -> `BoxShadowLayer | null`

Parses a single shadow token. Returns `null` for invalid input.

### `split(shadow)` -> `string[]`

Splits a compound value on top-level commas without parsing.  
Commas inside `rgba()`, `hsl()` etc. are correctly ignored.

---

## Return Type - `BoxShadowLayer`

```ts
{
  inset:  boolean  // true if shadow uses `inset`
  x:      number   // horizontal offset (px)
  y:      number   // vertical offset (px)
  blur:   number   // blur radius (px)
  spread: number   // spread radius (px, can be negative)
  color:  string   // original CSS color token
  alpha:  number   // opacity 0-1
  hex:    string   // resolved 6-digit hex
}
```

---

## Examples

```js
const { parse } = require('css-box-shadow-parser');

// Named color -> hex resolved
parse('0 0 28px 6px rebeccapurple')
// [{
//   inset: false, x: 0, y: 0, blur: 28, spread: 6,
//   color: 'rebeccapurple', alpha: 1, hex: '#663399'
// }]

// 8-digit hex - alpha extracted
parse('0 8px 24px #00000066')
// [{
//   inset: false, x: 0, y: 8, blur: 24, spread: 0,
//   color: '#00000066', alpha: 0.4, hex: '#000000'
// }]

// HSL color
parse('0 6px 20px hsl(270 80% 50% / 0.6)')
// [{
//   inset: false, x: 0, y: 6, blur: 20, spread: 0,
//   color: 'hsl(270 80% 50% / 0.6)', alpha: 0.6, hex: '#8019e6'
// }]

// Transparent (alpha = 0)
parse('0 4px 8px transparent')
// [{
//   inset: false, x: 0, y: 4, blur: 8, spread: 0,
//   color: 'transparent', alpha: 0, hex: '#000000'
// }]

// Inset
parse('inset 0 2px 4px rgba(0,0,0,0.24)')
// [{
//   inset: true, x: 0, y: 2, blur: 4, spread: 0,
//   color: 'rgba(0,0,0,0.24)', alpha: 0.24, hex: '#000000'
// }]

// Neumorphic - two layers
parse('6px 6px 12px #b8b9be, -6px -6px 12px #ffffff')
// [
//   { inset: false, x:  6, y:  6, blur: 12, spread: 0, color: '#b8b9be', alpha: 1, hex: '#b8b9be' },
//   { inset: false, x: -6, y: -6, blur: 12, spread: 0, color: '#ffffff', alpha: 1, hex: '#ffffff' }
// ]

// split only - no parsing
split('4px 4px 0 red, inset 0 0 10px rgba(0,0,0,.5)')
// ['4px 4px 0 red', 'inset 0 0 10px rgba(0,0,0,.5)']
```

---

## Supported Color Formats

| Format          | Example                        |
|-----------------|--------------------------------|
| 3-digit hex     | `#f00`                         |
| 4-digit hex     | `#f00a`                        |
| 6-digit hex     | `#ff0000`                      |
| 8-digit hex     | `#ff000066`                    |
| `rgb()`         | `rgb(255,0,0)`                 |
| `rgba()`        | `rgba(0,0,0,0.5)`              |
| `hsl()`         | `hsl(270 80% 50%)`             |
| `hsla()`        | `hsla(270,80%,50%,0.6)`        |
| Named color     | `rebeccapurple`, `coral`, etc. |
| `transparent`   | alpha = 0                      |
| `currentcolor`  | resolves to `#000000`          |

---

## License

MIT
