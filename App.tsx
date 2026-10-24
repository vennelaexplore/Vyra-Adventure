/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Compass,
  Mountain,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Briefcase,
  Phone,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Check,
  Droplets,
  Bug,
  X,
  ShieldCheck,
  Send,
  Users,
  MessageCircle,
} from 'lucide-react';
import DibangFeature, { DibangPrepare, AltitudeChart } from './DibangFeature.tsx';
import { DIBANG_ID } from './components/dibang.ts';
import { TOURS, STANDARD_INCLUSIONS, STANDARD_EXCLUSIONS, MASTER_CHECKLIST } from './components/tours.ts';
import { supabase } from './lib/supabase';

const ENQUIRY_PHONE = '7718840432';

const NAV_SECTIONS = [
  { id: 'section-itinerary', label: 'Itinerary', short: 'Itinerary' },
  { id: 'section-inclusions', label: 'Inclusions & Exclusions', short: 'Inclusions' },
  { id: 'section-before-you-book', label: 'Before You Book', short: 'Prepare' },
  { id: 'section-enquiry', label: 'Enquiry', short: 'Enquiry' },
] as const;

// Splits "A → B → C. Note text." into its stops plus any trailing note, so arrows can be styled and spaced.
const parseRoute = (route: string) => {
  const parts = route.split('→').map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return { stops: [] as string[], note: route };
  let note = '';
  const last = parts[parts.length - 1];
  const cut = last.search(/\.\s+\S/);
  if (cut > -1) {
    note = last.slice(cut + 1).trim();
    parts[parts.length - 1] = last.slice(0, cut);
  }
  parts[parts.length - 1] = parts[parts.length - 1].replace(/\.$/, '');
  return { stops: parts, note };
};

const CATEGORIES = ['All', 'Karnataka', 'Kerala & TN', 'Special Expeditions'] as const;

// Tours with no published rate use price 0 and show "On request".
const rupees = (n: number) => (n > 0 ? '₹' + n.toLocaleString('en-IN') : 'On request');

