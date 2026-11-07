// Crafting-opskrifter fra Mojangs officielle Bedrock-filer (Mojang/bedrock-samples, behavior_pack/recipes),
// oversat til moderne navne, så danske navne og billeder kan slås op.
const fs = require('fs');
const path = require('path');
const jv = require('minecraft-data')('1.21.11');
const exists = n => !!(jv.itemsByName[n] || jv.blocksByName[n]);
const DIR = process.env.BEDROCK_RECIPES || path.join(__dirname, 'bedrock-recipes');

const COLOR = ['white','orange','magenta','light_blue','yellow','lime','pink','gray','light_gray','cyan','purple','blue','brown','green','red','black'];
const WOOD6 = ['oak','spruce','birch','jungle','acacia','dark_oak'];
const META = { // gamle navne med "data"-tal
  wool: m => COLOR[m] + '_wool', carpet: m => COLOR[m] + '_carpet', stained_glass: m => COLOR[m] + '_stained_glass',
  stained_glass_pane: m => COLOR[m] + '_stained_glass_pane', concrete_powder: m => COLOR[m] + '_concrete_powder',
  concrete: m => COLOR[m] + '_concrete', stained_hardened_clay: m => COLOR[m] + '_terracotta', bed: m => COLOR[m] + '_bed',
  banner: m => COLOR[15 - m] + '_banner',
  dye: m => ['ink_sac','red_dye','green_dye','cocoa_beans','lapis_lazuli','purple_dye','cyan_dye','light_gray_dye','gray_dye','pink_dye',
             'lime_dye','yellow_dye','light_blue_dye','magenta_dye','orange_dye','bone_meal','black_dye','brown_dye','blue_dye','white_dye'][m],
  banner_pattern: m => ['creeper','skull','flower','mojang','field_masoned','bordure_indented'][m] + '_banner_pattern',
  chest_boat: m => ['oak','spruce','birch','jungle','acacia','dark_oak','mangrove'][m] + '_chest_boat',
  emptymap: () => 'map', boat: m => ['oak','spruce','birch','jungle','acacia','dark_oak','mangrove'][m] + '_boat',
  planks: m => WOOD6[m] + '_planks', wooden_slab: m => WOOD6[m] + '_slab', fence: m => WOOD6[m] + '_fence',
  wood: m => (m >= 8 ? 'stripped_' : '') + WOOD6[m % 8] + '_wood',
  log: m => ['oak','spruce','birch','jungle'][m] + '_log', log2: m => ['acacia','dark_oak'][m] + '_log',
  red_flower: m => ['poppy','blue_orchid','allium','azure_bluet','red_tulip','orange_tulip','white_tulip','pink_tulip','oxeye_daisy','cornflower','lily_of_the_valley'][m],
  double_plant: m => ['sunflower','lilac','tall_grass','large_fern','rose_bush','peony'][m],
  stone: m => ['stone','granite','polished_granite','diorite','polished_diorite','andesite','polished_andesite'][m],
  sand: m => ['sand','red_sand'][m],
  sandstone: m => ['sandstone','chiseled_sandstone','cut_sandstone','smooth_sandstone'][m],
  red_sandstone: m => ['red_sandstone','chiseled_red_sandstone','cut_red_sandstone','smooth_red_sandstone'][m],
  prismarine: m => ['prismarine','dark_prismarine','prismarine_bricks'][m],
  quartz_block: m => ['quartz_block','chiseled_quartz_block','quartz_pillar','smooth_quartz'][m],
  stonebrick: m => ['stone_bricks','mossy_stone_bricks','cracked_stone_bricks','chiseled_stone_bricks'][m],
  stone_block_slab: m => ['smooth_stone_slab','sandstone_slab','petrified_oak_slab','cobblestone_slab','brick_slab','stone_brick_slab','quartz_slab','nether_brick_slab'][m],
  stone_block_slab2: m => ['red_sandstone_slab','purpur_slab','prismarine_slab','dark_prismarine_slab','prismarine_brick_slab','mossy_cobblestone_slab','smooth_sandstone_slab','red_nether_brick_slab'][m],
  stone_block_slab3: m => ['end_stone_brick_slab','smooth_red_sandstone_slab','polished_andesite_slab','andesite_slab','diorite_slab','polished_diorite_slab','granite_slab','polished_granite_slab'][m],
  stone_block_slab4: m => ['mossy_stone_brick_slab','smooth_quartz_slab','stone_slab','cut_sandstone_slab','cut_red_sandstone_slab'][m],
  cobblestone_wall: m => ['cobblestone_wall','mossy_cobblestone_wall','granite_wall','diorite_wall','andesite_wall','sandstone_wall','brick_wall','stone_brick_wall','mossy_stone_brick_wall','nether_brick_wall','end_stone_brick_wall','prismarine_wall','red_sandstone_wall','red_nether_brick_wall'][m],
  skull: m => ['skeleton_skull','wither_skeleton_skull','zombie_head','player_head','creeper_head','dragon_head','piglin_head'][m],
  coal: m => ['coal','charcoal'][m], bucket: m => ({ 0: 'bucket', 1: 'milk_bucket', 8: 'water_bucket', 10: 'lava_bucket' })[m],
  arrow: m => m ? 'tipped_arrow' : 'arrow', lingering_potion: () => 'lingering_potion', potion: () => 'potion',
  firework_star: () => 'firework_star', suspicious_stew: () => 'suspicious_stew', empty_map: () => 'map',
  sponge: m => ['sponge','wet_sponge'][m], dirt: m => ['dirt','coarse_dirt'][m],
};
const RENAME = {
  brick_block: 'bricks', end_bricks: 'end_stone_bricks', end_brick_stairs: 'end_stone_brick_stairs', frame: 'item_frame',
  glow_frame: 'glow_item_frame', golden_rail: 'powered_rail', lit_pumpkin: 'jack_o_lantern', magma: 'magma_block',
  melon_block: 'melon', netherbrick: 'nether_brick', nether_brick: 'nether_bricks', red_nether_brick: 'red_nether_bricks',
  noteblock: 'note_block', normal_stone_stairs: 'stone_stairs', prismarine_bricks_stairs: 'prismarine_brick_stairs',
  slime: 'slime_block', snow: 'snow_block', snow_layer: 'snow', stonecutter_block: 'stonecutter', trapdoor: 'oak_trapdoor',
  undyed_shulker_box: 'shulker_box', waxed_copper: 'waxed_copper_block', web: 'cobweb', wooden_button: 'oak_button',
  wooden_door: 'oak_door', wooden_pressure_plate: 'oak_pressure_plate', fence_gate: 'oak_fence_gate', scute: 'turtle_scute',
  hardened_clay: 'terracotta', chain: 'iron_chain', yellow_flower: 'dandelion', reeds: 'sugar_cane',
  speckled_melon: 'glistering_melon_slice', fireball: 'fire_charge', fireworks: 'firework_rocket', carrotOnAStick: 'carrot_on_a_stick',
  appleEnchanted: 'enchanted_golden_apple', stone_stairs: 'cobblestone_stairs', grass: 'grass_block', tallgrass: 'short_grass',
  deadbush: 'dead_bush', waterlily: 'lily_pad', silver_glazed_terracotta: 'light_gray_glazed_terracotta',
  chorus_fruit_popped: 'popped_chorus_fruit', horsearmorleather: 'leather_horse_armor', mob_spawner: 'spawner',
  appleenchanted: 'enchanted_golden_apple', melon: 'melon_slice', unpowered_repeater: 'repeater', unpowered_comparator: 'comparator', lodestone_compass: null,
  carrotonastick: 'carrot_on_a_stick', darkoak_sign: 'dark_oak_sign', sign: 'oak_sign', netherstar: 'nether_star',
  sealantern: 'sea_lantern', record_5: 'music_disc_5', turtle_shell_piece: 'turtle_scute', normal_stone_slab: 'stone_slab',
};
const TAG = { planks: 'oak_planks', stone_tool_materials: 'cobblestone', wooden_slabs: 'oak_slab', coals: 'coal', logs: 'oak_log',
  egg: 'egg', soul_fire_base_blocks: 'soul_sand', stone_crafting_materials: 'cobblestone', wool: 'white_wool',
  metal_nuggets: 'iron_nugget', mushrooms_for_stew: 'brown_mushroom', logs_that_burn: 'oak_log' };

