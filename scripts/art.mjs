// Genera le illustrazioni SVG del gioco (public/assets/art/*.svg).
// Tutta la grafica è originale, disegnata in codice con i colori del brand ApiPRO.
// Uso: node scripts/art.mjs
import { mkdirSync, writeFileSync } from 'node:fs'

const OUT = new URL('../public/assets/art/', import.meta.url)
mkdirSync(OUT, { recursive: true })
const save = (name, w, h, body, defs = '') =>
  writeFileSync(new URL(name + '.svg', OUT),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`)

const C = { green: '#363d2d', greenD: '#262c1f', honey: '#d2893c', gold: '#f2b632', sun: '#f6c745', cream: '#faf7f1', brown: '#5e4a33', taupe: '#8f7f6a' }

// ---------- Ape protagonista (senza ali: le ali sono sprite separati per animarle) ----------
save('bee', 220, 170, `
  <path d="M30 96 l-22 6 l22 6z" fill="${C.greenD}"/>
  <g>
    <ellipse cx="96" cy="100" rx="70" ry="52" fill="url(#body)"/>
    <clipPath id="bc"><ellipse cx="96" cy="100" rx="70" ry="52"/></clipPath>
    <g clip-path="url(#bc)" fill="${C.green}">
      <path d="M58 40 q-14 60 0 120 h20 q-14 -60 0 -120z"/>
      <path d="M98 40 q-14 60 0 120 h20 q-14 -60 0 -120z"/>
    </g>
    <ellipse cx="80" cy="74" rx="34" ry="12" fill="#fff" opacity=".35"/>
  </g>
  <circle cx="160" cy="86" r="42" fill="url(#head)"/>
  <path d="M150 50 q-6 -30 -22 -36" stroke="${C.green}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M172 48 q8 -30 26 -34" stroke="${C.green}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="127" cy="14" r="8" fill="${C.honey}"/><circle cx="199" cy="14" r="8" fill="${C.honey}"/>
  <ellipse cx="170" cy="80" rx="14" ry="17" fill="#fff"/>
  <circle cx="174" cy="82" r="9" fill="${C.greenD}"/><circle cx="177" cy="78" r="3.5" fill="#fff"/>
  <ellipse cx="146" cy="80" rx="11" ry="14" fill="#fff"/>
  <circle cx="149" cy="82" r="7" fill="${C.greenD}"/><circle cx="151" cy="79" r="2.8" fill="#fff"/>
  <ellipse cx="186" cy="102" rx="9" ry="6" fill="#ef8f7a" opacity=".7"/>
  <ellipse cx="140" cy="104" rx="7" ry="5" fill="#ef8f7a" opacity=".6"/>
  <path d="M156 106 q10 10 22 0" stroke="${C.greenD}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g stroke="${C.green}" stroke-width="5" stroke-linecap="round" fill="none">
    <path d="M80 148 q-4 10 -12 14"/><path d="M104 150 q0 10 -6 16"/><path d="M126 144 q4 10 0 18"/>
  </g>`,
  `<radialGradient id="body" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffd76a"/><stop offset="1" stop-color="${C.gold}"/></radialGradient>
   <radialGradient id="head" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffd76a"/><stop offset="1" stop-color="#eaa630"/></radialGradient>`)

save('wing', 120, 80, `<ellipse cx="60" cy="40" rx="54" ry="32" fill="url(#w)" stroke="#9ec6dd" stroke-width="4"/>
  <path d="M20 44 q40 -16 84 -6" stroke="#b9dbec" stroke-width="3" fill="none"/>`,
  `<linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#cfe9f6" stop-opacity=".75"/></linearGradient>`)

// ---------- Calabrone asiatico (Vespa velutina): scuro con fascia arancione, simpatico ma "dispettoso" ----------
save('hornet', 240, 180, `
  <path d="M26 104 l-24 6 l24 6z" fill="#1c1c1c"/>
  <ellipse cx="96" cy="108" rx="74" ry="50" fill="#2d2622"/>
  <clipPath id="hc"><ellipse cx="96" cy="108" rx="74" ry="50"/></clipPath>
  <g clip-path="url(#hc)"><rect x="40" y="40" width="30" height="140" fill="#e8892b"/><rect x="88" y="40" width="10" height="140" fill="#e8892b" opacity=".8"/></g>
  <ellipse cx="80" cy="84" rx="30" ry="10" fill="#fff" opacity=".18"/>
  <circle cx="172" cy="92" r="44" fill="#e8892b"/>
  <path d="M160 52 q-10 -26 -26 -30 M186 52 q8 -26 26 -30" stroke="#2d2622" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="182" cy="86" rx="15" ry="14" fill="#fff"/><circle cx="186" cy="89" r="8" fill="#1c1c1c"/><circle cx="189" cy="85" r="3" fill="#fff"/>
  <ellipse cx="156" cy="86" rx="12" ry="11" fill="#fff"/><circle cx="159" cy="89" r="6.5" fill="#1c1c1c"/><circle cx="161" cy="85" r="2.5" fill="#fff"/>
  <path d="M142 70 l26 8 M196 70 l-18 8" stroke="#1c1c1c" stroke-width="6" stroke-linecap="round"/>
  <path d="M164 114 q12 -6 24 0" stroke="#1c1c1c" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g stroke="#2d2622" stroke-width="6" stroke-linecap="round" fill="none"><path d="M78 154 q-4 10 -12 14"/><path d="M104 156 q0 10 -6 16"/><path d="M128 150 q4 10 0 18"/></g>`)

// ---------- Arnia (in legno, colori del brand, con il simbolo a petali del logo) ----------
save('hive', 260, 280, `
  <rect x="34" y="250" width="192" height="22" rx="6" fill="${C.brown}"/>
  <rect x="50" y="260" width="16" height="20" fill="${C.greenD}"/><rect x="194" y="260" width="16" height="20" fill="${C.greenD}"/>
  <rect x="40" y="150" width="180" height="100" rx="8" fill="url(#wood1)" stroke="${C.brown}" stroke-width="5"/>
  <rect x="40" y="70" width="180" height="84" rx="8" fill="url(#wood2)" stroke="${C.brown}" stroke-width="5"/>
  <path d="M22 76 L130 16 L238 76 Z" fill="${C.green}" stroke="${C.greenD}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M40 76 L130 26 L220 76" stroke="#4d5640" stroke-width="5" fill="none"/>
  <rect x="86" y="222" width="88" height="18" rx="9" fill="#2a2016"/>
  <rect x="60" y="244" width="140" height="8" rx="4" fill="#c79a5b"/>
  <g stroke="#b88a4f" stroke-width="2" opacity=".6"><path d="M50 180 h160 M50 205 h160 M50 100 h160 M50 125 h160"/></g>`,
  `<linearGradient id="wood1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d39a"/><stop offset="1" stop-color="#e2b46e"/></linearGradient>
   <linearGradient id="wood2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7dfae"/><stop offset="1" stop-color="#e8c27f"/></linearGradient>`)

// ---------- Elementi vari ----------
save('cloud', 300, 140, `<g fill="#fff"><ellipse cx="90" cy="90" rx="70" ry="42"/><ellipse cx="160" cy="70" rx="72" ry="58"/><ellipse cx="225" cy="92" rx="60" ry="38"/><rect x="40" y="90" width="230" height="40" rx="20"/></g>`)
save('smog', 220, 160, `<g fill="#9aa37e" opacity=".9"><circle cx="70" cy="90" r="50"/><circle cx="120" cy="66" r="56"/><circle cx="160" cy="98" r="46"/><circle cx="110" cy="110" r="44"/></g>
  <g fill="#7d865f" opacity=".5"><circle cx="96" cy="84" r="9"/><circle cx="140" cy="96" r="7"/><circle cx="120" cy="60" r="6"/></g>
  <path d="M84 100 l10 -8 l10 8 M126 100 l10 -8 l10 8" stroke="#4f5638" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M104 126 q14 -10 28 0" stroke="#4f5638" stroke-width="5" fill="none" stroke-linecap="round"/>`)
save('drop', 48, 60, `<path d="M24 4 C24 4 6 28 6 40 a18 18 0 0 0 36 0 C42 28 24 4 24 4z" fill="url(#d)" stroke="#b56a1f" stroke-width="3"/><ellipse cx="17" cy="38" rx="4" ry="7" fill="#fff" opacity=".7"/>`,
  `<linearGradient id="d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd36b"/><stop offset="1" stop-color="${C.honey}"/></linearGradient>`)
save('dropEmpty', 48, 60, `<path d="M24 4 C24 4 6 28 6 40 a18 18 0 0 0 36 0 C42 28 24 4 24 4z" fill="#ffffff" fill-opacity=".55" stroke="#b56a1f" stroke-width="3" stroke-dasharray="5 4"/>`)
save('star', 120, 120, `<path d="M60 6 l16 34 l38 4 l-28 26 l8 38 l-34 -20 l-34 20 l8 -38 l-28 -26 l38 -4z" fill="url(#s)" stroke="#c77d1c" stroke-width="5" stroke-linejoin="round"/><path d="M44 40 l10 -4" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/>`,
  `<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="1" stop-color="${C.gold}"/></linearGradient>`)
save('starEmpty', 120, 120, `<path d="M60 6 l16 34 l38 4 l-28 26 l8 38 l-34 -20 l-34 20 l8 -38 l-28 -26 l38 -4z" fill="#e9e1cf" stroke="#c9bb9e" stroke-width="5" stroke-linejoin="round"/>`)
save('jar', 140, 170, `
  <rect x="34" y="8" width="72" height="24" rx="6" fill="${C.green}"/>
  <path d="M26 40 q-8 0 -8 14 v86 q0 22 22 22 h60 q22 0 22 -22 v-86 q0 -14 -8 -14z" fill="#fff" fill-opacity=".5" stroke="#b56a1f" stroke-width="5"/>
  <rect x="30" y="32" width="80" height="12" rx="4" fill="${C.honey}"/>`)
save('sun', 200, 200, `<g fill="#ffe08a" opacity=".55">${Array.from({ length: 12 }, (_, i) => `<path d="M100 100 L92 6 L108 6Z" transform="rotate(${i * 30} 100 100)"/>`).join('')}</g><circle cx="100" cy="100" r="54" fill="url(#sg)"/>`,
  `<radialGradient id="sg"><stop offset="0" stop-color="#fff3b8"/><stop offset="1" stop-color="${C.sun}"/></radialGradient>`)
save('spark', 32, 32, `<path d="M16 0 L19 13 L32 16 L19 19 L16 32 L13 19 L0 16 L13 13Z" fill="#fff"/>`)
save('pollen', 16, 16, `<circle cx="8" cy="8" r="6" fill="#ffd54a"/><circle cx="6" cy="6" r="2" fill="#fff" opacity=".8"/>`)
save('petal', 24, 36, `<ellipse cx="12" cy="18" rx="9" ry="16" fill="#fff"/>`)
save('tuft', 160, 90, `<g fill="url(#g)">${[[10, 90, 30, 10], [30, 90, 50, 0], [50, 90, 58, 20], [70, 90, 82, 4], [90, 90, 96, 18], [110, 90, 124, 2], [130, 90, 140, 16], [146, 90, 156, 30]]
  .map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1} Q${x2 - 6} ${(y1 + y2) / 2} ${x2} ${y2} Q${x2 + 4} ${(y1 + y2) / 2} ${x1 + 14} ${y1}Z"/>`).join('')}</g>`,
  `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc25a"/><stop offset="1" stop-color="#4f7a2e"/></linearGradient>`)
