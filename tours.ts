import { EBC_IMAGE } from '../tourArt.ts';
import { DIBANG_ID, DIBANG_IMAGE, DAYS as DIBANG_DAYS, INCLUDED as DIBANG_INCLUDED, EXCLUDED as DIBANG_EXCLUDED } from './dibang.ts';

export interface ItineraryDay {
  day: string;
  title: string;
  schedule?: { time: string; activity: string }[];
  description?: string;
  bullets?: string[];
  meta?: [string, string][];
  alerts?: { kind: 'water' | 'bug'; text: string }[];
  note?: string;
}

export interface TourPackage {
  id: string;
  name: string;
  category: 'Karnataka' | 'Kerala & TN' | 'Special Expeditions';
  departure: string;
  duration: string;
  meetingCity: string;
  price: number;
  priceNote?: string;
  difficulty: string;
  elevation: string;
  whyChoose: string[];
  route: string;
  itinerary: ItineraryDay[];
  accessNote: string;
  importantInfo?: string[];
  inclusions?: string[];
  exclusions?: string[];
  thingsToCarry?: string[];
  image: string;
  themeColor: string; // Tailored color for card accent
  textColor: string;
  bgTint: string;
}

export const TOURS: TourPackage[] = [
  {
    id: 'kudremukh',
    name: 'Kudremukh Peak Trek',
    category: 'Karnataka',
    departure: '5–6 December 2026 (proposed)',
    duration: '2 days / 1 night',
    meetingCity: 'Mangalore, Karnataka',
    price: 4499,
    priceNote: '₹4,499 per person (proposed)',
    difficulty: 'Moderate to challenging',
    elevation: 'About 1,894 m',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    themeColor: '#15803d',
    textColor: '#14532d',
    bgTint: 'rgba(21, 128, 61, 0.08)',
    whyChoose: [
      'Rolling green grasslands and mountain ridgelines',
      'Forest sections, streams and broad valley views',
      'Excellent landscape photography opportunities',
    ],
    route: 'Mangalore → Kalasa/Balagal → Mullodi trail access → Kudremukh trail → return to Mullodi → Balagal → Mangalore. Exact transfer and trailhead access must be confirmed.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Meeting & Base Preparation',
        description:
          'Meet at the confirmed Mangalore pickup point. Transfer towards the authorized trail access area. Complete registration and briefing, check gear and permits, and stay at the confirmed homestay/camp/dormitory. Early dinner and rest.',
      },
      {
        day: 'Day 2',
        title: 'Trek to Kudremukh & Return',
        description:
          'Early breakfast and transfer to the authorized trailhead. Trek with the guide, keeping the group together and following all forest instructions. Return to the trailhead within the permitted time, have a meal, and transfer back to Mangalore. Arrival time depends on road and trail conditions.',
      },
    ],
    accessNote:
      'The trail is regulated and access/permits can change. Do not advertise guaranteed summit access until the applicable booking and route are confirmed.',
  },
  {
    id: 'tadiandamol',
    name: 'Tadiandamol Trek',
    category: 'Karnataka',
    departure: '19–20 December 2026 (proposed)',
    duration: '2 days / 1 night',
    meetingCity: 'Bengaluru, Karnataka',
    price: 4499,
    priceNote: '₹4,499 per person (proposed)',
    difficulty: 'Moderate',
    elevation: 'About 1,748 m',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    themeColor: '#047857',
    textColor: '#064e3b',
    bgTint: 'rgba(4, 120, 87, 0.08)',
    whyChoose: [
      "Coorg's forested slopes and open mountain scenery",
      'Cloud and mist views when weather allows',
      'A rewarding Western Ghats day hike',
    ],
    route: 'Bengaluru → Kakkabe/Nalknad area → authorized Tadiandamol trail → return to Kakkabe → Bengaluru.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Bengaluru to Kakkabe Area',
        description:
          'Meet at the confirmed Bengaluru pickup point and travel to the Kakkabe area. Check in to the confirmed stay, eat dinner, attend the safety briefing and rest.',
      },
      {
        day: 'Day 2',
        title: 'Trailhead, Ascent & Return',
        description:
          'Early breakfast and transfer to the trailhead. Trek to the permitted turnaround point with regular water and rest breaks. Return to the base, have lunch, and travel back to Bengaluru. Timings depend on traffic and trail conditions.',
      },
    ],
    accessNote:
      'Confirm the legal trail, current access rules, local guide requirement and any entry charges before publishing the final departure.',
  },
  {
    id: 'kumara-parvatha',
    name: 'Kumara Parvatha Trek',
    category: 'Karnataka',
    departure: '9–10 January 2027 (proposed)',
    duration: '2 days / 1 night — subject to official route rules',
    meetingCity: 'Kukke Subramanya, Karnataka',
    price: 4499,
    priceNote: '₹4,499 per person (proposed)',
    difficulty: 'Difficult',
    elevation: 'About 1,712 m',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
    themeColor: '#b45309',
    textColor: '#78350f',
    bgTint: 'rgba(180, 83, 9, 0.08)',
    whyChoose: [
      'Steep forest ascent and exposed ridge scenery',
      'A demanding endurance trek for experienced hikers',
      'Wide Western Ghats views in clear weather',
    ],
    route:
      'Kukke Subramanya → authorized forest trail → permitted turnaround/summit area → return to Kukke. Overnight camping or forest stay must not be assumed.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Reporting in Kukke Subramanya',
        description:
          'Meet in Kukke Subramanya, complete document and permit checks, and attend a detailed briefing. Stay in confirmed accommodation. The exact trek start and overnight plan depend on official access rules.',
      },
      {
        day: 'Day 2',
        title: 'Endurance Trek & Closing',
        description:
          'Start only within the permitted reporting window. Trek with the authorized guide and follow turnaround times. Return to Kukke and close the trip after all participants are accounted for.',
      },
    ],
    accessNote:
      'This is a strenuous route and access/overnight rules can be restrictive. Confirm whether the proposed two-day plan is legal and feasible before selling it; do not promise a summit.',
  },
  {
    id: 'banasura',
    name: 'Banasura Hills Trek',
    category: 'Kerala & TN',
    departure: '23–24 January 2027 (proposed)',
    duration: '2 days / 1 night',
    meetingCity: 'Kalpetta, Kerala',
    price: 4499,
    priceNote: '₹4,499 per person (proposed)',
    difficulty: 'Moderate — subject to the permitted trail',
    elevation: 'Banasura highland area is around 2,000 m; exact trek endpoint must be verified',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    themeColor: '#1e3a8a',
    textColor: '#172554',
    bgTint: 'rgba(30, 58, 138, 0.08)',
    whyChoose: [
      "Wayanad's green hills and forest landscape",
      'Scenic views around the Banasura region',
      'Nature photography and quiet hill-country surroundings',
    ],
    route: 'Kalpetta → authorized Banasura trail/forest entry → permitted route and return → Kalpetta.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Kalpetta',
        description:
          'Meet in Kalpetta, travel to confirmed accommodation, check in, review the weather and access status, and attend a safety briefing.',
      },
      {
        day: 'Day 2',
        title: 'Authorized Trail & Return',
        description:
          'Proceed only on the currently authorized trail with the required guide/permissions. Trek to the permitted endpoint, return to the vehicle and travel back to Kalpetta.',
      },
    ],
    accessNote:
      'Confirm that a commercial trek to the advertised endpoint is currently allowed. Do not market restricted areas as open-access trails.',
  },
  {
    id: 'agasthyarkoodam',
    name: 'Agasthyarkoodam Trek',
    category: 'Kerala & TN',
    departure: '6–7 February 2027 (proposed; official season dates may differ)',
    duration: 'Official schedule may require more than 2 days',
    meetingCity: 'Thiruvananthapuram, Kerala',
    price: 5999,
    priceNote: '₹5,999 per person — review required after official costs are known',
    difficulty: 'Difficult',
    elevation: 'About 1,868 m',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    themeColor: '#4338ca',
    textColor: '#312e81',
    bgTint: 'rgba(67, 56, 202, 0.08)',
    whyChoose: [
      'Biodiversity-rich Western Ghats landscape',
      'A renowned guided, regulated trekking experience',
      'Forest and mountain scenery',
    ],
    route:
      'Thiruvananthapuram → Bonacaud/Bonaccord reporting point → official permitted route → return according to the official itinerary.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Thiruvananthapuram to Official Reporting Point',
        description:
          'Meet in Thiruvananthapuram and travel to the official reporting point only if the permit and reporting schedule are confirmed. Complete verification and follow the authority’s accommodation and briefing instructions.',
      },
      {
        day: 'Day 2 onward',
        title: 'Regulated Guided Trek',
        description:
          'Trek only according to the official route, permitted duration and guide instructions. Return to the reporting point and then the city as scheduled by the authority.',
      },
    ],
    accessNote:
      'Do not sell a fixed two-day summit package until the official 2027 schedule, permits, duration and full cost are confirmed. The proposed rate may be financially unviable.',
  },
  {
    id: 'kodachadri',
    name: 'Kodachadri Trek',
    category: 'Karnataka',
    departure: '20–21 February 2027 (proposed)',
    duration: '2 days / 1 night',
    meetingCity: 'Bengaluru, Karnataka',
    price: 4499,
    priceNote: '₹4,499 per person (proposed)',
    difficulty: 'Moderate to challenging',
    elevation: 'About 1,343 m',
    image: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
    themeColor: '#0f766e',
    textColor: '#134e4a',
    bgTint: 'rgba(15, 118, 110, 0.08)',
    whyChoose: [
      'Western Ghats ridge and valley views',
      'Forest trails and changing landscapes',
      'Sunset/sunrise views only if timing and conditions permit',
    ],
    route: 'Bengaluru → Kollur/Nittur area → authorized Kodachadri trail or approved local transfer → return → Bengaluru.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Bengaluru to Base Area',
        description:
          'Meet in Bengaluru and travel to the confirmed base area. Check in, have dinner and attend a briefing covering weather, footwear, trail rules and timings.',
      },
      {
        day: 'Day 2',
        title: 'Trailhead, Hike & Return',
        description:
          'Early breakfast; travel to the approved starting point. Trek or use only authorized local transport where allowed. Return to base and begin the transfer back to Bengaluru.',
      },
    ],
    accessNote:
      'Clarify whether the package uses a full trekking route or an authorized jeep-supported itinerary; these are not interchangeable.',
  },
  {
    id: 'chembra',
    name: 'Chembra Peak Trek',
    category: 'Kerala & TN',
    departure: '6–7 March 2027 (proposed)',
    duration: '2 days / 1 night',
    meetingCity: 'Kozhikode, Kerala',
    price: 4499,
    priceNote: '₹4,499 per person (proposed)',
    difficulty: 'Moderate',
    elevation: 'Chembra summit is about 2,100 m',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    themeColor: '#059669',
    textColor: '#064e3b',
    bgTint: 'rgba(5, 150, 105, 0.08)',
    whyChoose: [
      'Green Wayanad hills and panoramic views',
      'Grassland and forest scenery',
      'A scenic Western Ghats outing',
    ],
    route: 'Kozhikode → Meppadi/Wayanad → currently permitted Chembra route → return to Wayanad → Kozhikode.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Kozhikode to Wayanad',
        description:
          'Meet in Kozhikode and transfer to Wayanad. Check in to confirmed accommodation, confirm the next day’s entry status and attend a briefing.',
      },
      {
        day: 'Day 2',
        title: 'Reporting Point & Permitted Route',
        description:
          'Visit the official reporting point and trek only as far as currently permitted. Return to base, eat and transfer back to Kozhikode.',
      },
    ],
    accessNote:
      'Summit access and trail distance may be restricted. Confirm the permitted endpoint and current booking system before accepting reservations.',
  },
  {
    id: 'velliangiri',
    name: 'Velliangiri Hills Trek',
    category: 'Kerala & TN',
    departure: '20–21 March 2027 (proposed; seasonal access must be confirmed)',
    duration: 'Authority-approved duration only',
    meetingCity: 'Coimbatore, Tamil Nadu',
    price: 5999,
    priceNote: '₹5,999 per person (proposed)',
    difficulty: 'Difficult',
    elevation: 'High point roughly 1,800–1,850 m',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    themeColor: '#7c2d12',
    textColor: '#431407',
    bgTint: 'rgba(124, 45, 18, 0.08)',
    whyChoose: [
      'Sacred hill landscape and forest scenery',
      'Steep sections requiring good fitness',
      'A culturally significant pilgrimage trek',
    ],
    route: 'Coimbatore → Poondi reporting area → authorized route → return to Poondi → Coimbatore.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Coimbatore to Poondi Reporting Point',
        description:
          'Meet in Coimbatore, transfer to the confirmed reporting point and stay only in approved accommodation. Review seasonal rules, clothing, water and fitness expectations.',
      },
      {
        day: 'Day 2',
        title: 'Official Season Ascent & Return',
        description:
          'Day 2 or authority-specified schedule: Start only when access is officially open. Follow all restrictions and the leader’s turnaround time, then return to Coimbatore.',
      },
    ],
    accessNote:
      'This trek has seasonal and regulatory restrictions. Confirm the 2027 opening window and legal overnight arrangements; never plan unauthorized camping.',
  },
  {
    id: 'meesapulimala',
    name: 'Meesapulimala Trek',
    category: 'Kerala & TN',
    departure: '10–11 April 2027 (proposed)',
    duration: '2 days / 1 night, subject to official package',
    meetingCity: 'Munnar, Kerala',
    price: 5999,
    priceNote: '₹5,999 per person (proposed)',
    difficulty: 'Moderate to challenging',
    elevation: 'About 2,640 m',
    image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=800&q=80',
    themeColor: '#0284c7',
    textColor: '#075985',
    bgTint: 'rgba(2, 132, 199, 0.08)',
    whyChoose: [
      'High-altitude grasslands and mountain ridges',
      'Cool weather and broad views on clear days',
      'Guided ecotourism experience',
    ],
    route:
      'Munnar → authorized reporting point/Silent Valley area → official guided route → return to the approved base.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Munnar',
        description:
          'Meet in Munnar and check in to confirmed accommodation. Verify official booking, reporting time, transport arrangements and weather. Brief the group and prepare gear.',
      },
      {
        day: 'Day 2',
        title: 'Ecotourism Trail & Return',
        description:
          'Travel to the authorized reporting point and trek only on the booked official route with the designated guide. Return according to the official schedule.',
      },
    ],
    accessNote:
      'Official ecotourism booking, transport and route rules apply. Confirm what the ticket includes and do not imply independent summit access.',
  },
  {
    id: 'mullayanagiri',
    name: 'Mullayanagiri Trek',
    category: 'Karnataka',
    departure: '24–25 April 2027 (proposed)',
    duration: '2 days / 1 night',
    meetingCity: 'Bengaluru, Karnataka',
    price: 4499,
    priceNote: '₹4,499 per person (proposed)',
    difficulty: 'Easy to moderate, depending on route',
    elevation: 'About 1,930 m',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
    themeColor: '#16a34a',
    textColor: '#14532d',
    bgTint: 'rgba(22, 163, 74, 0.08)',
    whyChoose: [
      "One of Karnataka's best-known highland viewpoints",
      'Rolling hills and panoramic scenery',
      'A flexible outing for active beginners when route choice is suitable',
    ],
    route: 'Bengaluru → Chikkamagaluru → authorized Mullayanagiri trail/viewpoint → Chikkamagaluru → Bengaluru.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Bengaluru to Chikkamagaluru',
        description:
          'Meet in Bengaluru and transfer to Chikkamagaluru. Check in, have dinner and review the planned route and weather.',
      },
      {
        day: 'Day 2',
        title: 'Highland Hike & Return',
        description:
          'Early breakfast and transfer to the authorized trail or viewpoint. Complete the planned hike with the guide, return to the vehicle and travel back to Bengaluru.',
      },
    ],
    accessNote:
      'The itinerary may be a short hike or a longer trail depending on access and road conditions; specify the exact route in the final package.',
  },
  {
    id: 'kolukkumalai',
    name: 'Kolukkumalai Trek & Sunrise',
    category: 'Kerala & TN',
    departure: '15–16 May 2027 (proposed)',
    duration: '2 days / 1 night',
    meetingCity: 'Munnar, Kerala',
    price: 5999,
    priceNote: '₹5,999 per person (proposed)',
    difficulty: 'Moderate',
    elevation: 'Around 2,170 m',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    themeColor: '#ea580c',
    textColor: '#9a3412',
    bgTint: 'rgba(234, 88, 12, 0.08)',
    whyChoose: [
      'Tea-estate landscapes and high mountain views',
      'Early-morning light when weather permits',
      'Distinctive high-range scenery',
    ],
    route: 'Munnar → Suryanelli → authorized local jeep/trek route → Kolukkumalai area → return to Munnar.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Munnar Base Arrival',
        description:
          "Meet in Munnar, travel to the confirmed base and check in. Review the next day's vehicle arrangements, weather and sunrise plan.",
      },
      {
        day: 'Day 2',
        title: 'Sunrise Viewpoint & Descent',
        description:
          'Depart at the locally confirmed time. Use only authorized vehicles and access routes; enjoy the permitted viewpoint/trek, return to base and conclude in Munnar.',
      },
    ],
    accessNote:
      'A jeep-supported sightseeing trip is different from a full trek. Confirm local vehicle permissions, stay, and whether sunrise access is available on the departure date.',
  },
  {
    id: 'parvathamalai',
    name: 'Parvathamalai Trek',
    category: 'Kerala & TN',
    departure: '29–30 May 2027 (proposed)',
    duration: '2 days / 1 night',
    meetingCity: 'Chennai, Tamil Nadu',
    price: 4499,
    priceNote: '₹4,499 per person (proposed)',
    difficulty: 'Difficult',
    elevation: 'About 1,100 m',
    image: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80',
    themeColor: '#b91c1c',
    textColor: '#7f1d1d',
    bgTint: 'rgba(185, 28, 28, 0.08)',
    whyChoose: [
      'Steep rocky ascent and a physically demanding climb',
      'Temple and hilltop landscape',
      'A challenging option for experienced, sure-footed hikers',
    ],
    route: 'Chennai → Kadaladi base area → permitted Parvathamalai route → return to Kadaladi → Chennai.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Chennai to Kadaladi',
        description:
          'Meet in Chennai and travel to the confirmed base area. Check in, eat and attend a detailed briefing on steep sections, footwear, hydration and turnaround times.',
      },
      {
        day: 'Day 2',
        title: 'Rocky Climb & Return to Chennai',
        description:
          'Start at the confirmed time with the leader. Ascend only in suitable conditions, follow local rules, return safely to the base and transfer to Chennai.',
      },
    ],
    accessNote:
      'The route can be steep and slippery. Confirm local access, weather, guide support and realistic travel time before publishing.',
  },
  {
    id: 'kurangani',
    name: 'Kurangani Trek / Top Station Area',
    category: 'Kerala & TN',
    departure: '16–17 October 2027 (proposed; route access must be verified)',
    duration: '2 days / 1 night',
    meetingCity: 'Munnar, Kerala',
    price: 5999,
    priceNote: '₹5,999 per person (proposed)',
    difficulty: 'Moderate to difficult',
    elevation: 'Varies by authorized endpoint; confirm before advertising',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    themeColor: '#0369a1',
    textColor: '#0c4a6e',
    bgTint: 'rgba(3, 105, 161, 0.08)',
    whyChoose: [
      'High-range views and forested slopes',
      'A scenic route for experienced hikers if officially open',
      'Opportunity to experience the Western Ghats landscape',
    ],
    route:
      'Munnar → authorized reporting point → officially permitted Kurangani/Top Station-area route → return by the approved route.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival in Munnar & Route Check',
        description:
          'Meet in Munnar, check in to confirmed accommodation, and verify route permits, weather and transport.',
      },
      {
        day: 'Day 2',
        title: 'Authorized Trail & Return',
        description:
          'Proceed only on the currently authorized route with the required guide. Follow the planned turnaround time and return by the approved trail.',
      },
    ],
    accessNote:
      'Do not advertise a Kurangani-to-Top-Station traverse unless current authorities explicitly permit that exact route. Fire, forest and access restrictions can change.',
  },
  {
    id: 'vellarimala',
    name: 'Vellarimala Trek',
    category: 'Kerala & TN',
    departure: '13–14 November 2027 (proposed; restricted access must be verified)',
    duration: 'Only as permitted by the responsible authority',
    meetingCity: 'Kozhikode, Kerala',
    price: 6999,
    priceNote: '₹6,999 per person (proposed; supplier costs pending)',
    difficulty: 'Difficult',
    elevation: 'Endpoint-dependent; verify exact summit/route elevation',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    themeColor: '#475569',
    textColor: '#1e293b',
    bgTint: 'rgba(71, 85, 105, 0.08)',
    whyChoose: [
      'Remote mountain and forest scenery',
      'A challenging route for fit, experienced trekkers if access is granted',
      'Strong emphasis on guided, low-impact travel',
    ],
    route:
      'Kozhikode → authorized Anakkampoyil/reporting area → officially permitted Vellarimala route → return by the authorized route.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Kozhikode to Base',
        description:
          'Meet in Kozhikode and transfer to the confirmed base only after written access and guide arrangements are verified. Brief the group and prepare equipment.',
      },
      {
        day: 'Day 2 or official schedule',
        title: 'Guided Wilderness Ascent',
        description:
          "Trek only if written permission, route access and safety support are in place. Return within the authority's permitted timings.",
      },
    ],
    accessNote:
      'Treat this departure as a planning placeholder until access, permits, endpoint, guide, stay and emergency arrangements are confirmed. Do not sell unauthorized forest entry.',
  },
  {
    id: 'meghamalai',
    name: 'Meghamalai Hills',
    category: 'Kerala & TN',
    departure: '11–12 December 2027 (proposed)',
    duration: '2 days / 1 night',
    meetingCity: 'Madurai, Tamil Nadu',
    price: 4499,
    priceNote: '₹4,499 per person (proposed)',
    difficulty: 'Easy to moderate; route-dependent',
    elevation: 'The region reaches roughly 1,500 m; exact stops vary',
    image: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80',
    themeColor: '#15803d',
    textColor: '#14532d',
    bgTint: 'rgba(21, 128, 61, 0.08)',
    whyChoose: [
      'Tea plantations, forested hills and scenic viewpoints',
      'Relaxed hill-country exploration',
      'Nature photography and quiet landscapes',
    ],
    route: 'Madurai → Meghamalai → authorized viewpoints/tea-estate roads → return to Madurai.',
    itinerary: [
      {
        day: 'Day 1',
        title: 'Madurai to Meghamalai',
        description:
          'Meet in Madurai and travel to Meghamalai. Check in to confirmed accommodation, review road conditions and visit permitted viewpoints as time allows.',
      },
      {
        day: 'Day 2',
        title: 'Viewpoints & Return to Madurai',
        description:
          'Visit approved viewpoints or complete a short guided walk where allowed. Return to Madurai; timing depends on road conditions and access.',
      },
    ],
    accessNote:
      'This is primarily a hill-region outing unless a specific authorized trekking trail is confirmed. Clarify sightseeing versus trekking in the final itinerary.',
  },
  {
    id: 'kerala-sankranti',
    name: 'KERALA SANKRANTI SPECIAL',
    category: 'Special Expeditions',
    departure: '14–18 January 2027',
    duration: '5 Days / 4 Nights',
    meetingCity: 'Kochi, Kerala',
    price: 15599,
    priceNote: '₹15,599 per person',
    difficulty: 'Easy / Leisure (Sightseeing, not a trek)',
    elevation: 'Sea level to 1,600 m (Munnar)',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    themeColor: '#0d9488',
    textColor: '#115e59',
    bgTint: 'rgba(13, 148, 136, 0.08)',
    whyChoose: [
      "Celebrate Sankranti with a scenic Kerala getaway covering Munnar's tea-covered hills",
      "Thekkady's spice country and forest surroundings",
      "Alleppey's peaceful backwaters and houseboat experience",
      "Kochi's coastal heritage and Chinese fishing nets",
    ],
    route: 'Kochi → Munnar → Thekkady → Alleppey → Kochi',
    itinerary: [
      {
        day: 'DAY 1',
        title: 'Thursday, 14 January 2027 | Kochi → Munnar',
        schedule: [
          { time: '08:00–09:00', activity: 'Meet the group in Kochi, attendance and trip briefing.' },
          { time: '09:00–13:00', activity: 'Travel towards Munnar with comfort and photo breaks en route.' },
          { time: '13:00–14:00', activity: 'Lunch break (at own cost unless specifically included in the final package).' },
          { time: '14:00–17:30', activity: 'Visit selected viewpoints/waterfalls on the route, subject to traffic, weather and access.' },
          { time: '18:00', activity: 'Check in to the Munnar stay; freshen up and relax.' },
          { time: '19:30 onwards', activity: 'Dinner and overnight stay in Munnar.' },
        ],
      },
      {
        day: 'DAY 2',
        title: 'Friday, 15 January 2027 | Munnar Sightseeing',
        schedule: [
          { time: '07:30–08:30', activity: 'Breakfast.' },
          { time: '09:00–11:00', activity: 'Tea garden views and photo stops; visit a tea museum/factory only if open and tickets are available.' },
          { time: '11:00–13:00', activity: 'Mattupetty Dam and Echo Point, depending on local conditions.' },
          { time: '13:00–14:00', activity: 'Lunch break.' },
          { time: '14:00–16:30', activity: 'Kundala Lake / nearby viewpoints, subject to time and access.' },
          { time: '17:00–18:00', activity: 'Return to accommodation and free time.' },
          { time: '19:30 onwards', activity: 'Dinner and overnight stay in Munnar.' },
        ],
      },
      {
        day: 'DAY 3',
        title: 'Saturday, 16 January 2027 | Munnar → Thekkady',
        schedule: [
          { time: '07:00–08:00', activity: 'Breakfast and check-out.' },
          { time: '08:00–12:00', activity: 'Drive to Thekkady with scheduled breaks.' },
          { time: '12:00–13:00', activity: 'Check-in or luggage drop, subject to hotel policy; lunch break.' },
          { time: '13:30–16:00', activity: 'Spice plantation visit or local guided experience, subject to opening hours and entry fee.' },
          { time: '16:00–18:00', activity: 'Free time for local shopping or an optional cultural show/boating, subject to availability and extra charges.' },
          { time: '19:30 onwards', activity: 'Dinner and overnight stay in Thekkady.' },
        ],
      },
      {
        day: 'DAY 4',
        title: 'Sunday, 17 January 2027 | Thekkady → Alleppey',
        schedule: [
          { time: '07:00–08:00', activity: 'Breakfast and check-out.' },
          { time: '08:00–12:30', activity: 'Travel to Alleppey; timing may vary with road conditions.' },
          { time: '12:30–13:30', activity: 'Arrive and board/check in to the pre-booked houseboat or backwater accommodation, subject to booking confirmation.' },
          { time: '13:30–16:30', activity: "Backwater cruise and scenic village/waterway views, following the operator's schedule and local rules." },
          { time: '16:30–18:00', activity: 'Relax and enjoy sunset views when conditions permit.' },
          { time: 'Evening', activity: 'Dinner and overnight stay. Houseboat meals/stay must be confirmed in the final booking voucher.' },
        ],
      },
      {
        day: 'DAY 5',
        title: 'Monday, 18 January 2027 | Alleppey → Kochi',
        schedule: [
          { time: '07:00–08:00', activity: 'Breakfast and check-out.' },
          { time: '08:00–10:00', activity: 'Travel towards Kochi.' },
          { time: '10:00–13:00', activity: 'Fort Kochi / Chinese fishing nets / heritage-area walk, depending on traffic and local access.' },
          { time: '13:00–14:00', activity: 'Lunch break.' },
          { time: '14:00 onwards', activity: 'Optional Marine Drive or shopping if time permits; drop-off in Kochi and trip concludes.' },
        ],
      },
    ],
    accessNote:
      'This is a sightseeing trip, not a trekking package. Houseboat availability, route and meal plan must be verified before payment is collected.',
    inclusions: [
      "4 nights' accommodation on a sharing basis, only as confirmed in the final booking plan.",
      'Intercity/local transport for the listed route, only if specified in the final package quotation.',
      'Meals only as explicitly stated on the confirmed package voucher; do not assume all meals are included.',
      'Trip coordination and basic group assistance by VYRA ADVENTURE.',
    ],
    exclusions: [
      'Travel to Kochi from your home city and return travel after the Kochi drop-off.',
      'Lunches, snacks, beverages and meals not listed as included.',
      'Entry tickets, boating, tea museum/factory tickets, spice plantation fees, cultural shows and other optional activities unless explicitly included.',
      'Personal expenses, shopping, tips, room upgrades and expenses caused by delays or weather disruptions.',
      'Travel insurance and any services not specifically listed under inclusions.',
    ],
  },
  {
    id: 'ladakh-grand-loop',
    name: 'LADAKH GRAND LOOP',
    category: 'Special Expeditions',
    departure: '10–19 July 2027',
    duration: '10 Days / 9 Nights',
    meetingCity: 'Leh, Ladakh',
    price: 34999,
    priceNote: '₹34,999 per person (proposed)',
    difficulty: 'High-Altitude Road Trip & Moderate Exploration',
    elevation: 'Leh (3,500 m) to Khardung La (5,359 m)',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    themeColor: '#d97706',
    textColor: '#92400e',
    bgTint: 'rgba(217, 119, 6, 0.08)',
    whyChoose: [
      "Explore Ladakh's dramatic mountain roads, monasteries, high-altitude valleys and remote lakes on a 10-day loop",
      'Khardung La, Diskit Monastery and Hunder sand dunes in Nubra Valley',
      'Mesmerizing Pangong Lake, dark sky stargazing in Hanle, and wild Tso Moriri & Tso Kar',
      'Ancient monasteries: Alchi, Thiksey, and Shanti Stupa',
    ],
    route: 'Leh → Sham Valley → Nubra → Pangong → Hanle → Tso Moriri → Tso Kar → Leh',
    itinerary: [
      {
        day: 'DAY 1',
        title: 'Saturday, 10 July | Arrival in Leh & Acclimatization',
        bullets: [
          'Arrival: Airport pickup and transfer to the Leh accommodation, subject to flight timing.',
          'Morning / afternoon: Rest, hydrate, eat light meals and allow the body to adjust to altitude. Avoid strenuous activity.',
          'Late afternoon: Only if feeling well: a short, easy walk close to the accommodation. No remote excursion today.',
          'Evening: Trip briefing, dinner and overnight stay in Leh.',
        ],
      },
      {
        day: 'DAY 2',
        title: 'Sunday, 11 July | Leh → Sham Valley → Leh',
        bullets: [
          '07:30–08:30: Breakfast and departure briefing.',
          '09:00–12:30: Visit selected Sham Valley sights such as the Hall of Fame, Gurudwara Pathar Sahib and Magnetic Hill, depending on access and group pace.',
          '12:30–13:30: Lunch break.',
          '13:30–16:30: Visit the Indus–Zanskar confluence viewpoint and Alchi area if road/time conditions allow.',
          '17:00–18:30: Return to Leh, rest and free time.',
          'Night: Dinner and overnight stay in Leh.',
        ],
      },
      {
        day: 'DAY 3',
        title: 'Monday, 12 July | Leh → Nubra Valley',
        bullets: [
          '07:00–08:00: Breakfast and check-out.',
          '08:00–12:30: Drive towards Nubra via Khardung La, only if the road is open and authorities permit passage. Stop briefly at designated safe viewpoints.',
          '12:30–13:30: Lunch break.',
          '14:00–17:30: Explore Diskit Monastery / Maitreya Buddha viewpoint and the Hunder sand dunes if conditions and time permit.',
          'Evening: Check in, dinner and overnight stay in Nubra Valley.',
        ],
      },
      {
        day: 'DAY 4',
        title: 'Tuesday, 13 July | Nubra → Pangong Lake',
        bullets: [
          'Morning: Breakfast and check-out.',
          'Daytime: Drive to Pangong via the route open and permitted on the day. Route and travel time can change with road, weather and permit restrictions.',
          'En route: Scheduled rest, hydration and lunch breaks at suitable stops.',
          'Afternoon / evening: Arrive near Pangong, check in and enjoy the lake from permitted viewing areas; follow local instructions and avoid entering the water.',
          'Night: Dinner and overnight stay near Pangong, subject to confirmed accommodation availability.',
        ],
      },
      {
        day: 'DAY 5',
        title: 'Wednesday, 14 July | Pangong → Hanle',
        bullets: [
          'Morning: Breakfast and check-out; early departure recommended.',
          'Daytime: Drive towards Hanle on the permitted route. Carry required identification and ensure inner-line/area permissions are confirmed in advance.',
          'Afternoon: Check in and rest. Optional local visit only if timing, weather, access and local rules permit.',
          'Evening: Stargazing only if conditions and local rules allow; no guarantee of clear skies.',
          'Night: Dinner and overnight stay in Hanle.',
        ],
      },
      {
        day: 'DAY 6',
        title: 'Thursday, 15 July | Hanle → Tso Moriri',
        bullets: [
          'Early morning: Breakfast and check-out.',
          'Daytime: Travel towards Tso Moriri using the route confirmed by local authorities and the driver. This is a remote high-altitude driving day; build in rest and contingency time.',
          'En route: Lunch and comfort stops where available; facilities may be limited, so carry water and snacks.',
          'Afternoon / evening: Arrive near Korzok/Tso Moriri if road and timing allow; check in and enjoy the landscape from permitted areas.',
          'Night: Dinner and overnight stay near Tso Moriri, subject to booking and route feasibility.',
        ],
      },
      {
        day: 'DAY 7',
        title: 'Friday, 16 July | Tso Moriri → Tso Kar',
        bullets: [
          'Morning: Breakfast and check-out.',
          'Daytime: Drive towards Tso Kar via the route confirmed as open and permitted. Do not attempt shortcuts or restricted roads.',
          'Afternoon: Arrive at the Tso Kar area if conditions permit; observe the wetland and wildlife only from permitted areas and maintain distance.',
          'Night: Overnight stay in a confirmed camp/guesthouse where available. Backup accommodation/route plan is essential.',
        ],
      },
      {
        day: 'DAY 8',
        title: 'Saturday, 17 July | Tso Kar → Leh',
        bullets: [
          'Early morning: Breakfast and departure.',
          'Daytime: Drive back to Leh via the route open on the day, with fuel, meal and rest stops planned in advance.',
          'Late afternoon / evening: Arrive in Leh, check in and rest. Avoid committing to a fixed arrival time due to remote-road uncertainty.',
          'Night: Dinner and overnight stay in Leh.',
        ],
      },
      {
        day: 'DAY 9',
        title: 'Sunday, 18 July | Leh Local Sightseeing',
        bullets: [
          '08:00–09:00: Breakfast.',
          '09:00–12:30: Visit Leh Palace and selected old-town viewpoints/market areas, subject to opening hours.',
          '12:30–13:30: Lunch break.',
          '13:30–16:30: Visit Shanti Stupa and/or Thiksey Monastery depending on group preference and timing.',
          'Evening: Shopping, packing and trip wrap-up.',
          'Night: Dinner and overnight stay in Leh.',
        ],
      },
      {
        day: 'DAY 10',
        title: 'Monday, 19 July | Leh Departure',
        bullets: [
          'As per flight: Breakfast, check-out and airport transfer.',
          'Trip ends: Departure from Leh. Please book onward flights only after checking the final operator schedule and allowing for possible road/flight disruptions.',
        ],
      },
    ],
    accessNote:
      'Day 1 is for acclimatization. Permits, road access, overnight stays and the Nubra–Pangong–Hanle–Tso Moriri–Tso Kar routing can be restricted or changed. Never promise the full loop until local authorities and the operator confirm it.',
    inclusions: [
      "9 nights' accommodation on a stated sharing basis, subject to actual availability and confirmation.",
      'Leh-based road transport for the full itinerary, including driver and fuel, only if covered by the final quote.',
      'Airport pickup and drop-off in Leh, if specifically included in the final quote.',
      'Trip coordination and basic group assistance by VYRA ADVENTURE.',
      'Meals only as specifically listed in the final booking voucher.',
    ],
    exclusions: [
      'Flights to and from Leh.',
      'Inner-line/area permits, environment or other local fees unless explicitly included.',
      'Lunches, snacks, beverages and meals not listed as included.',
      'Monastery/monument entry tickets, optional activities, personal expenses, shopping, tips and travel insurance.',
      'Costs caused by weather delays, road closures, medical evacuation, itinerary changes or extra hotel nights unless covered by written terms.',
    ],
  },
  {
    id: DIBANG_ID,
    name: '7 Lakes Summit Series Trek – Dibang Valley',
    category: 'Special Expeditions',
    departure: 'Mid-June to 3rd week of November (30 trekkers a month)',
    duration: '8 days (Day 0 briefing + 7 trek days)',
    meetingCity: 'Anini, Dibang Valley, Arunachal Pradesh',
    price: 0,
    priceNote: 'Rate shared on enquiry',
    difficulty: 'Moderate to difficult',
    elevation: 'Up to 14,000 ft (Chene Pass)',
    image: DIBANG_IMAGE,
    themeColor: '#0369a1',
    textColor: '#0c4a6e',
    bgTint: 'rgba(3, 105, 161, 0.08)',
    whyChoose: [
      'Seven sacred alpine lakes, including the mighty Dini and the glowing Che-ne',
      'Rainforest, bamboo and pine give way to stark 14,000 ft boulder passes',
      'Idu Mishmi culture, folklore and sacred ecological taboos',
      'Handcrafted wooden log cabins at the central base camp (Emuh-ya Lake)',
      'Strictly capped at 30 trekkers a month for low impact and real solitude',
    ],
    route:
      'Anini → Emuli Village → Aniku Top → Camp 2 → Lake 1 → Lake 2 (Emuh-ya base camp) → Lakes 3 & 4 → Chene Pass → Lakes 5, 6 & 7 → Camp 2 → Emuli Village → Anini. Total about 40 km on foot.',
    itinerary: DIBANG_DAYS.map((d) => ({
      day: d.d,
      title: d.t,
      description: d.text,
      bullets: d.bullets,
      meta: d.meta,
      alerts: d.alerts,
      note: d.note,
    })),
    accessNote:
      'A remote, regulated wilderness expedition. An Inner Line Permit (Indian nationals) or PAP (foreign nationals) is required, the trail closes after the 3rd week of November, and weather or road conditions can change the plan. Mandatory fitness proof: a 5 km run in under 35 minutes. Plan an 11–12 day travel window with at least one buffer day.',
    inclusions: DIBANG_INCLUDED,
    exclusions: DIBANG_EXCLUDED,
  },
  {
    id: 'everest-base-camp',
    name: 'Everest Base Camp Trek (Nepal)',
    category: 'Special Expeditions',
    departure: '1–14 May 2027 and 1–14 November 2027 (proposed)',
    duration: '14 days / 13 nights',
    meetingCity: 'Kathmandu, Nepal',
    price: 115000,
    priceNote: '₹1,15,000 per person — reference price, confirm with the Nepal operator',
    difficulty: 'Strenuous high-altitude trek',
    elevation: 'Base Camp 5,364 m · Kala Patthar approx. 5,545 m',
    image: EBC_IMAGE,
    themeColor: '#6d28d9',
    textColor: '#4c1d95',
    bgTint: 'rgba(109, 40, 217, 0.08)',
    whyChoose: [
      'Trek to Everest Base Camp at 5,364 m',
      'Kala Patthar viewpoint (about 5,545 m) if health, weather and guide assessment permit',
      'Views of Everest, Ama Dablam, Lhotse, Nuptse and surrounding Himalayan peaks',
      'Sherpa villages, suspension bridges, teahouses and Buddhist monasteries',
      'Kathmandu–Lukla–Kathmandu flights, subject to weather and operations',
    ],
    route:
      'Kathmandu → Lukla → Phakding → Namche Bazaar → Tengboche → Dingboche → Lobuche → Gorak Shep → Everest Base Camp → Kala Patthar → Pheriche → Namche Bazaar → Lukla → Kathmandu.',
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Kathmandu', description: 'Airport pickup, hotel check-in and trek briefing. Overnight in Kathmandu.' },
      { day: 'Day 2', title: 'Kathmandu to Lukla; trek to Phakding', description: 'Fly to Lukla, subject to weather and operations, then trek to Phakding. Overnight in a teahouse.' },
      { day: 'Day 3', title: 'Phakding to Namche Bazaar', description: 'Trek via Monjo and Sagarmatha National Park, crossing suspension bridges en route to Namche Bazaar.' },
      { day: 'Day 4', title: 'Acclimatization in Namche Bazaar', description: "Rest and acclimatize. An easy optional viewpoint hike may be arranged on the guide's advice." },
      { day: 'Day 5', title: 'Namche Bazaar to Tengboche', description: 'Follow scenic trails with Himalayan views; visit Tengboche Monastery if conditions allow.' },
      { day: 'Day 6', title: 'Tengboche to Dingboche', description: 'Continue through Sherpa settlements and alpine landscapes to Dingboche.' },
      { day: 'Day 7', title: 'Acclimatization in Dingboche', description: 'Rest and take an optional acclimatization hike only if appropriate and advised by the guide.' },
      { day: 'Day 8', title: 'Dingboche to Lobuche', description: "Trek through high-altitude terrain and the climbers' memorial area to Lobuche." },
      { day: 'Day 9', title: 'Lobuche to Everest Base Camp; return to Gorak Shep', description: 'Trek via Gorak Shep to Everest Base Camp, then return to Gorak Shep for the night.', meta: [['Everest Base Camp', '5,364 m']] },
      { day: 'Day 10', title: 'Kala Patthar; descend to Pheriche', description: 'Early hike to Kala Patthar if health, weather and guide assessment permit; descend to Pheriche.', meta: [['Kala Patthar', 'approx. 5,545 m']] },
      { day: 'Day 11', title: 'Pheriche to Namche Bazaar', description: 'Descend through the Khumbu trail towards Namche Bazaar. This is a long trekking day.' },
      { day: 'Day 12', title: 'Namche Bazaar to Lukla', description: 'Continue downhill via Phakding to Lukla. Overnight stay.' },
      { day: 'Day 13', title: 'Lukla to Kathmandu', description: 'Return flight to Kathmandu, subject to weather and flight operations. Overnight in Kathmandu.' },
    ],
    accessNote:
      'This is a trek to Everest Base Camp, not a Mount Everest summit expedition. Open to Indian passport holders, subject to operator confirmation. May and November 2027 are proposed dates, not confirmed reservations.',
    importantInfo: [
      'Technical climbing equipment such as harnesses, crampons, ice axes and summit down suits is not a standard requirement for this itinerary.',
      'Prepare for strenuous high-altitude trekking and follow your guide’s instructions at all times.',
      'The itinerary may change due to weather, flight disruptions, trail conditions or safety considerations.',
      'Lukla flights can be delayed or cancelled by weather. Confirm flight buffers and who pays for extra nights in writing.',
      '₹1,15,000 is a reference price from the supplied itinerary, not a verified VYRA quotation or confirmed 2027 rate. Confirm the full price, permits, meals, porter allowance, insurance and inclusions with the Nepal operator before accepting bookings.',
    ],
    inclusions: [
      'Kathmandu airport pickup and drop, as specified in the final package',
      'Two nights of Kathmandu accommodation with breakfast; any extra nights to be confirmed',
      'Kathmandu–Lukla–Kathmandu flight tickets, subject to final confirmation and weather / operations',
      'Teahouse accommodation during the trek',
      'Trek meals as detailed in the final operator itinerary; meal plan to be confirmed',
      'Experienced local trekking guide and trek manager, as contracted',
      'Porter support and luggage allowance, as confirmed by the operator',
      'Required trekking permits and applicable fees, as specified in the final quote',
      'Guide-carried first-aid kit and group communication arrangements, if provided',
      'VYRA welcome kit, only if listed in the final package',
    ],
    exclusions: [
      'Travel tickets to and from Kathmandu',
      'Personal travel insurance and high-altitude emergency rescue coverage',
      'Personal trekking clothing, footwear, sleeping bag and equipment',
      'Personal medicines, toiletries and personal expenses',
      'Tips for guides and support staff',
      'Medical treatment and emergency evacuation expenses',
      'Extra accommodation or meals caused by delays, unless covered in the contract',
      'Helicopter sightseeing or evacuation, unless explicitly included',
      'Any service not specifically listed under inclusions',
    ],
    thingsToCarry: [
      'Valid passport and required travel documents',
      'Trekking boots, comfortable trekking clothes and warm layers',
      'Waterproof jacket and trousers; insulated down jacket',
      'Thermal base layers, fleece, warm socks, gloves, hat and buff / scarf',
      'Trekking backpack and duffel bag within the operator’s weight limit',
      'Trekking poles, headlamp with spare batteries and sunglasses',
      'Reusable water bottles / hydration system and a water treatment method',
      'Sunscreen, lip balm, personal toiletries and personal medicines',
      'Sleeping bag, if not supplied by the operator',
      'Personal first-aid essentials and snacks as appropriate',
    ],
  },
];