const unmapped = {};
function name(id, data) {
  if (id && typeof id === 'object') {
    if (id.tag) { const t = TAG[id.tag.replace('minecraft:', '')]; if (!t) unmapped['tag:' + id.tag] = 1; return t || null; }
    data = id.data; id = id.item;
  }
  if (typeof id !== 'string') return null;
  let [n, d] = id.replace(/^minecraft:/, '').split(':');
  if (d !== undefined) data = +d;
  let r;
  if (META[n] && (data !== undefined || !exists(n))) r = META[n](data || 0);
  else if (n in RENAME) r = RENAME[n];
  else r = n;
  if (!r || !exists(r)) { unmapped[n + ':' + (data ?? '-')] = 1; return null; }
  return r;
}

const recipes = [];
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  let d;
  try { d = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8').replace(/^﻿/, '').replace(/^\s*\/\/.*$/gm, '')); }
  catch (e) { console.error('kan ikke læse', f); continue; }
  const shaped = d['minecraft:recipe_shaped'], shapeless = d['minecraft:recipe_shapeless'];
  const r = shaped || shapeless;
  if (!r || !(r.tags || []).includes('crafting_table')) continue;
  const result = Array.isArray(r.result) ? r.result[0] : r.result;
  const fileName = f.replace(/\.json$/, '');
  let res = name(result);
  if ((!res || META[String(result.item).replace(/^minecraft:/, '').split(':')[0]]) && exists(fileName) && !META[fileName]) res = fileName;
  if (!res) continue;
  const grid = Array(9).fill(null);
  let ok = true;
  const usesTag = JSON.stringify(r.key || r.ingredients).includes('"tag"');
  if (shaped) {
    const pat = r.pattern, h = pat.length, w = Math.max(...pat.map(p => p.length));
    const ox = w === 1 ? 1 : 0, oy = h === 1 ? 1 : 0;
    pat.forEach((row, y) => [...row].forEach((ch, x) => {
      if (ch === ' ') return;
      const g = name(r.key[ch]);
      if (!g) ok = false;
      grid[(y + oy) * 3 + x + ox] = g;
    }));
  } else {
    let k = 0;
    for (const i of r.ingredients) {
      const g = name(i);
      if (!g) ok = false;
      for (let c = 0; c < (i.count || 1) && k < 9; c++) grid[k++] = g;
    }
  }
  if (!ok) continue;
  recipes.push({ result: res, count: result.count || 1, grid, file: f, usesTag });
}
module.exports = { recipes, unmapped, name, META };
if (require.main === module) {
  console.log('opskrifter', recipes.length, '\numappede:', Object.keys(unmapped).sort().join(' '));
  const show = n => recipes.filter(r => r.result === n).slice(0, 1).forEach(r =>
    console.log(n, r.count, [0, 3, 6].map(i => r.grid.slice(i, i + 3).map(g => g || '_').join(' ')).join(' / ')));
  ['diamond_pickaxe', 'bow', 'oak_fence', 'bowl', 'oak_slab', 'oak_door', 'black_carpet', 'white_banner', 'stick', 'torch',
   'white_bed', 'cake', 'saddle', 'mace', 'copper_pickaxe', 'cherry_planks', 'red_dye', 'book', 'flint_and_steel', 'spectral_arrow'].forEach(show);
}