// Card badges get short, glanceable text so nothing is clipped. Full wording stays on the detail page.
const cardDuration = (d: string) => {
  const m = d.match(/^\d+\s*days?(\s*\/\s*\d+\s*nights?)?/i);
  return m ? m[0] : 'Duration varies';
};
const cardDifficulty = (d: string) => d.split(/\s+[—&]\s+|[;,(]/)[0].trim();

type QuoteFormState = {
  name: string;
  phone: string;
  email: string;
  date: string;
  notes: string;
};

export default function App() {
  const [selectedTourId, setSelectedTourId] = useState<string>('kudremukh');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [reference, setReference] = useState('');
  const [quoteForm, setQuoteForm] = useState<QuoteFormState>({
    name: '',
    phone: '',
    email: '',
    date: '',
    notes: '',
  });

  const [activeSection, setActiveSection] = useState<string>('section-itinerary');
  const [packed, setPacked] = useState<number[]>([]);
  useEffect(() => setPacked([]), [selectedTourId]);
  const togglePacked = (i: number) =>
    setPacked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryPulse, setEnquiryPulse] = useState(false);
  const [barStyle, setBarStyle] = useState<{ width: number; left: number }>({ width: 0, left: 0 });
  const menuRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const isClickScrollingRef = useRef<boolean>(false);
  const clickScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const moveBar = (tabId: string) => {
    const linkEl = tabRefs.current[tabId];
    const menuEl = menuRef.current;
    if (linkEl && menuEl) {
      const left =
        linkEl.offsetParent === menuEl
          ? linkEl.offsetLeft
          : linkEl.getBoundingClientRect().left - menuEl.getBoundingClientRect().left + menuEl.scrollLeft;
      const width = linkEl.offsetWidth || linkEl.getBoundingClientRect().width;
      setBarStyle({ width, left });
    }
  };

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    // Lock scroll-spy so intermediate scroll positions do NOT bounce the nav bar back to the left
    isClickScrollingRef.current = true;
    if (clickScrollTimerRef.current) {
      clearTimeout(clickScrollTimerRef.current);
    }

    setActiveSection(sectionId);
    moveBar(sectionId);

    // Gently scroll menu container horizontally only if it overflows
    const linkEl = tabRefs.current[sectionId];
    const menuEl = menuRef.current;
    if (linkEl && menuEl && menuEl.scrollWidth > menuEl.clientWidth) {
      const targetScroll = linkEl.offsetLeft - (menuEl.clientWidth - linkEl.offsetWidth) / 2;
      menuEl.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    }

    const isEnquiry = sectionId === 'section-enquiry';
    if (isEnquiry && window.innerWidth < 1024) {
      // Phones/tablets: the sidebar slides in as a drawer
      setEnquiryOpen(true);
    } else {
      // Land exactly under the sticky header + tab bar. On desktop, Enquiry scrolls to the sidebar column and flashes it.
      const el = document.getElementById(isEnquiry ? 'section-itinerary' : sectionId);
      if (el) {
        const headerH = document.getElementById('site-header')?.offsetHeight ?? 64;
        const navH = document.getElementById('tour-detail-navbar')?.offsetHeight ?? 52;
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - navH - 16;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
      if (isEnquiry) {
        setEnquiryPulse(true);
        setTimeout(() => setEnquiryPulse(false), 1500);
      }
    }

    // Release scroll lock after smooth scrolling completes
    clickScrollTimerRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 900);
  };

  const handleSelectTour = (tourId: string) => {
    setSelectedTourId(tourId);
    setActiveSection('section-itinerary');

    // Smoothly scroll down so the page begins from the nav bar containing the itinerary and all
    setTimeout(() => {
      const navEl = document.getElementById('tour-detail-navbar');
      if (navEl) {
        const headerHeight = window.innerWidth >= 640 ? 64 : 56;
        const y = navEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }, 20);
  };

  useEffect(() => {
    const update = () => moveBar(activeSection);
    const timer = setTimeout(update, 50);
    const timer2 = setTimeout(update, 200);
    window.addEventListener('resize', update);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      window.removeEventListener('resize', update);
      if (clickScrollTimerRef.current) {
        clearTimeout(clickScrollTimerRef.current);
      }
    };
  }, [activeSection, selectedTourId]);

  // Scroll-spy to activate nav tab as user manually scrolls down the page
  useEffect(() => {
    const handleScroll = () => {
      // Ignore scroll events during programmatic click scrolling
      if (isClickScrollingRef.current) return;

      const sectionIds = ['section-itinerary', 'section-inclusions', 'section-before-you-book'];
      const headerH = document.getElementById('site-header')?.offsetHeight ?? 64;
      const navH = document.getElementById('tour-detail-navbar')?.offsetHeight ?? 52;
      const line = headerH + navH + 40;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!enquiryOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEnquiryOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setEnquiryOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [enquiryOpen]);

  const selectedTour = useMemo(() => {
    return TOURS.find((t) => t.id === selectedTourId) || TOURS[0];
  }, [selectedTourId]);

  const filteredTours = useMemo(() => {
    if (filterCategory === 'All') return TOURS;
    return TOURS.filter((t) => t.category === filterCategory);
  }, [filterCategory]);

  const railRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const [rail, setRail] = useState({ canPrev: false, canNext: false, first: 1, last: 1 });

  const updateRail = () => {
    const el = railRef.current;
    if (!el || showAll) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 280) + 16;
    const visible = Math.max(1, Math.floor(el.clientWidth / step));
    const first = Math.min(filteredTours.length, Math.round(el.scrollLeft / step) + 1);
    setRail({
      canPrev: el.scrollLeft > 4,
      canNext: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      first,
      last: Math.min(filteredTours.length, first + visible - 1),
    });
  };

  const scrollRail = (dir: 1 | -1) => {
    const el = railRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  useEffect(() => {
    railRef.current?.scrollTo({ left: 0 });
    const raf = requestAnimationFrame(updateRail);
    window.addEventListener('resize', updateRail);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateRail);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTours, showAll]);

  const checklistItems = selectedTour.thingsToCarry ?? MASTER_CHECKLIST;

  // Enquiries are saved to a Supabase database table, then the visitor is
  // redirected to WhatsApp with a pre-filled message so the team is notified
  // instantly. The reference code is generated client-side and stored with
  // the enquiry for matching.
  const handleQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const website = String(new FormData(e.currentTarget).get('website') || ''); // honeypot
    if (website) {
      // Bot filled the hidden field — silently pretend success without sending anything.
      setReference('VA-' + Math.random().toString(36).slice(2, 8).toUpperCase());
      setQuoteSubmitted(true);
      return;
    }
    if (!quoteForm.name.trim() || !quoteForm.phone.trim()) {
      setSubmitError('Please enter your name and phone number.');
      return;
    }
    const name = quoteForm.name.trim();
    const phone = quoteForm.phone.trim();
    const email = quoteForm.email.trim();
    const notes = quoteForm.notes.trim();
    if (name.length > 120) {
      setSubmitError('Name is too long (max 120 characters).');
      return;
    }
    if (notes.length > 1000) {
      setSubmitError('Notes are too long (max 1000 characters).');
      return;
    }
    const phoneOk = /^[+()\d][\d\s()-]{6,19}$/.test(phone);
    if (!phoneOk) {
      setSubmitError('Please enter a valid phone number (7–20 digits).');
      return;
    }
    if (email) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk || email.length > 254) {
        setSubmitError('Please enter a valid email address.');
        return;
      }
    }
    // Simple client-side rate limit: no more than 3 enquiries per 10 minutes.
    const RATE_KEY = 'vyra_enq_rate';
    const WINDOW_MS = 10 * 60 * 1000;
    const MAX_SUBMITS = 3;
    const now = Date.now();
    const timestamps: number[] = (() => {
      try {
        const raw = localStorage.getItem(RATE_KEY);
        return raw ? (JSON.parse(raw) as number[]) : [];
      } catch {
        return [];
      }
    })().filter((t) => now - t < WINDOW_MS);
    if (timestamps.length >= MAX_SUBMITS) {
      setSubmitError('Too many enquiries submitted recently. Please wait a few minutes and try again, or call 7718840432.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const ref = 'VA-' + Date.now().toString(36).slice(-6).toUpperCase();

      const { error: dbError } = await supabase.from('enquiries').insert({
        reference: ref,
        tour_id: String(selectedTour.id),
        tour_name: selectedTour.name,
        departure: selectedTour.departure,
        meeting_city: selectedTour.meetingCity,
        travelers: travelersCount,
        quoted_price: selectedTour.price,
        name,
        phone,
        email: email || null,
        preferred_date: quoteForm.date.trim() || null,
        notes: notes || null,
        status: 'new',
      });

      if (dbError) {
        throw new Error(dbError.message);
      }

      // Also open WhatsApp so the team is notified instantly with a pre-filled message.
      const lines = [
        `*New VYRA ADVENTURE Enquiry*`,
        `Reference: ${ref}`,
        `Trek: ${selectedTour.name}`,
        `Departure: ${selectedTour.departure}`,
        `Meeting city: ${selectedTour.meetingCity}`,
        `Trekkers: ${travelersCount}`,
        `Estimated cost: ${rupees(selectedTour.price * travelersCount)}`,
        ``,
        `Name: ${name}`,
        `Phone: ${phone}`,
      ];
      if (email) lines.push(`Email: ${email}`);
      if (quoteForm.date) lines.push(`Preferred date: ${quoteForm.date.trim()}`);
      if (notes) lines.push(`Notes: ${notes}`);
      const text = encodeURIComponent(lines.join('\n'));
      const waUrl = `https://wa.me/91${ENQUIRY_PHONE}?text=${text}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      try {
        localStorage.setItem(RATE_KEY, JSON.stringify([...timestamps, Date.now()]));
      } catch {
        /* ignore quota / privacy errors */
      }
      setReference(ref);
      setQuoteSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.message
          ? `Could not save your enquiry: ${err.message}. Please call 7718840432.`
          : 'Could not send your enquiry. Please call 7718840432.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7] text-[#20252b]">
      {/* Top Banner Notice - Polished for Mobile */}
      <div className="relative bg-[linear-gradient(90deg,#0b4a3a_0%,#18231c_50%,#7a3f10_100%)] text-stone-200 text-xs py-2 sm:py-2.5 px-3 sm:px-6">
        {/* Accent line: emerald → sky → amber edge to echo the gradient */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-emerald-400 via-sky-400 to-amber-400" />
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="hidden sm:flex items-center gap-3 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="font-bold text-white text-xs shrink-0 tracking-[0.2em]">VYRA ADVENTURE</span>
            <span aria-hidden className="h-3 w-px bg-white/25 shrink-0"></span>
            <span className="text-stone-300 text-xs tracking-wide truncate">
              Explore • Trek • Discover • South India Treks &amp; Expeditions
            </span>
          </div>
          <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2.5 sm:gap-4 shrink-0">
            <span className="hidden md:block text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300">Call to book</span>
            {['7718840432', '9908766425'].map((num, i) => (
              <span key={num} className="contents">
                {i === 1 && <span aria-hidden className="hidden sm:block h-4 w-px bg-white/25"></span>}
                <a
                  href={`tel:${num}`}
                  className="group flex flex-1 sm:flex-none items-center justify-center gap-2 bg-white hover:bg-amber-50 text-black pl-1 pr-3.5 py-1 rounded-full ring-1 ring-amber-300/80 shadow-md transition"
                >
                  <span className="w-6 h-6 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <Phone className="w-3 h-3" />
                  </span>
                  <span className="font-black text-sm sm:text-base tracking-tight tabular-nums">{num}</span>
                </a>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header - Clean responsive height and mobile touch spacing */}
      <header id="site-header" className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs min-h-[58px] sm:h-16 py-2 sm:py-0 flex items-center">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 w-full flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Brand Info */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-600 text-white flex items-center justify-center font-black text-sm sm:text-xl shadow-xs shrink-0">
              <span>▲</span>
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <div className="font-black text-base sm:text-xl tracking-tight text-stone-900 leading-tight truncate">
                VYRA ADVENTURE
              </div>
              <div className="text-[10px] sm:text-[11px] tracking-wider uppercase font-bold text-stone-600 block mt-1 leading-tight whitespace-normal">
                South India Treks &amp; Expeditions
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Call Icon for Mobile with generous tap target */}
            <a
              href="tel:7718840432"
              className="flex sm:hidden items-center justify-center w-8.5 h-8.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition active:scale-95 border border-emerald-200/60"
              title="Call 7718840432"
              aria-label="Call 7718840432"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Desktop Contact Button */}
            <a
              href="tel:7718840432"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>7718840432</span>
            </a>

            {/* Custom Quote CTA Button */}
            <button
              type="button"
              onClick={() => {
                setQuoteSubmitted(false);
                setQuoteModalOpen(true);
              }}
              className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>
                <span className="sm:hidden">Get Quote</span>
                <span className="hidden sm:inline">Get Custom Quote</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1: TOP TOUR SHOWCASE CAROUSEL / GRID */}
      <section className="bg-white text-stone-900 pt-8 pb-10 border-y-2 border-stone-900">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <div className="mb-7 space-y-2">
            <span className="block text-xs uppercase tracking-widest font-bold text-emerald-700">
              Explore All {TOURS.length} Departures
            </span>
            <h2 className="font-coolvetica text-3xl sm:text-4xl md:text-5xl text-stone-900 leading-[1.1] font-black">
              Vyra Adventure Trek Collection
            </h2>
            <p className="text-sm text-stone-600 max-w-xl leading-relaxed">
              Select any tour below to inspect the verified route, timings, proposed rates, and day-by-day itinerary.
            </p>
          </div>

          <DibangFeature onOpen={() => handleSelectTour(DIBANG_ID)} />

          {/* Region filter: every option stays on screen, with live counts replacing the old hidden "N departures" note */}
          <div
            role="tablist"
            aria-label="Filter departures by region"
            className="grid grid-cols-2 sm:inline-flex items-center gap-1.5 bg-white p-1.5 rounded-xl border-2 border-stone-900 mb-6 w-full sm:w-auto"
          >
            {CATEGORIES.map((cat) => {
              const isCatActive = filterCategory === cat;
              const count = cat === 'All' ? TOURS.length : TOURS.filter((t) => t.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isCatActive}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3.5 py-2.5 sm:py-2 rounded-lg whitespace-nowrap transition cursor-pointer text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 ${
                    isCatActive
                      ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/50'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {cat === 'Special Expeditions' ? (
                    <>
                      <span className="sm:hidden">Expeditions</span>
                      <span className="hidden sm:inline">{cat}</span>
                    </>
                  ) : (
                    cat
                  )}
                  <span
                    className={`text-[11px] tabular-nums px-1.5 py-px rounded-full ${
                      isCatActive ? 'bg-emerald-800/60 text-emerald-50' : 'bg-stone-200 text-stone-800'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Position read-out + arrows + "View all": makes the off-screen tours discoverable */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-xs sm:text-sm text-stone-600 font-medium tabular-nums" aria-live="polite">
              {showAll
                ? `All ${filteredTours.length} departures`
                : `Showing ${rail.first}–${rail.last} of ${filteredTours.length}`}
            </p>
            <div className="flex items-center gap-2">
              {!showAll && (rail.canPrev || rail.canNext) && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollRail(-1)}
                    disabled={!rail.canPrev}
                    aria-label="Previous tours"
                    className="w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 border-stone-900 bg-white text-stone-900 hover:bg-stone-100 transition cursor-pointer disabled:opacity-30 disabled:cursor-default disabled:hover:bg-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollRail(1)}
                    disabled={!rail.canNext}
                    aria-label="Next tours"
                    className="w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 border-stone-900 bg-white text-stone-900 hover:bg-stone-100 transition cursor-pointer disabled:opacity-30 disabled:cursor-default disabled:hover:bg-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              {(showAll || rail.canPrev || rail.canNext) && (
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="ml-1 px-3.5 h-10 sm:h-8 rounded-lg text-xs font-bold bg-stone-900 border-2 border-stone-900 text-white hover:bg-stone-700 transition cursor-pointer"
                >
                  {showAll ? 'Back to carousel' : 'View all'}
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <div
              ref={railRef}
              onScroll={updateRail}
              style={
                showAll
                  ? undefined
                  : (() => {
                      // Soft fade on any edge that has more cards beyond it
                      const m = `linear-gradient(to right, ${rail.canPrev ? 'transparent' : '#000'} 0, #000 48px, #000 calc(100% - 48px), ${rail.canNext ? 'transparent' : '#000'} 100%)`;
                      return { WebkitMaskImage: m, maskImage: m };
                    })()
              }
              className={
                showAll
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-3 px-2 snap-x snap-mandatory scroll-smooth no-scrollbar'
              }
            >
              {filteredTours.map((tour) => {
                const isSelected = tour.id === selectedTour.id;
                return (
                  <div
                    key={tour.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => handleSelectTour(tour.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectTour(tour.id);
                      }
                    }}
                    className={`${
                      showAll ? 'w-full' : 'snap-start shrink-0 w-[74vw] max-w-72 sm:w-72'
                    } group rounded-2xl overflow-hidden bg-white border-2 cursor-pointer text-left transition duration-300 focus-visible:outline-2 focus-visible:outline-emerald-600 focus-visible:outline-offset-2 ${
                      isSelected
                        ? 'border-emerald-700 shadow-[5px_5px_0_0_#14532d] -translate-y-0.5'
                        : 'border-stone-900 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#1c1917]'
                    }`}
                  >
                    <div className="relative h-40 sm:h-44 overflow-hidden bg-stone-200">
                      <img
                        src={tour.image}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700 block"
                      />
                      {/* soft scrim keeps the location text readable on bright photos */}
                      <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="min-w-0 truncate bg-white/95 text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          {cardDuration(tour.duration)}
                        </span>
                        <span className="shrink-0 bg-emerald-700 text-white text-xs sm:text-[13px] font-black px-2.5 py-1 rounded-full shadow-sm">
                          {rupees(tour.price)}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-[11px] sm:text-xs font-semibold">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{tour.meetingCity}</span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5" style={{ borderTop: `4px solid ${tour.themeColor}` }}>
                      <h3
                        title={tour.name}
                        className="font-extrabold text-base sm:text-lg leading-snug tracking-tight text-stone-900 line-clamp-2 min-h-[2.6em]"
                      >
                        {tour.name}
                      </h3>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 min-w-0 text-xs sm:text-[13px] font-semibold text-stone-600">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tour.themeColor }} />
                          <span className="truncate">{cardDifficulty(tour.difficulty)}</span>
                        </span>
                        <span
                          className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full transition ${
                            isSelected
                              ? 'bg-emerald-700 text-white'
                              : 'bg-stone-100 text-stone-800 group-hover:bg-stone-900 group-hover:text-white'
                          }`}
                        >
                          {isSelected ? 'Viewing' : 'View details'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: DETAILED TOUR PAGE FOR SELECTED TRIP */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 w-full flex-1">
        {/* Navigation Bar with Sliding Underline at top of main */}
        <header id="tour-detail-navbar" className="sliding-navbar-header shadow-xs mb-6 sm:mb-8 scroll-mt-20">
          <nav aria-label="Main">
            <ul
              ref={menuRef}
              id="menu"
              onMouseLeave={() => moveBar(activeSection)}
              onScroll={() => moveBar(activeSection)}
              className="sliding-navbar-menu"
            >
              {NAV_SECTIONS.map((tab) => {
                const isActive = activeSection === tab.id;
                return (
                  <li key={tab.id} className="flex-1 text-center">
                    <a
                      ref={(el) => {
                        tabRefs.current[tab.id] = el;
                      }}
                      href={`#${tab.id}`}
                      onClick={(e) => handleNavClick(e, tab.id)}
                      onMouseEnter={() => moveBar(tab.id)}
                      onFocus={() => moveBar(tab.id)}
                      className={`sliding-navbar-link ${isActive ? 'active' : ''}`}
                    >
                      <span className="sm:hidden">{tab.short}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </a>
                  </li>
                );
              })}
              {/* Blue line that moves according to cursor movements */}
              <span
                className="sliding-navbar-bar"
                style={{
                  width: `${barStyle.width}px`,
                  transform: `translateX(${barStyle.left}px)`,
                }}
              />
            </ul>
          </nav>
        </header>

        {/* Selected Tour Hero Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200 shadow-sm mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider">
                  {selectedTour.category}
                </span>
                <span className="bg-stone-100 text-stone-700 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-500" />
                  {selectedTour.departure}
                </span>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  {cardDuration(selectedTour.duration)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight leading-tight">
                {selectedTour.name}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 sm:mt-5">
                {[
                  { Icon: MapPin, label: 'Meeting point', value: selectedTour.meetingCity, icon: 'bg-sky-600' },
                  { Icon: Mountain, label: 'Difficulty', value: selectedTour.difficulty, icon: 'bg-orange-600' },
                  { Icon: Compass, label: 'Elevation', value: selectedTour.elevation, icon: 'bg-emerald-600' },
                ].map(({ Icon, label, value, icon }) => (
                  <div key={label} className="flex items-center gap-3.5 rounded-2xl bg-white border-2 border-stone-900 p-4">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl text-white flex items-center justify-center ${icon}`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-500">{label}</span>
                      <strong className="block text-base sm:text-lg font-black leading-tight mt-0.5 text-stone-900">{value}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Box & Instant Action */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 lg:min-w-[280px] shrink-0 text-center lg:text-left flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-stone-500">Proposed Package Rate</span>
                <div className="text-3xl sm:text-4xl font-black text-stone-900 mt-0.5">
                  {rupees(selectedTour.price)}
                  {selectedTour.price > 0 && <span className="text-xs font-normal text-stone-500 ml-1">/ person</span>}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                  Updated budget prices — ₹500 reduction applied
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/80">
                <button
                  type="button"
                  onClick={() => {
                    setQuoteSubmitted(false);
                    setQuoteModalOpen(true);
                  }}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enquire now</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="text-[11px] text-stone-500 text-center mt-1.5">
                  Call / WhatsApp: <strong>7718840432</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Left Column: Structured Sections for Itinerary, Inclusions & Exclusions, Before You Book, Enquiry */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* SECTION 1: ITINERARY */}
            <section id="section-itinerary" className="scroll-mt-36 sm:scroll-mt-40 space-y-6">
              {/* Why Choose This Trek */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>Why Choose This Trek?</span>
                </h2>
                <ul className="space-y-2 text-sm sm:text-base font-medium text-stone-800">
                  {selectedTour.whyChoose.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Official Route */}
              <div className="bg-emerald-50/70 rounded-2xl p-5 sm:p-6 border border-emerald-200 shadow-xs">
                <h2 className="text-lg font-bold text-emerald-950 mb-2 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-700" />
                  <span>Official Route</span>
                </h2>
                {(() => {
                  const { stops, note } = parseRoute(selectedTour.route);
                  if (stops.length === 0) {
                    return <p className="text-sm sm:text-base font-semibold text-emerald-900 leading-relaxed">{note}</p>;
                  }
                  return (
                    <>
                      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 mt-4">
                        {stops.map((stop, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="bg-white border border-emerald-200 text-emerald-950 text-sm sm:text-base font-bold px-3 py-1.5 rounded-xl shadow-xs">
                              {stop}
                            </span>
                            {i < stops.length - 1 && (
                              <ArrowRight
                                aria-hidden
                                className={`w-5 h-5 shrink-0 ${
                                  ['text-orange-500', 'text-sky-500', 'text-fuchsia-500', 'text-amber-500'][i % 4]
                                }`}
                              />
                            )}
                          </li>
                        ))}
                      </ol>
                      {note && <p className="mt-4 text-sm text-emerald-900/80 leading-relaxed">{note}</p>}
                    </>
                  );
                })()}
              </div>

              {/* Suggested Itinerary Day by Day: vertical timeline */}
              <div className="bg-white rounded-2xl border-2 border-stone-900 overflow-hidden">
                <div className="flex items-center gap-3 px-5 sm:px-7 py-4 sm:py-5 border-b-2 border-stone-900 bg-stone-50">
                  <span className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">Suggested Itinerary</h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                      Verbatim official route plan for {selectedTour.name} as specified in the Vyra Adventure documentation.
                    </p>
                  </div>
                </div>

                {selectedTour.id === DIBANG_ID && <div className="px-5 sm:px-7 pt-5 sm:pt-7"><AltitudeChart /></div>}

                <ol className="p-5 sm:p-7">
                  {selectedTour.itinerary.map((dayItem, idx) => {
                    const isLast = idx === selectedTour.itinerary.length - 1;
                    return (
                      <li key={idx} className={`relative pl-12 sm:pl-14 ${isLast ? '' : 'pb-6 sm:pb-7'}`}>
                        {!isLast && (
                          <span aria-hidden className="absolute left-[19px] sm:left-[21px] top-11 bottom-0 w-0.5 bg-stone-300" />
                        )}
                        <span className="absolute left-0 top-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-700 text-white border-2 border-stone-900 flex items-center justify-center font-black text-sm sm:text-base">
                          {idx + 1}
                        </span>

                        <div className="rounded-xl bg-stone-50 border border-stone-200 hover:border-stone-900 hover:bg-white transition p-4 sm:p-5">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                            <span className="bg-amber-300 text-stone-900 text-xs font-black px-2.5 py-1 rounded-full">
                              {dayItem.day}
                            </span>
                            <h3 className="font-extrabold text-base sm:text-lg text-stone-900 leading-snug">
                              {dayItem.title}
                            </h3>
                          </div>

                          {dayItem.meta && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {dayItem.meta.map(([k, v]) => (
                                <span key={k} className="text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-full px-2.5 py-1">
                                  <span className="text-stone-500">{k}:</span> {v}
                                </span>
                              ))}
                            </div>
                          )}

                          {dayItem.description && (
                            <p className="mt-3 text-sm sm:text-base text-stone-700 leading-relaxed">
                              {dayItem.description}
                            </p>
                          )}

                          {dayItem.schedule && (
                            <div className="mt-4 divide-y divide-stone-200 border-t border-stone-200">
                              {dayItem.schedule.map((slot, sIdx) => (
                                <div key={sIdx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-2.5">
                                  <span className="font-bold text-emerald-800 text-xs sm:text-sm shrink-0 sm:w-32 tabular-nums">
                                    {slot.time}
                                  </span>
                                  <span className="text-sm sm:text-[15px] text-stone-800 font-medium leading-relaxed">
                                    {slot.activity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {dayItem.bullets && (
                            <ul className="mt-4 space-y-2.5">
                              {dayItem.bullets.map((bl, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-3 text-sm sm:text-[15px] text-stone-700 leading-relaxed">
                                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                                  <span>{bl}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {dayItem.alerts && (
                            <div className="mt-4 grid gap-2">
                              {dayItem.alerts.map((a) => (
                                <p key={a.text} className="flex items-start gap-2.5 rounded-lg bg-sky-50 border border-sky-200 px-3 py-2 text-sm text-stone-800">
                                  {a.kind === 'water' ? <Droplets className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" /> : <Bug className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />}
                                  <span>{a.text}</span>
                                </p>
                              ))}
                            </div>
                          )}
                          {dayItem.note && <p className="mt-3 text-xs sm:text-sm font-semibold text-stone-500">{dayItem.note}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>

            {/* SECTION 2: INCLUSIONS & EXCLUSIONS */}
            <section id="section-inclusions" className="scroll-mt-36 sm:scroll-mt-40">
              <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-4 sm:gap-6">
                {[
                  {
                    key: 'in',
                    title: 'Proposed Inclusions',
                    sub: 'What your package covers',
                    items: selectedTour.inclusions || STANDARD_INCLUSIONS,
                    Head: CheckCircle2,
                    headBg: 'bg-emerald-700',
                    strip: 'bg-emerald-50',
                    dot: 'bg-emerald-100 text-emerald-700',
                    Mark: Check,
                  },
                  {
                    key: 'ex',
                    title: 'What is Usually Excluded',
                    sub: 'Plan and budget for these separately',
                    items: selectedTour.exclusions || STANDARD_EXCLUSIONS,
                    Head: XCircle,
                    headBg: 'bg-rose-600',
                    strip: 'bg-rose-50',
                    dot: 'bg-rose-100 text-rose-600',
                    Mark: X,
                  },
                ].map(({ key, title, sub, items, Head, headBg, strip, dot, Mark }) => (
                  <div key={key} className="bg-white rounded-2xl border-2 border-stone-900 overflow-hidden">
                    <div className={`flex items-center gap-3 px-5 sm:px-6 py-4 border-b-2 border-stone-900 ${strip}`}>
                      <span className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 ${headBg}`}>
                        <Head className="w-5 h-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-stone-900 text-lg sm:text-xl leading-tight">{title}</h3>
                        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{sub}</p>
                      </div>
                      <span className="text-xs font-black text-white bg-stone-900 px-2.5 py-1 rounded-full tabular-nums shrink-0">
                        {items.length}
                      </span>
                    </div>
                    <ul className="divide-y divide-stone-200">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 px-5 sm:px-6 py-3.5">
                          <span className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${dot}`}>
                            <Mark className="w-3.5 h-3.5" strokeWidth={3} />
                          </span>
                          <span className="text-sm sm:text-[15px] font-medium text-stone-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 3: BEFORE YOU BOOK */}
            <section id="section-before-you-book" className="scroll-mt-36 sm:scroll-mt-40 space-y-6">
              {/* Important Access Note */}
              <div className="bg-amber-50 rounded-2xl p-5 sm:p-6 border border-amber-300 shadow-xs">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-950 text-base">Important Access Note</h3>
                    <p className="text-sm sm:text-base font-medium text-amber-900 mt-1 leading-relaxed">
                      {selectedTour.accessNote}
                    </p>
                    {selectedTour.importantInfo && (
                      <ul className="mt-3 space-y-2">
                        {selectedTour.importantInfo.map((line) => (
                          <li key={line} className="flex items-start gap-2.5 text-sm sm:text-[15px] text-amber-900 leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Before You Book Notice: four policies, each scannable on its own */}
              <div className="bg-white rounded-2xl border-2 border-stone-900 overflow-hidden">
                <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b-2 border-stone-900 bg-stone-50">
                  <span className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-stone-900 text-lg sm:text-xl leading-tight">Before You Book</h4>
                    <p className="text-xs sm:text-sm text-stone-500 mt-0.5">Four things worth knowing before you confirm.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-6">
                  {[
                    {
                      Icon: MapPin,
                      tone: 'bg-sky-600',
                      title: 'Meeting point',
                      body: 'Travel to the meeting city from your home city is not included unless the final package confirmation explicitly says otherwise.',
                    },
                    {
                      Icon: Compass,
                      tone: 'bg-orange-600',
                      title: 'Difficulty & distance',
                      body: 'Indicative. Actual route length, trekking hours, summit access and itinerary can change due to forest rules, weather and guide instructions.',
                    },
                    {
                      Icon: Mountain,
                      tone: 'bg-emerald-700',
                      title: 'Summit policy',
                      body: 'A summit or viewpoint is never guaranteed. The trek leader may turn the group around if conditions are unsafe.',
                    },
                    {
                      Icon: Users,
                      tone: 'bg-violet-600',
                      title: 'Fitness & eligibility',
                      body: 'Minimum age, fitness requirements, medical documentation and required identification must follow the current official operator/forest-authority rules.',
                    },
                  ].map(({ Icon, tone, title, body }) => (
                    <div key={title} className="rounded-xl bg-stone-50 border border-stone-200 p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-lg text-white flex items-center justify-center shrink-0 ${tone}`}>
                          <Icon className="w-4.5 h-4.5" />
                        </span>
                        <h5 className="font-bold text-stone-900 text-base sm:text-lg leading-tight">{title}</h5>
                      </div>
                      <p className="text-sm sm:text-[15px] text-stone-600 leading-relaxed mt-3">{body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTour.id === DIBANG_ID ? (
                <DibangPrepare />
              ) : (
                <>
              {/* Things to Carry Checklist */}
              <div className="bg-white rounded-2xl p-5 sm:p-7 border border-stone-200 shadow-xs">
                <h3 className="font-bold text-stone-900 text-lg mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  <span>Things to Carry — Checklist</span>
                </h3>
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mb-4">
                  <p className="text-xs sm:text-sm text-stone-500">Tap each item as you pack it.</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full tabular-nums">
                      {packed.length} of {checklistItems.length} packed
                    </span>
                    {packed.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPacked([])}
                        className="text-xs font-bold text-stone-500 hover:text-stone-800 underline underline-offset-2 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden mb-4" aria-hidden>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-[width] duration-300"
                    style={{ width: `${(packed.length / checklistItems.length) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-medium text-stone-800">
                  {checklistItems.map((item, idx) => {
                    const done = packed.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        role="checkbox"
                        aria-checked={done}
                        onClick={() => togglePacked(idx)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-left transition active:scale-[0.99] cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                          done
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'bg-stone-50 border-stone-200 hover:border-emerald-300 hover:bg-white'
                        }`}
                      >
                        <span
                          className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center transition ${
                            done ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-stone-300'
                          }`}
                        >
                          {done && <Check className="w-3.5 h-3.5" strokeWidth={3.5} />}
                        </span>
                        <span className={done ? 'text-stone-500 line-through decoration-emerald-400' : ''}>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
                </>
              )}
            </section>

            {/* Mobile-only Enquiry Section Card so mobile users land directly here when tapping Enquiry */}
            <div id="section-enquiry-mobile" className="lg:hidden scroll-mt-36">
              {/* Handled by right sidebar which is rendered below in normal flow */}
            </div>
          </div>

          {/* Right Sidebar: Booking & Contact & Policy notes - SECTION 4: ENQUIRY */}
          {enquiryOpen && (
            <div
              aria-hidden
              onClick={() => setEnquiryOpen(false)}
              className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-xs lg:hidden"
            />
          )}
          <div
            id="section-enquiry"
            role="complementary"
            aria-label="Booking enquiry"
            className={`space-y-4 fixed z-50 inset-x-0 bottom-0 max-h-[90dvh] rounded-t-3xl sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:bottom-auto sm:max-h-none sm:w-[420px] sm:rounded-none overflow-y-auto overscroll-contain bg-stone-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl transition-[transform,visibility] duration-300 ease-out ${
              enquiryOpen ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-y-0 sm:translate-x-full max-lg:invisible'
            } lg:static lg:z-auto lg:w-auto lg:col-span-4 lg:sticky lg:top-[8.5rem] lg:translate-x-0 lg:translate-y-0 lg:max-h-[calc(100vh-9.5rem)] lg:rounded-none lg:bg-transparent lg:p-2 lg:-m-2 lg:shadow-none ${
              enquiryPulse ? 'lg:ring-4 lg:ring-emerald-400/60 lg:rounded-3xl' : ''
            }`}
          >
            <div aria-hidden className="mx-auto h-1.5 w-12 rounded-full bg-stone-300 sm:hidden" />
            <div className="flex items-center justify-between lg:hidden">
              <span className="font-black text-stone-900">Enquiry</span>
              <button
                type="button"
                onClick={() => setEnquiryOpen(false)}
                aria-label="Close enquiry panel"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                ✕
              </button>
            </div>
            {/* Quick Inquiry Card */}
            <div className="bg-white rounded-3xl overflow-hidden border-2 border-stone-900 shadow-[6px_6px_0_0_#14532d]">
              <div className="bg-emerald-700 text-white px-5 sm:px-6 py-5 border-b-2 border-stone-900">
                <span className="bg-amber-300 text-stone-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                  Booking &amp; Reservation
                </span>
                <h3 className="font-black text-xl sm:text-2xl text-white tracking-tight leading-tight">
                  Enquire for <span className="text-amber-300">{selectedTour.name}</span>
                </h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {rupees(selectedTour.price)}
                  </span>
                  <span className="text-sm font-semibold text-emerald-100">
                    {selectedTour.price > 0 ? '/ person (planning rate)' : 'shared when you enquire'}
                  </span>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-emerald-50 font-semibold flex flex-wrap gap-x-4 gap-y-1">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    {selectedTour.departure}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    {selectedTour.meetingCity}
                  </span>
                </p>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
              {/* Number of Trekkers Selector - Well Organized & Prominent */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm sm:text-base font-extrabold text-stone-900 flex items-center gap-1.5">
                    <Users className="w-4.5 h-4.5 text-emerald-700" />
                    <span>Number of Trekkers</span>
                  </label>
                  <span className="text-xs font-black text-white bg-stone-900 px-2.5 py-1 rounded-full">
                    {travelersCount} {travelersCount === 1 ? 'Person' : 'People'}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 6].map((num) => {
                    const isNumActive = travelersCount === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTravelersCount(num)}
                        className={`py-3 rounded-xl text-base sm:text-lg font-black border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center shadow-xs active:scale-95 ${
                          isNumActive
                            ? 'bg-amber-300 text-stone-900 border-stone-900 shadow-[3px_3px_0_0_#14532d]'
                            : 'bg-white hover:bg-amber-50 text-stone-800 border-stone-300 hover:border-stone-900 font-bold'
                        }`}
                      >
                        <span>{num === 6 ? '6+' : num}</span>
                        <span className={`text-[10px] font-semibold -mt-0.5 ${isNumActive ? 'text-stone-700' : 'text-stone-500'}`}>
                          {num === 1 ? 'pax' : 'pax'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Total Highlight Box */}
              <div className="bg-emerald-50 border-2 border-dashed border-emerald-700 rounded-2xl p-4 sm:p-5 text-emerald-950 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800 block">
                    Estimated Total Cost
                  </span>
                  <span className="text-xs text-emerald-900/80 font-medium mt-0.5 block">
                    {selectedTour.price > 0
                      ? `${rupees(selectedTour.price)} × ${travelersCount} trekker${travelersCount > 1 ? 's' : ''}`
                      : `${travelersCount} trekker${travelersCount > 1 ? 's' : ''}`}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-900">
                  {rupees(selectedTour.price * travelersCount)}
                </div>
              </div>

              {/* Main CTA Button */}
              <button
                type="button"
                onClick={() => {
                  setQuoteSubmitted(false);
                  setQuoteModalOpen(true);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl border-2 border-stone-900 font-black text-base sm:text-lg shadow-[4px_4px_0_0_#0f172a] hover:shadow-[2px_2px_0_0_#0f172a] hover:translate-x-0.5 hover:translate-y-0.5 transition flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Send className="w-5 h-5" />
                <span>Send Booking Enquiry</span>
              </button>

              <div className="text-center text-xs font-semibold text-stone-500 -mt-2">
                Instant confirmation assistance • No advance cancellation fees
              </div>
              </div>
            </div>

            {/* Direct Contact from Document */}
            <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-sm space-y-2.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                Official Booking &amp; Enquiries
              </span>
              <h4 className="font-extrabold text-lg text-white">VYRA ADVENTURE</h4>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[13px] font-bold">
                <a
                  href="tel:7718840432"
                  className="flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 p-2.5 rounded-xl transition text-emerald-300"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>7718840432</span>
                </a>
                <a
                  href="tel:9908766425"
                  className="flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 p-2.5 rounded-xl transition text-emerald-300"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>9908766425</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Phone-only sticky action bar: price and one-tap enquiry always in reach */}
      {!enquiryOpen && !quoteModalOpen && (
        <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t-2 border-stone-900 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-3">
          <div className="shrink-0 leading-tight">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">From</span>
            <span className="block text-xl font-black text-stone-900 tabular-nums">
              {rupees(selectedTour.price)}
              {selectedTour.price > 0 && <span className="text-xs font-semibold text-stone-500"> / person</span>}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setEnquiryOpen(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 active:bg-orange-600 text-white font-black text-base py-3 border-2 border-stone-900 shadow-[3px_3px_0_0_#0f172a] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Enquire now</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="relative mt-14 pb-24 lg:pb-0 bg-[#0e1a14] text-stone-300">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-400 to-amber-400" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
            {/* Brand */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl shrink-0">▲</span>
                <span className="font-extrabold text-white text-xl sm:text-2xl tracking-[0.12em]">VYRA ADVENTURE</span>
              </div>
              <p className="mt-4 text-sm sm:text-[15px] text-stone-300 leading-relaxed max-w-sm">
                Guided treks and journeys across South India and beyond, planned with care for the people and the places.
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
                Explore • Trek • Discover • Respect Nature
              </p>
            </div>

            {/* Explore */}
            <nav aria-label="Browse treks" className="md:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">Explore treks</h4>
              <ul className="mt-4 space-y-1">
                {CATEGORIES.map((cat) => {
                  const count = cat === 'All' ? TOURS.length : TOURS.filter((t) => t.category === cat).length;
                  return (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => {
                          setFilterCategory(cat);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="group w-full flex items-center justify-between gap-3 py-2 text-sm sm:text-[15px] font-semibold text-stone-200 hover:text-white transition cursor-pointer text-left"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:bg-amber-300 transition" />
                          {cat === 'All' ? 'All departures' : cat}
                        </span>
                        <span className="text-xs tabular-nums text-stone-400">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Contact */}
            <div className="md:col-span-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">Booking &amp; enquiries</h4>
              <div className="mt-4 flex flex-col gap-2.5">
                {['7718840432', '9908766425'].map((num) => (
                  <a
                    key={num}
                    href={`tel:${num}`}
                    className="group flex items-center gap-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-300/70 px-3.5 py-2.5 transition"
                  >
                    <span className="w-8 h-8 rounded-full bg-amber-300 text-stone-900 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </span>
                    <span className="font-black text-white text-base sm:text-lg tracking-tight tabular-nums">{num}</span>
                  </a>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setQuoteSubmitted(false);
                  setQuoteModalOpen(true);
                }}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm sm:text-base py-3 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send a booking enquiry</span>
              </button>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 space-y-4">
            <p className="text-xs leading-relaxed text-stone-400 max-w-4xl">
              *Draft for planning and promotion. Final inclusions, supplier rates, permits, timings and terms must be
              confirmed before publishing or collecting payments. Prices and dates above are proposed planning details,
              not confirmed departures or supplier quotations.
            </p>
            <p className="text-xs text-stone-500">© {new Date().getFullYear()} VYRA ADVENTURE. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* CUSTOM QUOTE ENQUIRY MODAL */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92dvh] overflow-y-auto overscroll-contain p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-7 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setQuoteModalOpen(false)}
              aria-label="Close enquiry form"
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 text-xl cursor-pointer"
            >
              ✕
            </button>

            {!quoteSubmitted ? (
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-emerald-700 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> VYRA ADVENTURE Booking
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                  Enquire for {selectedTour.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Proposed Rate: <strong>{rupees(selectedTour.price)}</strong>{selectedTour.price > 0 ? ' / person' : ''} | {selectedTour.departure}
                </p>

                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 mt-4 mb-4 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Meeting Point:</span>
                    <span className="font-bold text-stone-800">{selectedTour.meetingCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Duration:</span>
                    <span className="font-bold text-stone-800">{selectedTour.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Total Trekkers:</span>
                    <span className="font-bold text-emerald-700">{travelersCount} Participant(s)</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-stone-200">
                    <span className="text-stone-600 font-semibold">Total Estimated Amount:</span>
                    <span className="font-black text-emerald-800 text-sm">
                      {rupees(selectedTour.price * travelersCount)}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleQuoteSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      maxLength={120}
                      placeholder="e.g. Aditi Rao"
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        maxLength={20}
                        placeholder="+91 98765 43210"
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        maxLength={254}
                        placeholder="you@domain.com"
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Special Notes / Medical / Fitness</label>
                    <textarea
                      rows={2}
                      maxLength={1000}
                      placeholder="Any prior high-altitude or trekking experience, diet preferences, pickup query..."
                      value={quoteForm.notes}
                      onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none resize-none"
                    />
                  </div>

                  {/* Honeypot: hidden from people, irresistible to bots */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                  {submitError && (
                    <p role="alert" className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700">
                      {submitError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-wait text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition cursor-pointer mt-2"
                  >
                    {submitting ? 'Sending…' : 'Submit Booking Enquiry to Vyra Adventure'}
                  </button>
                  <p className="text-[10px] text-stone-400 text-center">
                    Call: 7718840432 | 9908766425. Final permits &amp; slots subject to official booking window.
                  </p>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-black text-stone-900">Enquiry Received!</h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{quoteForm.name || 'Adventurer'}</strong>. Your booking enquiry for{' '}
                  <strong>{selectedTour.name}</strong> ({travelersCount} trekker(s)) has been logged.
                </p>
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs max-w-xs mx-auto text-left space-y-1">
                  {reference && <div>Reference: <strong>{reference}</strong></div>}
                  <div>Meeting City: <strong>{selectedTour.meetingCity}</strong></div>
                  <div>Estimated Cost: <strong>{rupees(selectedTour.price * travelersCount)}</strong></div>
                  <div>Assistance: <strong>7718840432 / 9908766425</strong></div>
                </div>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  WhatsApp should have opened with your enquiry pre-filled. If it didn't, tap below or call us directly.
                </p>
                <a
                  href={`https://wa.me/91${ENQUIRY_PHONE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-2.5 text-xs transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" /> Open WhatsApp
                </a>
                <div>
                  <button
                    type="button"
                    onClick={() => setQuoteModalOpen(false)}
                    className="bg-stone-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-stone-800 transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