// Standard guidelines from master document
export const STANDARD_INCLUSIONS = [
  'Local group transport from the stated meeting city where listed (Non-AC Tempo Traveller/minibus or local transport only when stated in the final package).',
  'One night of shared basic accommodation where available (Shared tent, dormitory or homestay accommodation as specified).',
  'Meals only as listed in the confirmed itinerary (for example, breakfast, lunch, snacks or dinner).',
  'Trek leader/local guide and basic first-aid support, appropriate to the route and local rules.',
  'Official forest/entry permits only where explicitly confirmed and included in the final voucher.',
];

export const STANDARD_EXCLUSIONS = [
  "Travel from the participant's home city to the meeting city and back.",
  'Meals not specifically listed, bottled drinks, personal snacks and personal shopping.',
  'Personal trekking gear, insurance, and emergency evacuation.',
  'Additional hotel nights or extra accommodation due to personal choice or delays.',
  'Unlisted local transport, optional jeep charges, or permit fees not listed in the confirmed package.',
  "Costs resulting from circumstances outside the operator's control.",
];

export const MASTER_CHECKLIST = [
  'Original government ID and a digital copy; booking confirmation',
  'Comfortable backpack with rain cover or waterproof liner',
  'Broken-in trekking shoes with good grip; avoid brand-new shoes on departure day; spare socks',
  'Weather-appropriate layers, rain jacket/poncho and quick-dry clothing',
  'At least 2 litres of water capacity; carry more if the leader instructs',
  'Packed lunch box if requested, reusable bottle and reusable snack container',
  'Personal medication, basic toiletries and personal hygiene items',
  'Headlamp/torch with working spare batteries',
  'Sun protection: sunglasses, sunscreen and cap',
  'Energy snacks in reusable packaging, electrolytes if suitable for you, and personal first-aid items',
  'Power bank, phone, and a small dry bag for electronics',
];