save('bud', 80, 100, `<ellipse cx="40" cy="44" rx="22" ry="34" fill="#7fae4a"/><path d="M40 10 q-16 30 0 70 q16 -40 0 -70z" fill="#a6cf6a"/><path d="M20 76 q20 -14 40 0" stroke="#5c8a33" stroke-width="5" fill="none"/>`)
save('btn', 360, 120, `<rect x="6" y="14" width="348" height="100" rx="50" fill="#a9661f"/><rect x="6" y="4" width="348" height="100" rx="50" fill="url(#b)"/><rect x="40" y="16" width="200" height="20" rx="10" fill="#fff" opacity=".35"/>`,
  `<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2b54f"/><stop offset="1" stop-color="${C.honey}"/></linearGradient>`)
save('btnGreen', 360, 120, `<rect x="6" y="14" width="348" height="100" rx="50" fill="${C.greenD}"/><rect x="6" y="4" width="348" height="100" rx="50" fill="url(#b)"/><rect x="40" y="16" width="200" height="20" rx="10" fill="#fff" opacity=".18"/>`,
  `<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#55603f"/><stop offset="1" stop-color="${C.green}"/></linearGradient>`)
save('round', 96, 100, `<circle cx="48" cy="54" r="42" fill="${C.greenD}" opacity=".9"/><circle cx="48" cy="48" r="42" fill="#fff"/><circle cx="48" cy="48" r="36" fill="${C.cream}"/>`)
save('icoPause', 48, 48, `<rect x="10" y="8" width="10" height="32" rx="4" fill="${C.green}"/><rect x="28" y="8" width="10" height="32" rx="4" fill="${C.green}"/>`)
save('icoSound', 48, 48, `<path d="M6 18 h10 l12 -10 v32 l-12 -10 h-10z" fill="${C.green}"/><path d="M33 16 q7 8 0 16 M38 10 q12 14 0 28" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/>`)
save('icoMute', 48, 48, `<path d="M6 18 h10 l12 -10 v32 l-12 -10 h-10z" fill="${C.green}"/><path d="M34 18 l10 12 M44 18 l-10 12" stroke="#b5462f" stroke-width="4" stroke-linecap="round"/>`)
save('icoHome', 48, 48, `<path d="M6 24 L24 8 L42 24" stroke="${C.green}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22 v18 h9 v-10 h6 v10 h9 v-18" fill="${C.green}"/>`)
save('hand', 90, 110, `<path d="M34 10 a8 8 0 0 1 16 0 v40 l4 -2 a8 8 0 0 1 10 6 l2 2 a8 8 0 0 1 12 6 v24 q0 22 -24 24 h-14 q-16 0 -24 -14 l-14 -26 a7 7 0 0 1 12 -8 l8 10 v-62z" fill="#ffe0c2" stroke="${C.greenD}" stroke-width="4" stroke-linejoin="round"/>`)

