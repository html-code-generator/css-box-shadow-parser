const { parse, parseSingle, split } = require('./index');

// ── Utility ───────────────────────────────────────────────────────────────────

const hr  = (label) => console.log(`\n${'─'.repeat(50)}\n  ${label}\n${'─'.repeat(50)}`);
const out = (value)  => console.log(JSON.stringify(value, null, 2));

// ── 1. Simple shadow ──────────────────────────────────────────────────────────

hr('1. Simple shadow');
out(parse('4px 4px 10px rgba(0,0,0,0.4)'));

// ── 2. Full CSS declaration (box-shadow: ...;) ────────────────────────────────

hr('2. Full CSS declaration');
out(parse('box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.24);'));

// ── 3. Multi-layer shadow ─────────────────────────────────────────────────────

hr('3. Multi-layer shadow');
out(parse('0 1px 2px rgba(0,0,0,.07), 0 4px 8px rgba(0,0,0,.07), 0 12px 24px rgba(0,0,0,.07)'));

// ── 4. Inset shadow ───────────────────────────────────────────────────────────

hr('4. Inset shadow');
out(parse('inset 0 0 10px -3px rgba(0,0,0,0.5)'));

// ── 5. Named color ────────────────────────────────────────────────────────────

hr('5. Named color');
out(parse('0 0 28px 6px rebeccapurple'));

// ── 6. Hex alpha (#rrggbbaa) ──────────────────────────────────────────────────

hr('6. 8-digit hex with alpha');
out(parse('0 8px 24px #00000066'));

// ── 7. HSL color ──────────────────────────────────────────────────────────────

hr('7. HSL color');
out(parse('0 6px 20px hsl(270 80% 50% / 0.6)'));

// ── 8. Transparent color ──────────────────────────────────────────────────────

hr('8. Transparent (alpha = 0)');
out(parse('0 4px 8px transparent'));

// ── 9. CSS keywords → empty array ────────────────────────────────────────────

hr('9. CSS keyword values → []');
console.log('none    →', parse('none'));
console.log('initial →', parse('initial'));
console.log('unset   →', parse('unset'));

// ── 10. parseSingle ───────────────────────────────────────────────────────────

hr('10. parseSingle — one token only');
out(parseSingle('6px 6px 0 #1a1a2e'));

// ── 11. split — tokenise without parsing ─────────────────────────────────────

hr('11. split — tokenise compound value');
const tokens = split('4px 4px 0 red, inset 0 0 10px rgba(0,0,0,.5)');
tokens.forEach((t, i) => console.log(`  [${i}] ${t}`));

// ── 12. Neumorphic (inset + outer) ────────────────────────────────────────────

hr('12. Neumorphic raised');
out(parse('6px 6px 12px #b8b9be, -6px -6px 12px #ffffff'));

// ── 13. Neon glow (3 layers, same color) ─────────────────────────────────────

hr('13. Neon glow');
out(parse('0 0 8px #0ff, 0 0 20px #0ff, 0 0 40px #0ff'));
