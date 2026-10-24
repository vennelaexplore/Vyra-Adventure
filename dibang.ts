/* Content for the 7 Lakes Summit Series Trek (Dibang Valley). Pure data: no React here. */

export const DIBANG_ID = 'dibang-7-lakes';
export const DIBANG_IMAGE = 'https://images.pexels.com/photos/8861271/pexels-photo-8861271.jpeg?auto=compress&cs=tinysrgb&w=1200';
export const PHONE = '7718840432';
export const WA_LINK = `https://wa.me/91${PHONE}?text=${encodeURIComponent(
  'Hi VYRA ADVENTURE, I would like to apply for the 7 Lakes Summit Series Trek (Dibang Valley). I can share my 5 km fitness proof.',
)}`;

export const LAKES = [
  { n: '1', name: 'Lake 1' },
  { n: '2', name: 'Emuh-ya', tag: 'Base camp' },
  { n: '3', name: 'Koyombo' },
  { n: '4', name: 'Dini', tag: 'Largest' },
  { n: '5', name: 'Che-ne', tag: 'Glowing' },
  { n: '6', name: 'Huhu Wuya' },
  { n: '7', name: 'Huhu Wuya' },
];


export type Day = {
  d: string; t: string; meta: [string, string][]; text?: string; bullets?: string[];
  alerts?: { kind: 'water' | 'bug'; text: string }[]; note?: string;
};

export const DAYS: Day[] = [
  {
    d: 'Day 0', t: 'Arrival in Anini and mandatory orientation',
    meta: [['Briefing', '6:30 PM, Brothers Homestay']],
    bullets: [
      'Meet your senior and assistant trek leaders over traditional hot tea.',
      'Layering masterclass: regulating heat in high humidity and sub-zero nights.',
      'Gear inspection and split: daypack versus 40L porter bag.',
      'Introduction to the customary laws and sacred environmental codes of the Idu Mishmi.',
    ],
    note: 'Stay: homestay in Anini (self-arranged / optional add-on).',
  },
  {
    d: 'Day 1', t: 'Anini → Emuli Village → Aniku Top campsite',
    meta: [['Drive', '45 min'], ['Trek', '4–5 hrs'], ['Gain', '~3,000 ft'], ['Trail starts', '6,200 ft']],
    text: 'After a 10:00 AM pickup in Anini, drive to Emuli, the trailhead. The climb begins at once towards Aniku Top (“grassland” in the Idu dialect). A sustained 3,000+ ft gain rewards you with views over the Mathu River Valley. Settle into pre-pitched tents and gather round the campfire.',
    alerts: [
      { kind: 'water', text: 'Carry at least 2 litres of water. There are no refill points along today’s ridge.' },
      { kind: 'bug', text: 'Keep repellent handy for Damdum, the local black flies.' },
    ],
  },
  {
    d: 'Day 2', t: 'Aniku campsite → Camp 2 (pine jungle)',
    meta: [['Trek', '5–6 hrs'], ['Camp', '11,000 ft'], ['Terrain', 'Rainforest, bamboo, pine']],
    text: 'Start at 7:00 AM into temperate rainforest: moss-laden trees, wild orchids and unusual fungi, then thin bamboo groves with cleared trails. Camp 2 sits under towering pines beside a freshwater stream.',
  },
  {
    d: 'Day 3', t: 'Camp 2 → Lake 1 → Main base camp (Lake 2 / Emuh-ya)',
    meta: [['Trek', '7–8 hrs'], ['Lake 1', '12,400 ft'], ['Base camp', '12,200 ft']],
    text: 'Climb from 7:00 AM, leaving the tree line for open rocky heights. Reach Lake 1 by midday to rest and photograph, then resume at 12:30 PM across boulder fields to Lake 2 (Emuh-ya). It is your base for the next three nights, with rustic wooden log cabins.',
  },
  {
    d: 'Day 4', t: 'Base camp → Lake 3 (Koyombo) & Lake 4 (Dini) → Base camp',
    meta: [['Trek', '~3 hrs'], ['Focus', 'Acclimatisation']],
    text: 'An easier day exploring two lakes near camp. Visit Lake 3 (Koyombo), then Lake 4 (Dini), the largest, deepest and most dramatic lake in the valley. Back at the cabins by early afternoon to rest for tomorrow’s pass.',
  },
  {
    d: 'Day 5', t: 'Summit day: Chene Pass → Lakes 5, 6 & 7 → Base camp',
    meta: [['Trek', '6–7 hrs'], ['Max', '14,000 ft'], ['Terrain', '40-min boulder section']],
    text: 'Trek to Lake 5 (Che-ne), the “mystical lake” of hunter legend. Ascend Chene Pass through an intense 40-minute boulder field (gumboots or high-traction footwear required), then cross to Lakes 6 and 7, together Huhu Wuya, the finale of the series. Pay respects to the mountain gods, then retrace to base camp before sunset.',
  },
  {
    d: 'Day 6', t: 'Main base camp → Camp 2',
    meta: [['Trek', '6 hrs'], ['Terrain', 'Rocky trail to pine forest']],
    text: 'Descend from Emuh-ya to the sheltered pine jungle of Camp 2 (11,000 ft). Celebrate the summit with guides, cook and porters round the evening campfire.',
  },
  {
    d: 'Day 7', t: 'Camp 2 → Emuli Village → Drive to Anini',
    meta: [['Descent', '6 hrs'], ['Drive', '45 min'], ['Arrive Anini', '4–5 PM']],
    text: 'Descend through bamboo jungle and Aniku grassland to Emuli, then transfer back to Anini. Finish with a debrief, feedback session and farewell dinner.',
  },
];


