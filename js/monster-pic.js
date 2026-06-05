/* monster-pic.js — PromptForge Picture Prompt Generator */
'use strict';

const OPTIONS = {
  subject: [
    '— choose subject —',
    'young woman', 'young man', 'teenage girl', 'teenage boy',
    'elderly woman', 'elderly man', 'child', 'toddler',
    'warrior princess', 'cyberpunk hacker', 'fantasy mage', 'dark sorcerer',
    'astronaut', 'samurai', 'medieval knight', 'viking raider',
    'Victorian detective', 'steampunk inventor', 'futuristic soldier',
    'ballet dancer', 'street musician', 'graffiti artist', 'street photographer',
    'marine biologist', 'rogue scientist', 'time traveler',
    'fallen angel', 'forest spirit', 'sea witch', 'demon hunter',
  ],
  pose: [
    '— choose pose —',
    'standing confidently', 'sitting cross-legged', 'crouching low',
    'kneeling on one knee', 'lying down relaxed', 'lying on side',
    'running at full speed', 'leaping mid-air', 'falling backwards',
    'dancing freely', 'mid-spin twirl', 'fighting stance',
    'arms crossed defiant', 'hands on hips', 'reaching outward',
    'looking over shoulder', 'back to camera', 'head tilted down',
    'dramatic cape sweep', 'weapon raised overhead',
    'curled up in shadow', 'suspended in zero gravity',
  ],
  angle: [
    '— choose angle —',
    'eye level neutral', 'low angle heroic shot', 'high angle overhead',
    'dutch tilt dramatic', "bird's eye view", "worm's eye view",
    'over-the-shoulder', 'profile silhouette', 'three-quarter turn',
    'extreme close-up face', 'close-up portrait', 'medium shot waist-up',
    'full body wide shot', 'extreme wide establishing', 'fisheye distortion',
  ],
  lighting: [
    '— choose lighting —',
    'golden hour warm glow', 'blue hour dusk', 'harsh midday sun',
    'overcast soft diffused', 'studio three-point softbox',
    'neon glow cyan-magenta', 'single candle rim light',
    'moonlight cold silver', 'fireplace amber flicker',
    'cinematic side light', 'split lighting half-face shadow',
    'backlight silhouette halo', 'bioluminescent underwater glow',
    'lightning strike flash', 'lava red underlighting',
    'infrared false color', 'volumetric fog shafts', 'rainbow prism refraction',
  ],
  vibe: [
    '— choose style/vibe —',
    'photorealistic 8K', 'cinematic dramatic film', 'anime cel-shaded',
    'Studio Ghibli painterly', 'manga ink lines', 'Pixar 3D render',
    'oil painting baroque', 'watercolor loose wash', 'gouache flat color',
    'charcoal sketch', 'pencil line art', 'pop art bold halftone',
    'noir black and white', 'fashion editorial gloss', 'vaporwave retro',
    'ukiyo-e woodblock print', 'art nouveau ornate', 'brutalist graphic',
    'surrealist dreamlike', 'hyperrealism macro', 'low poly geometric',
    'pixel art retro game', 'concept art matte painting',
  ],
  focus: [
    '— choose focal detail —',
    'facial micro-expression', 'intense eye contact', 'smirking lips',
    'hands in gesture', 'weapon grip detail', 'ornate costume embroidery',
    'tattoo or body art', 'hair in motion', 'sweat and grit texture',
    'lighting on skin', 'shadow drama on face', 'depth-of-field bokeh',
    'background environment mood', 'color palette harmony',
    'leading composition lines', 'rule-of-thirds framing',
  ],
  background: [
    '— choose background —',
    'minimalist pure white studio', 'clean black void',
    'neon-lit city street rain', 'cyberpunk alleyway steam',
    'ancient stone temple ruins', 'overgrown jungle pyramid',
    'futuristic white lab', 'abandoned industrial warehouse',
    'crystal cave bioluminescent', 'volcanic lava fields',
    'arctic tundra blizzard', 'snowy mountain peak',
    'cherry blossom Japanese garden', 'autumn forest golden leaves',
    'beach at sunset pink sky', 'ocean deep abyss',
    'alien planet twin moons', 'space nebula starfield',
    'fantasy floating island', 'medieval throne room',
    'cozy bookshop candlelight', 'rooftop city skyline night',
  ],
  nsfw: [
    'SFW — Safe for Work',
    'Suggestive — PG-13 (mild implied)',
    'Sensual — R (tasteful adult)',
    'Explicit — Adult only (18+)',
  ],
};

/* build prompt string from current select values */
function buildPrompt() {
  const parts = Object.keys(OPTIONS)
    .map(id => {
      const el = document.getElementById(id);
      if (!el || !el.value || el.value.startsWith('—')) return null;
      if (id === 'nsfw' && el.value.startsWith('SFW')) return null;
      return el.value;
    })
    .filter(Boolean);

  const watermarkEl = document.getElementById('watermark');
  const applyEl = document.getElementById('apply-watermark');
  if (applyEl && applyEl.checked && watermarkEl && watermarkEl.value.trim()) {
    parts.push(`watermark text "${watermarkEl.value.trim()}"`);
  }

  return parts.join(', ');
}

/* random-pick one option (skip placeholder) */
function randomPick(arr) {
  const pool = arr.filter(v => !v.startsWith('—'));
  return pool[Math.floor(Math.random() * pool.length)];
}

/* populate all selects */
function populateSelects() {
  Object.entries(OPTIONS).forEach(([id, opts]) => {
    const sel = document.getElementById(id);
    if (!sel) return;
    opts.forEach(opt => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      sel.appendChild(o);
    });
  });
}

/* roll random selections and output */
function reroll() {
  Object.keys(OPTIONS).forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.value = randomPick(OPTIONS[id]);
  });
  output();
}

/* write prompt to textarea */
function output() {
  const prompt = buildPrompt();
  const out = document.getElementById('pic-prompt-output');
  if (out) out.value = prompt || '>> Select options above to generate your prompt.';
  const msg = document.getElementById('reactive-msg');
  if (msg) msg.textContent = prompt
    ? '>> Prompt locked. Copy or reroll.'
    : '>> Visual node ready. Choose your elements.';
}

/* copy to clipboard */
function copyPrompt() {
  const out = document.getElementById('pic-prompt-output');
  if (!out || !out.value) return;
  navigator.clipboard.writeText(out.value).then(() => {
    const btn = document.getElementById('copy-prompt');
    if (btn) { btn.textContent = '✅ Copied!'; setTimeout(() => { btn.textContent = '📋 COPY'; }, 1500); }
  }).catch(() => {
    out.select();
    document.execCommand('copy');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  populateSelects();

  const status = document.getElementById('console-status');
  if (status) status.textContent = '>> Visual Grid Ready. Select & Generate.';

  /* wire change events on all selects */
  Object.keys(OPTIONS).forEach(id => {
    const sel = document.getElementById(id);
    if (sel) sel.addEventListener('change', output);
  });

  /* watermark checkbox + text */
  const wm = document.getElementById('watermark');
  const wmChk = document.getElementById('apply-watermark');
  if (wm) wm.addEventListener('input', output);
  if (wmChk) wmChk.addEventListener('change', output);

  /* buttons */
  const rerollBtn = document.getElementById('reroll-prompt');
  if (rerollBtn) rerollBtn.addEventListener('click', reroll);

  const copyBtn = document.getElementById('copy-prompt');
  if (copyBtn) copyBtn.addEventListener('click', copyPrompt);

  /* auto-reroll on first load for a nice starting state */
  reroll();
});
