import { useState, type ReactNode } from 'react';
import { DIBANG_IMAGE, PHONE, WA_LINK, LAKES, SEASONS, GEAR, ROUTE, FAQS, ALT } from './components/dibang.ts';
import {
  Mountain, Calendar, Compass, MapPin, Check, ChevronDown, Phone, MessageCircle, Sparkles,
  Users, ArrowRight, Backpack, Plane, Train, Car, CircleHelp, Ruler, TriangleAlert, Activity,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Drop a real photo at /public/images/dibang-7-lakes.jpg.            */
/*  Until it exists, the illustration below is shown automatically.    */
/* ------------------------------------------------------------------ */
const FACTS = [
  { Icon: Calendar, label: 'Duration', value: '8 days', sub: 'Day 0 briefing + 7 trek days' },
  { Icon: Mountain, label: 'Max altitude', value: '14,000 ft', sub: 'Chene Pass' },
  { Icon: Ruler, label: 'Distance', value: '~40 km', sub: 'Avg. 6–7 km a day' },
  { Icon: Activity, label: 'Difficulty', value: 'Moderate–Difficult', sub: 'Steep daily climbs' },
  { Icon: MapPin, label: 'Starts / ends', value: 'Anini / Emuli', sub: 'Dibang Valley' },
  { Icon: Compass, label: 'Best season', value: 'Mid-Jun – Nov', sub: 'Closes 3rd week of Nov' },
];



/* ---------------- small building blocks ---------------- */


function Acc({ id, open, onToggle, Icon, title, hint, children }: {
  id: string; open: boolean; onToggle: (id: string) => void; Icon: typeof Mountain; title: string; hint: string; children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border-2 border-stone-900 overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`dibang-${id}`}
        onClick={() => onToggle(id)}
        className="w-full flex items-center gap-3 px-4 sm:px-6 py-4 text-left cursor-pointer hover:bg-stone-50 transition"
      >
        <span className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></span>
        <span className="min-w-0 flex-1">
          <span className="block font-extrabold text-stone-900 text-base sm:text-lg leading-tight">{title}</span>
          <span className="block text-xs sm:text-sm text-stone-500 mt-0.5">{hint}</span>
        </span>
        <ChevronDown className={`w-5 h-5 text-stone-900 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div id={`dibang-${id}`} className="px-4 sm:px-6 pb-5 sm:pb-6 pt-1 border-t-2 border-stone-900">{children}</div>}
    </div>
  );
}


export function AltitudeChart() {
  const X = (i: number) => 60 + i * 86;
  const Y = (alt: number) => 186 - ((alt - 6000) / 8500) * 150;
  const line = ALT.map((p, i) => `${X(i)},${Y(p.alt)}`).join(' ');
  return (
    <figure className="rounded-xl border border-stone-200 bg-stone-50 p-3 sm:p-4">
      <figcaption className="text-xs sm:text-sm font-bold text-stone-700 mb-2">Overnight altitude by day (ft)</figcaption>
      <svg viewBox="0 0 620 230" className="w-full h-auto" role="img" aria-label="Chart of overnight camp altitude for each trek day, peaking at Chene Pass on day 5">
        <polygon points={`${X(0)},200 ${line} ${X(6)},200`} className="fill-emerald-100" />
        <polyline points={line} fill="none" className="stroke-emerald-700" strokeWidth="3" strokeLinejoin="round" />
        <line x1={X(4)} y1={Y(12200)} x2={X(4)} y2={Y(14000)} className="stroke-amber-500" strokeWidth="3" strokeDasharray="5 5" />
        <circle cx={X(4)} cy={Y(14000)} r="6" className="fill-amber-400 stroke-stone-900" strokeWidth="2" />
        <text x={X(4)} y={Y(14000) - 12} textAnchor="middle" className="fill-stone-900" fontSize="12" fontWeight="800">Chene Pass 14,000</text>
        {ALT.map((p, i) => (
          <g key={p.d}>
            <circle cx={X(i)} cy={Y(p.alt)} r="5" className="fill-white stroke-emerald-700" strokeWidth="3" />
            <text x={X(i)} y={Y(p.alt) + 22} textAnchor="middle" className="fill-stone-600" fontSize="11" fontWeight="700">{p.label}</text>
            <text x={X(i)} y="220" textAnchor="middle" className="fill-stone-900" fontSize="12" fontWeight="800">{p.d}</text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

/* ---------------- spotlight card (whole card opens the trek page) ---------------- */

export default function DibangFeature({ onOpen }: { onOpen: () => void }) {
  return (
    <div id="featured-expedition" className="mb-8 sm:mb-10 scroll-mt-32">
      <article
        onClick={onOpen}
        className="group bg-white rounded-3xl border-2 border-stone-900 shadow-[6px_6px_0_0_#14532d] hover:shadow-[3px_3px_0_0_#14532d] hover:translate-x-[3px] hover:translate-y-[3px] transition overflow-hidden grid lg:grid-cols-5 cursor-pointer"
      >
        <div className="relative lg:col-span-2 min-h-64 sm:min-h-80 lg:min-h-full bg-sky-100 border-b-2 lg:border-b-0 lg:border-r-2 border-stone-900 overflow-hidden">
          <img
            src={DIBANG_IMAGE}
            alt="Alpine lake in Dibang Valley, Arunachal Pradesh"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-amber-300 text-stone-900 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full border-2 border-stone-900">
            <Sparkles className="w-3.5 h-3.5" /> Featured expedition
          </span>
          <span className="absolute bottom-3 left-3 right-3 inline-flex items-center gap-2 bg-white/95 text-stone-900 text-xs sm:text-sm font-bold px-3 py-2 rounded-xl border-2 border-stone-900">
            <Users className="w-4 h-4 text-emerald-700 shrink-0" /> Capped at 30 trekkers a month
          </span>
        </div>

        <div className="lg:col-span-3 p-5 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Dibang Valley · Arunachal Pradesh</p>
          <h2 className="font-coolvetica text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.1] mt-2 font-black">7 Lakes Summit Series Trek</h2>
          <p className="mt-2 text-sm sm:text-base italic text-stone-500">The untamed trail of the great Idu Mishmi hunters</p>
          <p className="mt-4 text-sm sm:text-base text-stone-700 leading-relaxed">
            One of India’s most pristine and remote alpine journeys. Follow ancient hunter trails through untouched rainforest, bamboo groves, high-altitude
            grasslands and glacial valleys to seven sacred lakes, including the glowing waters of Che-ne and the mighty Dini.
          </p>

          <ul aria-label="The seven lakes" className="mt-5 grid grid-cols-4 sm:grid-cols-7 gap-2">
            {LAKES.map((l, i) => (
              <li key={i} className="rounded-xl border-2 border-stone-900 bg-sky-50 px-1.5 py-2 text-center">
                <span className="mx-auto mb-1.5 block w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-stone-900" />
                <span className="block text-[11px] font-bold text-stone-900 leading-tight">{l.name}</span>
                {l.tag && <span className="block text-[10px] font-semibold text-emerald-700 mt-0.5">{l.tag}</span>}
              </li>
            ))}
          </ul>

          <dl className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {FACTS.map(({ Icon, label, value, sub }) => (
              <div key={label} className="rounded-xl border-2 border-stone-900 bg-white p-3">
                <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500"><Icon className="w-3.5 h-3.5 text-emerald-700" />{label}</dt>
                <dd className="mt-1 font-black text-stone-900 text-sm sm:text-base leading-tight">{value}</dd>
                <dd className="text-[11px] text-stone-500 mt-0.5 leading-snug">{sub}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onOpen(); }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 group-hover:bg-emerald-800 text-white font-black text-sm sm:text-base px-5 py-3.5 transition cursor-pointer"
            >
              View full trek details <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm sm:text-base px-5 py-3.5 border-2 border-stone-900 shadow-[4px_4px_0_0_#0f172a] hover:shadow-[2px_2px_0_0_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 transition"
            >
              <MessageCircle className="w-4 h-4" /> Apply for your slot
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ---------------- extra preparation content for the trek page ---------------- */

export function DibangPrepare() {
  const [open, setOpen] = useState<string>('fitness');
  const [packed, setPacked] = useState<string[]>([]);
  const [faq, setFaq] = useState<number | null>(0);
  const toggle = (id: string) => setOpen((o) => (o === id ? '' : id));
  const gearTotal = GEAR.reduce((n, g) => n + g.items.length, 0);
  const togglePack = (k: string) => setPacked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  return (
    <div className="space-y-4">
      <p className="flex gap-3 rounded-2xl bg-amber-50 border-2 border-amber-400 p-4 sm:p-5 text-sm sm:text-base text-stone-800 leading-relaxed">
        <TriangleAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <span><strong>Raw wilderness.</strong> This is an authentic off-the-grid expedition. There are no tea stalls or momo shacks. Accommodation is wilderness camping plus rustic wooden log huts at the main base camp (12,200 ft).</span>
      </p>
          <Acc id="seasons" open={open === 'seasons'} onToggle={toggle} Icon={Calendar} title="Best time to trek" hint="Mid-June to the 3rd week of November">
            <div className="mt-4 grid md:grid-cols-3 gap-3 sm:gap-4">
              {SEASONS.map((s) => (
                <div key={s.name} className={`rounded-xl border-2 border-stone-900 p-4 ${s.tone}`}>
                  <div className="flex items-center gap-2"><span className="text-2xl" aria-hidden>{s.icon}</span><h4 className="font-extrabold text-stone-900 text-base leading-tight">{s.name}</h4></div>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-600">{s.when}</p>
                  <p className="mt-3 text-sm text-stone-700 leading-relaxed">{s.text}</p>
                  <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {[['Day', s.day], ['Night', s.night], ['Layers', s.layers]].map(([k, v]) => (
                      <div key={k} className="rounded-lg bg-white border border-stone-300 py-2 px-1">
                        <dt className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{k}</dt>
                        <dd className="text-xs font-black text-stone-900 mt-0.5 leading-tight">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </Acc>

          <Acc id="fitness" open={open === 'fitness'} onToggle={toggle} Icon={Users} title="Fitness and eligibility" hint="Mandatory proof before booking is confirmed">
            <p className="mt-4 text-sm sm:text-base text-stone-700 leading-relaxed">
              A remote, physically demanding expedition with steep daily ascents and descents of over 1,500 ft on raw terrain.
            </p>
            <div className="mt-4 rounded-2xl border-2 border-stone-900 bg-emerald-700 text-white p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Mandatory fitness proof</p>
              <p className="mt-2 font-coolvetica text-3xl sm:text-4xl leading-tight">5 km in under 35 min</p>
              <p className="mt-2 text-sm text-emerald-50 leading-relaxed">Submit a GPS tracker screenshot (Strava, Nike Run, Garmin or similar) before your booking is confirmed.</p>
            </div>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {[
                ['Active trekkers', 'A daily 12 km walk / run mix for one month before departure.'],
                ['First-timers and beginners', '3–4 months of dedicated cardiovascular training.'],
                ['Aged 58 and above', 'Prior high-altitude Himalayan trekking (above 14,000 ft) and active fitness credentials.'],
              ].map(([t, b]) => (
                <div key={t} className="rounded-xl bg-stone-50 border border-stone-200 p-4">
                  <h4 className="font-bold text-stone-900 text-base">{t}</h4>
                  <p className="text-sm text-stone-600 leading-relaxed mt-1">{b}</p>
                </div>
              ))}
            </div>
          </Acc>

          <Acc id="gear" open={open === 'gear'} onToggle={toggle} Icon={Backpack} title="Gear and packing checklist" hint="Golden rule: stay as light as possible">
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-stone-500">Tap each item as you pack it.</p>
              <span className="text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full tabular-nums">{packed.length} of {gearTotal} packed</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-stone-100 overflow-hidden" aria-hidden>
              <div className="h-full rounded-full bg-emerald-600 transition-[width] duration-300" style={{ width: `${(packed.length / gearTotal) * 100}%` }} />
            </div>
            <div className="mt-5 space-y-5">
              {GEAR.map((g, gi) => (
                <div key={g.group}>
                  <h4 className="font-extrabold text-stone-900 text-base mb-2">{g.group}</h4>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {g.items.map((it, ii) => {
                      const k = `${gi}-${ii}`;
                      const done = packed.includes(k);
                      return (
                        <button key={k} type="button" role="checkbox" aria-checked={done} onClick={() => togglePack(k)}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left text-sm transition active:scale-[0.99] cursor-pointer ${done ? 'bg-emerald-50 border-emerald-300' : 'bg-stone-50 border-stone-200 hover:border-emerald-300 hover:bg-white'}`}>
                          <span className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center ${done ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-stone-300'}`}>
                            {done && <Check className="w-3.5 h-3.5" strokeWidth={3.5} />}
                          </span>
                          <span className={done ? 'text-stone-500 line-through decoration-emerald-400' : 'text-stone-800 font-medium'}>{it}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Acc>

          <Acc id="getting" open={open === 'getting'} onToggle={toggle} Icon={Plane} title="Getting to Anini" hint="Plan an 11–12 day total travel window">
            <ol className="mt-4 grid sm:grid-cols-2 gap-3">
              {ROUTE.map(([d, t, s]) => (
                <li key={d} className="flex items-start gap-3 rounded-xl bg-stone-50 border border-stone-200 p-4">
                  <span className="shrink-0 bg-amber-300 text-stone-900 text-xs font-black px-2.5 py-1 rounded-full">{d}</span>
                  <span className="text-sm text-stone-800 font-semibold leading-snug">{t}{s && <span className="block text-xs font-medium text-stone-500 mt-0.5">{s}</span>}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 grid md:grid-cols-3 gap-3">
              {[
                { Icon: Plane, t: 'By air', b: 'Fly to Dibrugarh (DIB), Assam, or Tezu (TEU), Arunachal. Dibrugarh to Roing is 235 km (~4 hrs); Tezu to Roing is 61 km (~50 min).' },
                { Icon: Train, t: 'By rail', b: 'The nearest major junction is Tinsukia Railway Station, Assam.' },
                { Icon: Car, t: 'Roing to Anini', b: 'About 5 hours by scenic mountain highway through Mayodia Pass.' },
              ].map(({ Icon, t, b }) => (
                <div key={t} className="rounded-xl border-2 border-stone-900 p-4 bg-white">
                  <div className="flex items-center gap-2"><Icon className="w-5 h-5 text-emerald-700" /><h4 className="font-extrabold text-stone-900">{t}</h4></div>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-stone-700 leading-relaxed">
              The trek finishes on Day 7 at about 4:00 PM in Anini. There are no late-evening flights from Dibrugarh or Tezu, so drive to Roing the next day, stay overnight and fly home the following morning.
            </p>
            <p className="mt-3 flex gap-3 rounded-xl bg-amber-50 border-2 border-amber-400 p-4 text-sm text-stone-800 leading-relaxed">
              <TriangleAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Buffer day.</strong> Always build at least one buffer day into your return flights for heavy rain, road clearing or landslides.</span>
            </p>
          </Acc>

          <Acc id="faqs" open={open === 'faqs'} onToggle={toggle} Icon={CircleHelp} title="Frequently asked questions" hint="Network, beginners, medical support, luggage, gumboots">
            <ul className="mt-4 divide-y divide-stone-200 border-y border-stone-200">
              {FAQS.map(([q, a], i) => (
                <li key={q}>
                  <button type="button" aria-expanded={faq === i} onClick={() => setFaq(faq === i ? null : i)} className="w-full flex items-start justify-between gap-4 py-4 text-left cursor-pointer">
                    <span className="font-bold text-stone-900 text-sm sm:text-base leading-snug">{q}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 text-stone-900 transition-transform duration-300 ${faq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {faq === i && <p className="pb-4 text-sm sm:text-[15px] text-stone-600 leading-relaxed">{a}</p>}
                </li>
              ))}
            </ul>
          </Acc>

      <div className="rounded-3xl border-2 border-stone-900 bg-[#0e1a14] text-white p-6 sm:p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Strictly limited to 30 trekkers per departure window</p>
        <h3 className="font-coolvetica text-2xl sm:text-3xl mt-2 leading-tight">Ready for the ultimate wilderness expedition?</h3>
        <p className="mt-2 text-sm text-stone-300">Experience the sacred realm of the Idu Mishmi hunters.</p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-3.5 transition">
            <MessageCircle className="w-4 h-4" /> Apply / submit fitness proof
          </a>
          <a href={`tel:${PHONE}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black hover:bg-amber-50 font-black px-6 py-3.5 transition tabular-nums">
            <Phone className="w-4 h-4" /> {PHONE}
          </a>
        </div>
      </div>
    </div>
  );
}