export const SEASONS = [
  { icon: '🌸', name: 'Flowering season', when: 'Mid-June to August', day: '20–25°C', night: '7–13°C', layers: '2 warm layers', tone: 'bg-emerald-50', text: 'Valleys burst with wild alpine blooms and lush green carpets. Mountain mists and light monsoon showers add an ethereal mood.' },
  { icon: '🍁', name: 'Golden autumn', when: 'Mid-Sept to mid-Oct', day: '15–20°C', night: '2–5°C', layers: '2 warm layers', tone: 'bg-amber-50', text: 'Monsoon fades and the views turn crystal clear. Meadows go golden-brown. Light early snow flurries are possible in October.' },
  { icon: '❄️', name: 'Early winter', when: 'Late Oct to 3rd week Nov', day: '14–18°C', night: '0–5°C', layers: '3 warm layers', tone: 'bg-sky-50', text: 'Crisp cloudless skies and glass-like lake reflections, with sub-zero nights. The trail closes after the 3rd week of November because heavy snow blocks the passes.' },
];

export const INCLUDED = [
  'Personal porter to carry your 40L rucksack (max 5–8 kg)',
  'Certified wilderness first-responder senior guide plus assistant guides',
  'Breakfast: chapati, dal, rice, veggies, bread',
  'Lunch and trail snacks: fresh fruit, energy bars, hot soup and tea at rest points',
  'Dinner: chicken, pork, paneer, eggs, dal, ghee',
  'Tents at Aniku and Camp 2; log cabins at main base camp',
  'Dedicated expedition cook and kitchen staff',
  'Ground transport: Anini to Emuli (Day 1) and back (Day 7)',
  'High-altitude rope setups, first-aid kit and emergency oxygen canisters',
];
export const EXCLUDED = [
  'Inner Line Permit (Indian nationals) or PAP (foreign nationals)',
  'Stays and meals in Anini before Day 1 and after Day 7',
  'Personal gear: gumboots, daypack, headlamp, thermals, trekking poles',
  'Travel from your home city to Anini and back',
  'Emergency evacuation costs and travel / medical insurance',
];