// ---------- Fiori delle 11 specie del protocollo ApiPRO (testa del fiore; lo stelo si disegna nel gioco) ----------
const petals = (cx, cy, r, n, rx, ry, fill, rot = 0, extra = '') =>
  Array.from({ length: n }, (_, i) => `<ellipse cx="${cx}" cy="${cy - r}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra} transform="rotate(${rot + i * 360 / n} ${cx} ${cy})"/>`).join('')
const dots = (cx, cy, r, n, col, s = 2.6) => Array.from({ length: n }, (_, i) => {
  const a = i * 2.39996, d = r * Math.sqrt((i + .5) / n); return `<circle cx="${(cx + d * Math.cos(a)).toFixed(1)}" cy="${(cy + d * Math.sin(a)).toFixed(1)}" r="${s}" fill="${col}"/>`
}).join('')
const grad = (id, a, b) => `<radialGradient id="${id}" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`

const F = {
  tarassaco: [petals(100, 100, 46, 26, 6, 26, '#f7c531', 0, 'stroke="#e0a410" stroke-width="1.5"') + petals(100, 100, 28, 18, 5, 18, '#ffd84d', 10) + `<circle cx="100" cy="100" r="16" fill="#f0b21a"/>`, ''],
  girasole: [petals(100, 100, 58, 22, 11, 30, 'url(#gp)', 0, 'stroke="#d99a00" stroke-width="2"') + `<circle cx="100" cy="100" r="40" fill="#6b4a1e"/>` + dots(100, 100, 34, 70, '#3f2a10', 2.4), grad('gp', '#ffd23f', '#f4a900')],
  colza: [[[70, 70], [120, 56], [140, 104], [92, 112], [60, 132], [118, 146], [100, 86]].map(([x, y]) => petals(x, y, 11, 4, 10, 12, '#f5d332', 45, 'stroke="#d9b417" stroke-width="1.5"') + `<circle cx="${x}" cy="${y}" r="5" fill="#e0a410"/>`).join(''), ''],
  robinia: [`<path d="M100 20 q6 80 -4 170" stroke="#6f8a3a" stroke-width="5" fill="none"/>` + [[100, 40], [82, 62], [118, 66], [86, 92], [116, 98], [90, 124], [112, 132], [98, 160]].map(([x, y]) => `<path d="M${x - 16} ${y} q16 -22 32 0 q-6 14 -16 16 q-10 -2 -16 -16z" fill="#fffef6" stroke="#cfd8b2" stroke-width="2.5"/><ellipse cx="${x}" cy="${y + 6}" rx="5" ry="4" fill="#f4e9a0"/>`).join(''), ''],
  castagno: [`<path d="M40 170 Q100 120 170 30" stroke="#7a6a3a" stroke-width="6" fill="none"/>` + [[56, 146, -60], [80, 118, -50], [104, 92, -45], [130, 66, -40], [150, 46, -35], [70, 160, -20], [120, 110, -10]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="34" fill="url(#cg)" transform="rotate(${r} ${x} ${y})"/>` + dots(x, y, 8, 6, '#fff3b0', 1.8)).join(''), grad('cg', '#f4dd78', '#d2ad3a')],
  tiglio: [`<path d="M70 30 q50 10 70 70 q-60 -10 -70 -70z" fill="#d7e5a8" stroke="#a9bd6c" stroke-width="3"/>` + [[90, 120], [120, 132], [104, 158], [76, 150], [132, 104]].map(([x, y]) => petals(x, y, 10, 5, 7, 11, '#f6eb98', 0, 'stroke="#d8c25a" stroke-width="1.5"') + dots(x, y, 5, 7, '#c8a52a', 1.6)).join('') + `<path d="M100 80 q4 40 -10 60 M100 80 q20 30 20 50" stroke="#9aaa5a" stroke-width="3" fill="none"/>`, ''],
  amorfa: [[[84, 0], [110, 10]].map(([x, o]) => `<rect x="${x - 12}" y="${30 + o}" width="24" height="140" rx="12" fill="url(#ag)"/>` + Array.from({ length: 12 }, (_, i) => `<circle cx="${x + (i % 2 ? 8 : -8)}" cy="${44 + o + i * 10}" r="3.4" fill="#f0a63a"/>`).join('')).join(''), `<linearGradient id="ag" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6a3f8e"/><stop offset=".5" stop-color="#9364b8"/><stop offset="1" stop-color="#6a3f8e"/></linearGradient>`],
  edera: [Array.from({ length: 3 }, (_, k) => { const cx = [70, 130, 100][k], cy = [80, 84, 130][k]; return Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; const x = cx + 24 * Math.cos(a), y = cy + 24 * Math.sin(a); return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#7e8a3a" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="7" fill="#c3cf6e" stroke="#8d9a3e" stroke-width="2"/><circle cx="${x}" cy="${y}" r="2.5" fill="#f2e07a"/>` }).join('') }).join(''), ''],
  rododendro: [[[100, 70, 0], [70, 104, -40], [130, 104, 40], [86, 140, -15], [118, 140, 15]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})">${petals(x, y, 13, 5, 11, 15, 'url(#rg)', 0, 'stroke="#b83a62" stroke-width="2"')}<circle cx="${x}" cy="${y}" r="5" fill="#fbe3ea"/><path d="M${x} ${y} l-6 -18 M${x} ${y} l6 -18" stroke="#8c2747" stroke-width="2"/></g>`).join(''), grad('rg', '#f6a6bf', '#e0628a')],
  limonio: [`<path d="M100 190 L100 110 M100 120 L60 60 M100 120 L140 60 M100 150 L50 110 M100 150 L150 110 M100 110 L100 40" stroke="#6f7f5a" stroke-width="4" fill="none"/>` + [[100, 40], [60, 60], [140, 60], [50, 110], [150, 110], [80, 84], [120, 84], [100, 74]].map(([x, y]) => petals(x, y, 6, 5, 5, 6, '#b3a6e0', 0, 'stroke="#7a6bb0" stroke-width="1.2"') + `<circle cx="${x}" cy="${y}" r="2.2" fill="#fff"/>`).join(''), ''],
  astro_marino: [[[72, 80, 1], [132, 92, .9], [100, 138, .8]].map(([x, y, s]) => petals(x, y, 22 * s, 20, 4.5 * s, 15 * s, '#c3b3ea', 0, 'stroke="#9a86d0" stroke-width="1.2"') + `<circle cx="${x}" cy="${y}" r="${12 * s}" fill="#efb42e"/>` + dots(x, y, 9 * s, 12, '#c98a10', 1.4)).join(''), '']
}
for (const [id, [body, defs]] of Object.entries(F)) save('fl_' + id, 200, 200, body, defs)
console.log('Illustrazioni generate:', Object.keys(F).length, 'fiori + personaggi e interfaccia')
