// Genererer site/data.js med opskrifter, omvendt indeks og danske navne
const fs = require('fs');
const md = require('minecraft-data')('1.21.11');
const da = JSON.parse(fs.readFileSync('da_dk.json', 'utf8'));

const items = {};
const TEX = new Set([
  ...JSON.parse(fs.readFileSync('item_list.json')).files.map(f => 'item/' + f.replace('.png', '')),
  ...JSON.parse(fs.readFileSync('block_list.json')).files.map(f => 'block/' + f.replace('.png', ''))]);
const SPECIAL = { snow_block: 'block/snow', magma_block: 'block/magma', dried_kelp_block: 'block/dried_kelp_top',
  sticky_piston: 'block/piston_top_sticky', light_weighted_pressure_plate: 'block/gold_block',
  heavy_weighted_pressure_plate: 'block/iron_block', moss_carpet: 'block/moss_block', compass: 'item/compass_00',
  recovery_compass: 'item/recovery_compass_00', clock: 'item/clock_00', smooth_quartz: 'block/quartz_block_bottom',
  crossbow: 'item/crossbow_standby', enchanted_golden_apple: 'item/golden_apple' };
function tex(n) {
  if (SPECIAL[n]) return SPECIAL[n];
  n = n.replace(/_(bed|banner)$/, '_wool').replace(/^purpur_(stairs|slab)$/, 'purpur_block')
       .replace(/^smooth_(red_sandstone|sandstone)/, '$1_top').replace(/^smooth_quartz_/, 'quartz_block_bottom_');
  const tryN = b => ['item/' + b, 'block/' + b, 'block/' + b + '_front', 'block/' + b + '_side', 'block/' + b + '_top']
    .find(t => TEX.has(t));
  let t = tryN(n);
  if (t) return t;
  const b = n.replace(/_wood$/, '_log').replace(/_hyphae$/, '_stem').replace(/_carpet$/, '_wool')
    .replace(/_(stairs|slab|wall|fence_gate|fence|pressure_plate|button)$/, '');
  for (const c of [b, b + 's', b + '_planks', b.replace(/_brick$/, '_bricks'), b.replace(/^waxed_/, '')])
    if ((t = tryN(c))) return t;
  return null;
}
function use(id) {
  if (id == null) return null;
  const it = md.items[id] || md.blocks[id];
  if (!it) return null;
  if (!items[it.name]) {
    let dn = da['item.minecraft.' + it.name] || da['block.minecraft.' + it.name] || it.displayName;
    const m = it.name.match(/^(.+)_armor_trim_smithing_template$/);
    if (m && da['trim_pattern.minecraft.' + m[1]]) dn = da['trim_pattern.minecraft.' + m[1]];
    items[it.name] = { da: dn, en: it.displayName, t: tex(it.name) };
  }
  return it.name;
}

const recipes = []; // [result, count, grid(9)]
const seen = new Set();
for (const rs of Object.values(md.recipes)) {
  for (const r of rs) {
    const grid = Array(9).fill(null);
    if (r.inShape) {
      const rows = r.inShape;
      const h = rows.length, w = Math.max(...rows.map(x => x.length));
      const oy = h === 1 ? 1 : 0, ox = w === 1 ? 1 : 0; // centrér små opskrifter
      rows.forEach((row, y) => row.forEach((c, x) => { grid[(y + oy) * 3 + x + ox] = use(c); }));
    } else if (r.ingredients) {
      r.ingredients.forEach((c, i) => { if (i < 9) grid[i] = use(c); });
    } else continue;
    const res = use(r.result.id);
    if (!res || grid.every(g => !g)) continue;
    const key = res + '|' + grid.join(',');
    if (seen.has(key)) continue;
    seen.add(key);
    recipes.push([res, r.result.count || 1, grid]);
  }
}

// Træsorter: behold kun én variant (helst eg) af opskrifter der bare skifter træsort
const WOOD = /^(oak|spruce|birch|jungle|acacia|dark_oak|mangrove|cherry|pale_oak|bamboo|crimson|warped)_(planks|log|slab|stem)$/;
const bySig = new Map();
recipes.forEach(r => {
  const sig = r[0] + '|' + r[2].map(g => g && g.replace(WOOD, 'W_$2')).join(',');
  const prev = bySig.get(sig);
  const oak = r[2].some(g => g && /^oak_/.test(g));
  if (!prev || (oak && !prev[2].some(g => g && /^oak_/.test(g)))) bySig.set(sig, r);
});
recipes.length = 0; recipes.push(...bySig.values());

// omvendt indeks: ingrediens -> opskrift-numre (én pr. resultat)
const uses = {}, makes = {};
recipes.forEach((r, i) => {
  (makes[r[0]] = makes[r[0]] || []).push(i);
  for (const g of new Set(r[2].filter(Boolean))) {
    uses[g] = uses[g] || [];
    if (!uses[g].some(j => recipes[j][0] === r[0])) uses[g].push(i);
  }
});

// Brug i verden
const WORLD = require('./world.js');
const world = {};
const useName = n => use((md.itemsByName[n] || md.blocksByName[n] || {}).id);
const isPic = p => /^[a-z0-9_]+$/.test(p);
for (const it of md.itemsArray) {
  const list = [];
  for (const [re, us] of WORLD) if (re.test(it.name)) list.push(...us);
  if (md.foodsByName && md.foodsByName[it.name]) list.unshift([['😋'], 'Spis den', 'Eat it']);
  if (!list.length) continue;
  if (!useName(it.name)) continue;
  for (const u of list) for (const p of u[0]) if (isPic(p) && !useName(p)) console.log('ukendt billede', p, 'i', it.name);
  world[it.name] = list.map(([ps, d, e]) => [ps.filter(p => !isPic(p) || items[p]), d, e]);
}
const out = { items, recipes, uses, makes, world };
fs.mkdirSync('site', { recursive: true });
fs.writeFileSync('site/data.js', 'const MC=' + JSON.stringify(out) + ';');
const miss = Object.entries(items).filter(([k, v]) => !v.t).map(([k]) => k);
console.log('verden', Object.keys(world).length);
console.log('uden billede', miss.length, miss.slice(0, 40).join(' '));
console.log('items', Object.keys(items).length, 'recipes', recipes.length,
  'diamant-brug', uses.diamond.map(i => items[recipes[i][0]].da).join(', '));