export const GEAR: { group: string; items: string[] }[] = [
  { group: 'Bags and footwear', items: [
    '40L soft rucksack with rain cover (no rigid trolley bags)',
    '15–20L daypack for water, rain shell, camera, snacks',
    'High-ankle trekking shoes, broken-in and water-resistant',
    'Knee-high gumboots: mandatory (about ₹450 at Anini Bazaar)',
    'Local bamboo walking stick, preferred over aluminium poles here',
  ] },
  { group: 'Layering and clothing', items: [
    '1 down jacket rated 0°C to −5°C, packable',
    '1 windcheater / wind jacket',
    '1 quality raincoat or hardshell (no loose ponchos: they snag on bamboo)',
    '2 quick-dry trekking T-shirts and 2 trekking pants / tights',
    '1 set of thermal inners (top and bottom)',
    '1 warm fleece pant for sleeping',
    '4 pairs of heavy woollen socks',
    'Gloves: light fleece (Jun–Sept) or insulated waterproof (Oct–Nov)',
    '1 wide-brim sun hat and 1 warm beanie',
  ] },
  { group: 'Toiletries and trail essentials', items: [
    'Insect repellent spray (Damdum flies)',
    'Sleeping bag liner',
    'LED headlamp with spare batteries',
    'High-SPF sunscreen and UV sunglasses',
    'Quick-dry camp towel and biodegradable toiletries',
    'Snack stash: dry fruits, nuts, dark chocolate, energy bars',
  ] },
];

export const ROUTE = [
  ['Day −2', 'Fly to Dibrugarh or Tezu, drive to Roing', 'Overnight in Roing'],
  ['Day −1', 'Drive Roing to Anini (about 5 hrs)', 'Pre-trek rest'],
  ['Day 0', 'Briefing day in Anini', ''],
  ['Days 1–7', 'The 7 Lakes Trek', ''],
  ['Day +1', 'Drive Anini to Roing', 'Overnight in Roing'],
  ['Day +2', 'Roing to Dibrugarh or Tezu, fly home', ''],
];

export const FAQS = [
  ['Is there mobile network or electricity on the trek?', 'No. Charging points are unavailable once you leave Emuli Village, so carry high-capacity power banks. Network exists only at two isolated vantage points: just after Camp 1 and at the Day 2 top ridge rest point. In Anini only prepaid Airtel (calling + 4G) and BSNL (calling only) work.'],
  ['Can beginners attempt this trek?', 'Beginners with high cardiovascular fitness who meet the 5 km in under 35 minutes criterion can complete it. Less experienced trekkers may choose the shorter option: camp at Base Camp (Lake 2) and explore Lakes 3 and 4 without the steep 14,000 ft Chene Pass on Day 5.'],
  ['What medical and emergency support is available?', 'Senior guides are trained in wilderness first aid and carry high-altitude first-aid kits and emergency oxygen. For serious emergencies, an Indian Army outpost near Camp 1 provides emergency medical support and evacuation assistance.'],
  ['Can I store extra luggage during the trek?', 'Yes. Extra luggage and city clothes can be left at your Anini homestay free of charge. Do not leave cash or expensive electronics in stored bags.'],
  ['Why gumboots instead of regular trekking shoes?', 'Trails switch quickly from rainforest mud and wet bamboo roots to slippery river boulders. Rubber gumboots grip wet rock, stay waterproof and stop Damdum and leech bites. Use trekking shoes on drier climbs and switch to gumboots for muddy, boulder-heavy sections.'],
];

export const ALT: { d: string; alt: number; label: string }[] = [
  { d: 'D1', alt: 9200, label: '≈9,200' }, { d: 'D2', alt: 11000, label: '11,000' }, { d: 'D3', alt: 12200, label: '12,200' },
  { d: 'D4', alt: 12200, label: '12,200' }, { d: 'D5', alt: 12200, label: '12,200' }, { d: 'D6', alt: 11000, label: '11,000' },
  { d: 'D7', alt: 6200, label: '6,200' },
];
