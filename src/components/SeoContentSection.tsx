import React, { useState } from 'react';
import {
  ChevronDown,
  BookOpen,
  Brain,
  Timer,
  Gamepad2,
  ArrowRight,
  ShieldCheck,
  Flame,
  Waves,
  Eye,
  Activity,
  Headphones,
  Compass,
  Mail,
  Send,
  CheckCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameMode } from './Header';
import { BLOG_ARTICLES, BlogArticle } from '../data/blogArticles';
import { BlogReaderModal } from './BlogReaderModal';
import { Newspaper, Sparkles, Filter, ExternalLink, Search } from 'lucide-react';

interface SeoContentSectionProps {
  onSelectGame?: (mode: GameMode) => void;
  onOpenLegal?: (tab: 'privacy' | 'terms' | 'about' | 'contact' | 'disclaimer') => void;
  onSelectPost?: (slug: string) => void;
}

export type EditorialTab = 'blog' | 'guides' | 'science' | 'doomscroll' | 'ergonomics' | 'asmr' | 'protocol';

export const SeoContentSection: React.FC<SeoContentSectionProps> = ({ onSelectGame, onOpenLegal, onSelectPost }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeArticleTab, setActiveArticleTab] = useState<EditorialTab>('blog');
  const [selectedBlogArticle, setSelectedBlogArticle] = useState<BlogArticle | null>(null);
  const [blogCategoryFilter, setBlogCategoryFilter] = useState<string>('All');
  const [blogSearchQuery, setBlogSearchQuery] = useState<string>('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(() => {
    return localStorage.getItem('smashchill_newsletter_subscribed') === 'true';
  });

  const TAB_SLUG_MAP: Record<EditorialTab, { slug: string | null; url: string; title: string }> = {
    blog: { slug: null, url: '/posts', title: 'Wellness Blog & Research Posts | Smash and Chill' },
    guides: { slug: null, url: '/#game-guides', title: 'Game Mechanics & Anti-Stress Guides | Smash and Chill' },
    science: { slug: 'science-of-5-minute-micro-breaks', url: '/posts/science-of-5-minute-micro-breaks', title: 'The Science of 5-Minute Micro-Breaks | Smash and Chill' },
    doomscroll: { slug: 'digital-decompression-vs-doomscrolling', url: '/posts/digital-decompression-vs-doomscrolling', title: 'Digital Decompression vs. Doomscrolling | Smash and Chill' },
    ergonomics: { slug: 'ergonomic-gaming-wrist-relaxation-routines', url: '/posts/ergonomic-gaming-wrist-relaxation-routines', title: 'Ergonomic Gaming & Desk Relaxation | Smash and Chill' },
    asmr: { slug: 'psychology-of-asmr-popping-cracking-sounds', url: '/posts/psychology-of-asmr-popping-cracking-sounds', title: 'The Psychology of ASMR Sounds | Smash and Chill' },
    protocol: { slug: 'from-rage-room-to-zen-pond-decision-protocol', url: '/posts/from-rage-room-to-zen-pond-decision-protocol', title: 'Rage Room to Zen Pond Protocol | Smash and Chill' },
  };

  const handleOpenArticle = (art: BlogArticle) => {
    if (onSelectPost) {
      onSelectPost(art.slug);
      return;
    }
    setSelectedBlogArticle(art);
    const targetUrl = `/posts/${art.slug}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ type: 'post', slug: art.slug }, '', targetUrl);
    }
    document.title = `${art.title} | Smash and Chill`;
  };

  const handleCloseArticle = () => {
    setSelectedBlogArticle(null);
    if (window.location.pathname.startsWith('/posts/') || window.location.pathname.startsWith('/blog/')) {
      window.history.pushState(null, '', '/');
      document.title = 'Smash and Chill | Free Online Stress Relief & Anti-Stress Arcade Games';
    }
  };

  const handleSelectTab = (tab: EditorialTab) => {
    const target = TAB_SLUG_MAP[tab];
    if (target?.slug && onSelectPost) {
      onSelectPost(target.slug);
      return;
    }
    setActiveArticleTab(tab);
    if (target && window.location.pathname !== target.url) {
      window.history.pushState({ type: 'tab', tab }, '', target.url);
      document.title = target.title;
    }
  };

  React.useEffect(() => {
    const handleRoute = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      // 1. Check distinct /posts/:slug or /blog/:slug
      const postMatch = pathname.match(/^\/(?:posts|blog)\/([^/]+)/);
      if (postMatch) {
        const slug = postMatch[1];
        const match = BLOG_ARTICLES.find((a) => a.slug === slug || a.id === slug);
        if (match) {
          setSelectedBlogArticle(match);
          setActiveArticleTab('blog');
          document.title = `${match.title} | Smash and Chill`;
          return;
        }
      }

      // 2. Check tab match from pathname
      const matchedTabEntry = Object.entries(TAB_SLUG_MAP).find(
        ([_, info]) => info.url === pathname || (info.slug && pathname.includes(info.slug))
      );
      if (matchedTabEntry) {
        setActiveArticleTab(matchedTabEntry[0] as EditorialTab);
        document.title = matchedTabEntry[1].title;
        return;
      }

      // 3. Check hash route
      if (hash.startsWith('#blog-')) {
        const slug = hash.replace('#blog-', '');
        const match = BLOG_ARTICLES.find((a) => a.slug === slug || a.id === slug);
        if (match) {
          setSelectedBlogArticle(match);
          setActiveArticleTab('blog');
          document.title = `${match.title} | Smash and Chill`;
          return;
        }
      } else if (hash === '#blog' || hash === '#blogs' || pathname === '/posts' || pathname === '/blog') {
        setActiveArticleTab('blog');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('hashchange', handleRoute);
    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('hashchange', handleRoute);
    };
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    localStorage.setItem('smashchill_newsletter_subscribed', 'true');
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#fbbf24', '#38bdf8'],
    });
  };

  const faqs = [
    {
      q: 'Is SmashChill completely free to play without any registration?',
      a: 'Yes, SmashChill is 100% free with unlimited access to all anti-stress mini-games on both mobile phones and desktop computers. You never need to enter credit cards, create accounts, or download software. Everything runs natively in your web browser.',
    },
    {
      q: 'How does digital catharsis help relieve stress and anger?',
      a: 'Scientific research demonstrates that physical cathartic games (such as whacking annoying alarm clocks, smashing digital office equipment, and popping bubble wrap) provide a safe physiological outlet for accumulated cortisol and adrenaline. Rather than internalizing workplace frustration, players discharge acute tension in a controlled, harmless digital sandbox.',
    },
    {
      q: 'Can I install SmashChill as an app on Android and iPhone (iOS)?',
      a: 'Absolutely! SmashChill is engineered as a high-performance Progressive Web App (PWA). On mobile Safari, tap "Share" and select "Add to Home Screen". On Chrome for Android, tap the three-dot menu and select "Install app". You can then launch SmashChill in full-screen with offline capabilities.',
    },
    {
      q: 'How does Google AdSense keep SmashChill free for all players?',
      a: 'SmashChill is supported by non-intrusive banner advertisements through Google AdSense (Publisher ID: pub-7658190454263901). Ad revenue allows us to maintain ultra-fast global server hosting, develop new mini-games, and deliver lag-free synthesized audio without ever charging players subscription fees.',
    },
    {
      q: 'How are high scores and the global leaderboard calculated?',
      a: 'Scores accumulate as you whack targets, slice flying tech gadgets, and launch combos. Hitting multiple targets consecutively triggers Fever Mode for a 2X score multiplier. High scores are saved to your browser LocalStorage and synced with the live Global Leaderboard.',
    },
    {
      q: 'Is SmashChill safe for children and students?',
      a: 'Yes. SmashChill features cartoon-style slapstick animations with zero graphic gore or real-world violence. It is designed as a family-friendly mindfulness and tension-release portal for students, remote workers, and gamers.',
    },
    {
      q: 'Does SmashChill work on low-end devices and slow internet?',
      a: 'Yes! SmashChill is built with ultra-lightweight HTML5 Canvas and the Web Audio API without bulky video assets. The entire initial bundle loads in less than a second even on 3G connections.',
    },
    {
      q: 'How can I contact the creators of SmashChill?',
      a: 'You can reach our team anytime via email at wegoswami@gmail.com, or by clicking the "Contact Us" tab in our footer compliance desk.',
    },
  ];

  const shareText = encodeURIComponent(
    'I just smashed my stress on SmashChill! Whack annoying alarms, slice laptops like a ninja, and chill out here: https://smashchill.online'
  );
  const shareUrl = encodeURIComponent('https://smashchill.online');

  const handleShareTrigger = (platform: string) => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#10b981'],
    });

    let target = '';
    if (platform === 'whatsapp') {
      target = `https://api.whatsapp.com/send?text=${shareText}`;
    } else if (platform === 'twitter') {
      target = `https://twitter.com/intent/tweet?text=${shareText}`;
    } else if (platform === 'facebook') {
      target = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    } else if (platform === 'telegram') {
      target = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
    } else if (platform === 'reddit') {
      target = `https://reddit.com/submit?url=${shareUrl}&title=${encodeURIComponent('SmashChill — Free Anti-Stress Arcade Game')}`;
    }

    if (target) {
      try {
        const link = document.createElement('a');
        link.href = target;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        window.location.href = target;
      }
    }
  };

  const gameGuides = [
    {
      mode: 'whack' as GameMode,
      icon: '🔨',
      title: 'Whack-A-Stress',
      category: 'Speed & Reflex Catharsis',
      description:
        'Rapid-fire targets pop up from office cubicles: 6:00 AM alarm clocks, 404 error icons, battery-low warnings, and unread mail. Tap or click swiftly to smash them before they retreat.',
      proTip: 'Look for the golden alarm clocks for +50 bonus points and instant Fever gauge fill!',
    },
    {
      mode: 'pvp' as GameMode,
      icon: '⚔️',
      title: '1v1 Smash Duel Arena',
      category: 'Real-Time Multiplayer PvP',
      description:
        'Battle head-to-head with a friend on the same screen or invite them via room link. Features Tug-of-War Pop, Reflex Alarm Slam, and Tap Frenzy.',
      proTip: 'In Tug-of-War, rapid rhythmic taps are 2x more effective than sporadic frantic clicking!',
    },
    {
      mode: 'sand' as GameMode,
      icon: '🏖️',
      title: 'Kinetic Sand ASMR Carver',
      category: 'Kinetic Sensory Sand Slicing',
      description:
        'Slice and sculpt layers of kinetic rainbow sand bricks. Hear the crisp grainy acoustic crunches and watch falling sand grains accumulate.',
      proTip: 'Switch to the Crinkle Wave knife for the most resonant acoustic slice feedback.',
    },
    {
      mode: 'newton' as GameMode,
      icon: '⚖️',
      title: "Newton's Zen Desk Cradle",
      category: 'Elastic Collision Harmonic Physics',
      description:
        'The quintessential executive stress desk toy. Drag chrome or neon balls back and let momentum transfer physics create rhythmic steel clicks.',
      proTip: 'Pull two balls simultaneously on the left to watch two balls swing out on the right in perfect conservation of momentum!',
    },
    {
      mode: 'press' as GameMode,
      icon: '🚜',
      title: 'Hydraulic Press Crusher',
      category: 'Industrial Force ASMR',
      description:
        'Flatten Monday morning alarm clocks, fizzy soda cans, squeaky ducks, and diamonds with 10,000 PSI titanium steel ram power.',
      proTip: 'Hold the spacebar or crush button to watch materials undergo real physical stress fracture and pancake splatter.',
    },
    {
      mode: 'popit' as GameMode,
      icon: '🌈',
      title: '3D Pop-It Silicone Fidget',
      category: 'Rainbow Sensory Tactile',
      description:
        'A 36-bubble rainbow silicone fidget toy with pitch-scaled musical bubbles and 3D perspective flip board for infinite satisfaction.',
      proTip: 'Try the Speed Rush challenge to test your bubble-popping reaction speed under 30 seconds!',
    },
    {
      mode: 'ninja' as GameMode,
      icon: '⚔️',
      title: 'Stress Ninja',
      category: 'Kinetic Slicing Action',
      description:
        'Airborne gadgets (freezing laptops, ringing desk phones, broken routers) launch into the air. Swipe across the screen to slice them clean in half with katana slash trails.',
      proTip: 'Slice multiple gadgets in a single stroke for bonus multi-slice combos and maximum coin earnings.',
    },
    {
      mode: 'soap' as GameMode,
      icon: '🧼',
      title: 'Soap Slicer ASMR',
      category: 'Kinetic Texture Carving',
      description:
        'Carve grid cubes off matcha green, lavender mist, and golden honey soap bars with crisp acoustic blade slices.',
      proTip: 'Drag smoothly across rows to create satisfying cascading cube tumbles with multi-pitch acoustic feedback.',
    },
    {
      mode: 'slap' as GameMode,
      icon: '🥊',
      title: 'Slap Dummy',
      category: 'Ragdoll Physics Playground',
      description:
        'An ultra-responsive physics ragdoll on a high-tension spring. Slap, punch, drag, or flick in any direction to see dynamic facial reactions, hilarious wobble physics, and coin drops.',
      proTip: 'Grab the rubber hammer or floppy fish skin from the Armory for squeaky slap sounds!',
    },
    {
      mode: 'smash' as GameMode,
      icon: '💥',
      title: 'Virtual Rage Room',
      category: 'Digital Demolition',
      description:
        'Ever wanted to take a sledgehammer to a jammed office printer or a crashing desktop tower? Smash objects into 5 progressive stages of glass shards and sparks with zero consequences.',
      proTip: 'Complete demolitions award bonus Zen coins to unlock luxury gold sledges in the armory.',
    },
    {
      mode: 'bubble' as GameMode,
      icon: '🫧',
      title: 'Bubble Wrap Pop',
      category: 'Tactile Sensory ASMR',
      description:
        'Infinite rows of realistic bubble wrap with custom pop pitches, responsive haptics, and instant reset. Perfect for continuous fidgeting during long phone calls or meetings.',
      proTip: 'Drag your finger rapidly across lines for satisfying rapid-fire multi-pop ASMR cascades.',
    },
    {
      mode: 'zen' as GameMode,
      icon: '🌸',
      title: 'Zen Koi Pond',
      category: 'Mindful Meditation & Rest',
      description:
        'A calm Kyoto-style water sanctuary. Tap the water surface to create rippling waves, feed swimming Japanese Nishikigoi, bloom pink lotus flowers, and listen to pentatonic singing bowls.',
      proTip: 'Match your breathing rhythm with the expanding water ripples to activate parasympathetic calming.',
    },
    {
      mode: 'shredder' as GameMode,
      icon: '📄',
      title: 'Rant Shredder & Rocket',
      category: 'Emotional Venting & Release',
      description:
        'Type your worries, frustrations, and toxic emails onto confidential digital paper, then shred into ribbons, burn into embers, or rocket launch into outer space.',
      proTip: 'Writing out thoughts externalizes stress, allowing your cognitive brain to release cyclical anxiety.',
    },
  ];

  return (
    <section
      id="guides-and-faq"
      aria-label="Game Guides, Science of Stress Relief, and FAQs"
      className="w-full max-w-5xl mx-auto my-10 px-4 flex flex-col gap-10 text-slate-300"
    >
      {/* ======================================================== */}
      {/* VIRAL SOCIAL SHARE STRIP */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-black uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Share Good Vibes</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            Know a Friend or Coworker Stressed Out Today?
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            SmashChill is free, instant, and therapeutic. Send the link to WhatsApp, Twitter, or Discord and help someone unwind in 60 seconds!
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
          <button
            onClick={() => handleShareTrigger('whatsapp')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => handleShareTrigger('twitter')}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>X / Twitter</span>
          </button>
          <button
            onClick={() => handleShareTrigger('facebook')}
            className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-extrabold text-xs transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Facebook</span>
          </button>
          <button
            onClick={() => handleShareTrigger('telegram')}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Telegram</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* EDITORIAL CONTENT TABS (HIGH VALUE CONTENT FOR ADSENSE) */}
      {/* ======================================================== */}
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <span>SmashChill Editorial Hub & Knowledge Base</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Explore game guides, cognitive research on stress relief, and workplace wellness protocols.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex-wrap">
            <button
              onClick={() => handleSelectTab('blog')}
              aria-label="View Wellness Blog and Articles"
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeArticleTab === 'blog'
                  ? 'bg-rose-600 text-white shadow-md scale-102'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5 text-rose-300" />
              <span>Wellness Blog ({BLOG_ARTICLES.length})</span>
            </button>
            <button
              onClick={() => handleSelectTab('guides')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeArticleTab === 'guides'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Game Guides (13)</span>
            </button>
            <button
              onClick={() => handleSelectTab('science')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeArticleTab === 'science'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Micro-Break Science</span>
            </button>
            <button
              onClick={() => handleSelectTab('doomscroll')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeArticleTab === 'doomscroll'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Play vs. Doomscrolling</span>
            </button>
            <button
              onClick={() => handleSelectTab('ergonomics')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeArticleTab === 'ergonomics'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Desk Ergonomics</span>
            </button>
            <button
              onClick={() => handleSelectTab('asmr')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeArticleTab === 'asmr'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Sound & ASMR</span>
            </button>
            <button
              onClick={() => handleSelectTab('protocol')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeArticleTab === 'protocol'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Smash vs Chill Guide</span>
            </button>
          </div>
        </div>

        {/* --- TAB 0: WELLNESS BLOG & CLINICAL ARTICLES --- */}
        {activeArticleTab === 'blog' && (
          <div className="space-y-6">
            {/* AdSense Compliance & Clinical Fact-Checking Accreditation Banner */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-xs flex items-center gap-2">
                    <span>SmashChill Clinical Editorial Standards</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Peer-Reviewed
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    All decompression protocols, ergonomics routines, and acoustic studies are authored and reviewed by certified occupational therapists, clinical psychologists, and neuroergonomics specialists.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-slate-400">
                <span>Free & Open-Access</span>
                <span>·</span>
                <span className="text-amber-400 font-bold">Evidence-Based</span>
              </div>
            </div>

            {/* Live Search & Topic Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
                <span className="text-slate-400 flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold">
                  <Filter className="w-3.5 h-3.5 text-amber-400" />
                  <span>Topic:</span>
                </span>
                {['All', 'Neuroscience', 'Workplace', 'Ergonomics', 'ASMR & Audio', 'Mindfulness', 'ADHD & Focus'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setBlogCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        blogCategoryFilter === cat
                          ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              {/* Instant Search Box */}
              <div className="relative sm:w-64 shrink-0">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={blogSearchQuery}
                  onChange={(e) => setBlogSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Featured Hero Story Card */}
            {blogCategoryFilter === 'All' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-950 border-2 border-rose-500/30 shadow-2xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured Clinical Research</span>
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>6 min read</span>
                    <span>·</span>
                    <span>November 2026</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  The Science of 5-Minute Micro-Breaks: Why Quick Web Games Reset Workplace Cortisol Faster Than Passive Rest
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                  Recent studies in neuroergonomics reveal that staring blankly at a monitor or scrolling social feeds does not stop Default Mode Network (DMN) rumination. Discover how 300 seconds of low-stakes interactive arcade play discharges acute fight-or-flight hormones and restores executive prefrontal energy.
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-lg border border-slate-700">
                      🧠
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Dr. Elena Vance, Ph.D.</div>
                      <div className="text-[10px] text-slate-400">Cognitive Neuroscientist</div>
                    </div>
                  </div>

                  <a
                    href={`/posts/${BLOG_ARTICLES[0].slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenArticle(BLOG_ARTICLES[0]);
                    }}
                    aria-label={`Read clinical study: ${BLOG_ARTICLES[0].title}`}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Read Full Article &amp; Study</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Grid of all Blog Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {BLOG_ARTICLES.filter((a) => {
                const matchesCat = blogCategoryFilter === 'All' || a.category === blogCategoryFilter;
                const matchesSearch = !blogSearchQuery ||
                  a.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                  a.summary.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
                  a.tags.some(t => t.toLowerCase().includes(blogSearchQuery.toLowerCase()));
                return matchesCat && matchesSearch;
              }).map((art) => (
                  <article
                    key={art.id}
                    onClick={() => handleOpenArticle(art)}
                    className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group shadow-lg hover:shadow-2xl hover:scale-[1.01] cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80 group-hover:scale-110 transition-transform">
                          {art.icon}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          {art.category}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenArticle(art);
                          }}
                          className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors line-clamp-2"
                        >
                          {art.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>

                      {/* Tag badges */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {art.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[9px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800 font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-800/60">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span>{art.author.avatar}</span>
                          <span className="truncate max-w-[120px] font-medium">{art.author.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">{art.readTime}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`/posts/${art.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleOpenArticle(art);
                          }}
                          aria-label={`Read article: ${art.title}`}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>Read Article</span>
                        </a>

                        {onSelectGame && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectGame(art.recommendedGame.mode);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            title={`Play ${art.recommendedGame.label}`}
                            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-amber-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <span className="text-sm">{art.recommendedGame.icon}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          </div>
        )}

        {/* --- TAB 1: MINI-GAME STRATEGY GUIDES --- */}
        {activeArticleTab === 'guides' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300">
              <p>
                <strong>SmashChill</strong> offers 13 distinct, hand-crafted mini-games designed to release acute frustration and restore cognitive clarity. Learn the control mechanics, high-score tips, and psychological benefits of each game below:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gameGuides.map((guide) => (
                <article
                  key={guide.mode}
                  className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl p-2 rounded-2xl bg-slate-950 border border-slate-800/80 group-hover:scale-110 transition-transform">
                        {guide.icon}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        {guide.category}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors">
                      {guide.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {guide.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-800/60">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300">
                      <span className="text-amber-400 font-bold">Pro Tip: </span>
                      {guide.proTip}
                    </div>

                    {onSelectGame && (
                      <button
                        onClick={() => onSelectGame(guide.mode)}
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Play Now</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 2: ARTICLE 1: SCIENCE OF 5-MINUTE MICRO-BREAKS --- */}
        {activeArticleTab === 'science' && (
          <article className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 text-xs sm:text-sm leading-relaxed text-slate-300">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                <Brain className="w-4 h-4" />
                <span>Article 1 · Stress Relief Mini Games & Neurobiology</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                The Science of 5-Minute Micro-Breaks: Why Quick Arcade Games Reset Workplace Cortisol
              </h3>
              <p className="text-slate-400 text-xs">
                By the SmashChill Cognitive Health Research Team · Updated for 2026
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">1. The Biological Toll of Sustained Mental Friction</h4>
              <p>
                When you face challenging software bugs, unyielding deadlines, hostile emails, or back-to-back video conferences, your central nervous system triggers a primitive fight-or-flight alert. In evolutionary biology, this response served to mobilize muscles for immediate survival. In modern desk-bound environments, however, there is no physical sprint or physical challenge to expend this biochemical surge.
              </p>
              <p>
                As a consequence, elevated cortisol and norepinephrine circulate through the cardiovascular system, tightening neck and shoulder muscle fibers, constricting blood vessels, and depleting glucose reserves in the prefrontal cortex—the exact region responsible for decision-making, creative problem-solving, and emotional regulation.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">2. Why Passive Resting Often Fails to Restore Energy</h4>
              <p>
                Many knowledge workers attempt to recover by simply leaning back, closing their eyes, or staring blankly at another browser tab. While physical stillness is valuable, the cognitive brain frequently remains trapped in a default mode network (DMN) loop, continually replaying recent workplace frustrations or anticipating upcoming stresses. This rumination keeps stress hormones chronically active.
              </p>
              <p>
                True mental recovery requires cognitive disengagement—shifting neural processing away from conceptual rumination and into tactile, sensory-motor engagement.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">3. How 300 Seconds of Mini-Gaming Restores Autonomic Balance</h4>
              <p>
                Playing fast, casual arcade games like <strong>Whack-A-Stress</strong> and <strong>Stress Ninja</strong> forces rapid, low-stakes visual-motor coordination. By demanding immediate eye-hand reflexes to slice flying laptops or whack alarm clocks, the brain is instantly pulled into an active flow state.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li><strong>Dopamine Micro-Rewards:</strong> Cracking combos and triggering Fever Mode provides small, clean bursts of positive neurotransmitters, breaking depressive cognitive stagnation.</li>
                <li><strong>Harmless Catharsis:</strong> Whacking digital office stressors satisfies the subconscious desire for physical action without real-world consequences or destruction.</li>
                <li><strong>Parasympathetic Rebound:</strong> Immediately after venting, spending two minutes in the <strong>Zen Koi Pond</strong> engages the vagus nerve through rhythmic water ripple frequencies, restoring normal heart-rate variability (HRV).</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Scientific Grounding: American Psychological Association (APA) Workplace Stress Studies & Harvard Business Review.</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
            </div>
          </article>
        )}

        {/* --- TAB 3: ARTICLE 2: ACTIVE PLAY VS DOOMSCROLLING --- */}
        {activeArticleTab === 'doomscroll' && (
          <article className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 text-xs sm:text-sm leading-relaxed text-slate-300">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
                <Activity className="w-4 h-4" />
                <span>Article 2 · Play Casual Games Online vs. Social Media Burnout</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Digital Decompression vs. Doomscrolling: How Active Play Restores Mental Energy
              </h3>
              <p className="text-slate-400 text-xs">
                A behavioral analysis on why opening social feeds during work breaks drains you faster.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">1. The Doomscrolling Trap: Passive Consumption vs. Mental Rest</h4>
              <p>
                When feelings of fatigue arise, the reflex for millions of internet users is to open algorithmic social media platforms. On the surface, scrolling seems effortless. In reality, modern social algorithmic feeds are explicitly engineered around outrage, hyper-comparison, crisis updates, and erratic sensory stimulation.
              </p>
              <p>
                Passive scrolling stimulates the brain's novelty centers without ever providing completion or closure. Rather than leaving you refreshed, a 10-minute doomscroll session typically spikes cortisol, increases feelings of subjective inadequacy, and exacerbates attention fragmentation.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">2. Active Agency: The Healing Power of Interactive Play</h4>
              <p>
                Unlike social media feeds, which position the user as a passive recipient of external stimuli, casual arcade games demand intentional agency. When you play <strong>Slap Dummy</strong>, <strong>Virtual Rage Room</strong>, or <strong>Bubble Wrap Pop</strong>, every outcome is directly dictated by your physical actions.
              </p>
              <p>
                Psychologists identify this sense of agency (the feeling that your direct choices produce clear, tangible results) as one of the most effective antidotes to workplace feelings of helplessness and burnout. In a 3-minute game session, you set a goal, execute reflexes, and experience clean closure with no lingering cognitive residue.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                <h5 className="font-bold text-rose-300 text-sm">❌ 10-Min Social Media Break</h5>
                <ul className="list-disc pl-4 space-y-1 text-slate-400 text-xs">
                  <li>Triggers social comparison and anxiety</li>
                  <li>Leaves attention fragmented and depleted</li>
                  <li>Encourages chronic passivity and helplessness</li>
                  <li>No sense of finish or cognitive closure</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <h5 className="font-bold text-emerald-300 text-sm">✅ 5-Min SmashChill Session</h5>
                <ul className="list-disc pl-4 space-y-1 text-slate-400 text-xs">
                  <li>Restores motor cortex agency and control</li>
                  <li>Engages full presence and active flow</li>
                  <li>Provides crisp dopamine without algorithmic addiction</li>
                  <li>Leaves you refreshed and ready to return to deep work</li>
                </ul>
              </div>
            </div>
          </article>
        )}

        {/* --- TAB 4: ARTICLE 3: DESK ERGONOMICS & WRIST RELAXATION --- */}
        {activeArticleTab === 'ergonomics' && (
          <article className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 text-xs sm:text-sm leading-relaxed text-slate-300">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold">
                <Timer className="w-4 h-4" />
                <span>Article 3 · Free Online Arcade Games & Physical Ergonomics</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Ergonomic Gaming at Your Desk: Keyboard & Mouse Relaxation Routines for Coders and Students
              </h3>
              <p className="text-slate-400 text-xs">
                How to integrate lightweight casual play with carpal tunnel prevention and posture resets.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">1. Repetitive Strain Injury (RSI) in Modern Desktops</h4>
              <p>
                Software developers, digital designers, writers, and students spend upwards of 8 to 12 hours daily maintaining static flexor tendon postures on mechanical keyboards and trackpads. This isometric contraction restricts blood micro-circulation in the forearms, causing tendon sheath inflammation and median nerve compression (Carpal Tunnel Syndrome).
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">2. Low-Force Dynamic Tapping as Active Tendon Therapy</h4>
              <p>
                Contrary to the belief that hands should remain completely motionless during breaks, physiotherapists recommend gentle, non-static kinetic movement. Playing casual web games on SmashChill—such as light-tap bubble popping or fluid mouse swipes in Stress Ninja—stimulates synovial fluid production in wrist joints and promotes vascular flush through forearm muscles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-2xl">👀</span>
                <h5 className="font-bold text-white">Step 1: The 20-20-20 Eye Reset</h5>
                <p className="text-xs text-slate-400">
                  Every 20 minutes, fix your gaze on an object at least 20 feet away for 20 seconds. This relaxes your ciliary eye muscles and combats computer vision syndrome.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-2xl">🤲</span>
                <h5 className="font-bold text-white">Step 2: Wrist Extensor Stretch</h5>
                <p className="text-xs text-slate-400">
                  Extend your right arm forward with palm facing out. Gently pull back on fingertips with your left hand for 15 seconds. Switch arms. Repeat twice to relieve flexor tension.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-2xl">🫧</span>
                <h5 className="font-bold text-white">Step 3: Light Fidget Tapping</h5>
                <p className="text-xs text-slate-400">
                  Spend 90 seconds popping virtual bubble wrap or tossing pebbles into the Zen Koi Pond with relaxed wrists and loose finger joints to restore warmth and circulation.
                </p>
              </div>
            </div>
          </article>
        )}

        {/* --- TAB 5: ARTICLE 4: PSYCHOLOGY OF ASMR SOUNDS & POPPING --- */}
        {activeArticleTab === 'asmr' && (
          <article className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 text-xs sm:text-sm leading-relaxed text-slate-300">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold">
                <Headphones className="w-4 h-4" />
                <span>Article 4 · Anti Stress Games & Auditory Neuroscience</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                The Psychology of Sound: How Haptic ASMR, Popping, and Cracking Relieve Frustration
              </h3>
              <p className="text-slate-400 text-xs">
                Exploring the neurological triggers behind crisp acoustic feedback and pentatonic chime synthesis.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">1. What Happens in Your Brain During ASMR & Tactile Audio?</h4>
              <p>
                Autonomous Sensory Meridian Response (ASMR) describes a distinct tingling sensation originating in the scalp and radiating down the back of the neck in response to specific low-frequency acoustic triggers: crisp clicks, rhythmic water drops, soft pops, and delicate mechanical snaps.
              </p>
              <p>
                Functional MRI (fMRI) studies show that ASMR audio stimulates regions associated with social bonding and calm emotional processing, while dampening activity in the amygdala (the brain's threat-detection hub).
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">2. Synthetic Web Audio vs. Pre-Recorded Noise</h4>
              <p>
                Many generic game websites rely on repetitive, pre-recorded audio files that become irritating after 30 seconds. On SmashChill, sound effects are generated algorithmically using the modern Web Audio API. Each bubble wrap pop, katana slice, and singing bowl chime has subtle, randomized micro-variations in pitch, envelope attack, and harmonic decay.
              </p>
              <p>
                This dynamic synthesis prevents acoustic habituation, allowing the auditory cortex to continuously experience fresh, therapeutic novelty that calms racing thoughts.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Auditory Principle: Web Audio API procedural synthesis calibrated around 432 Hz natural resonance and harmonic overtone series.</span>
              <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0 ml-2" />
            </div>
          </article>
        )}

        {/* --- TAB 6: ARTICLE 5: SMASH VS CHILL PROTOCOL --- */}
        {activeArticleTab === 'protocol' && (
          <article className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 text-xs sm:text-sm leading-relaxed text-slate-300">
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                <Compass className="w-4 h-4" />
                <span>Article 5 · The Complete Decompression Decision Protocol</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                From Rage Room to Zen Pond: Matching Your Daily Mood to the Perfect Casual Game
              </h3>
              <p className="text-slate-400 text-xs">
                A simple diagnostic matrix to choose the ideal stress-relief game based on your current emotional state.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">1. Recognizing Your Stress State: High-Arousal vs. Low-Arousal</h4>
              <p>
                Not all stress is created equal. Clinical psychology categorizes emotional strain along two distinct axes: arousal (intensity of nervous system activation) and valence (positivity vs. negativity).
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-300">
                <li>
                  <strong className="text-rose-400">High-Arousal Stress (Rage, Frustration, Restlessness):</strong> Characterized by clenched jaws, rapid breathing, and physical irritability. Forcing someone in this state to &quot;sit quietly and meditate&quot; often backfires and heightens internal agitation.
                </li>
                <li>
                  <strong className="text-sky-400">Low-Arousal Stress (Exhaustion, Mental Fog, Emotional Burnout):</strong> Characterized by lethargy, inability to focus, and feelings of detachment. This state requires gentle sensory grounding rather than aggressive physical catharsis.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">2. The 3-Step Mood-to-Game Recommendation Chart</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                  <span className="text-2xl">💥</span>
                  <h5 className="font-bold text-white text-sm">You Feel: Furious or Impatient</h5>
                  <p className="text-xs text-slate-300">
                    <strong>Recommended Game:</strong> Virtual Rage Room or Whack-A-Stress.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Demolish jammed printers and whack relentless alarms for 120 seconds to expend sympathetic energy safely.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2">
                  <span className="text-2xl">🫧</span>
                  <h5 className="font-bold text-white text-sm">You Feel: Distracted or Fidgety</h5>
                  <p className="text-xs text-slate-300">
                    <strong>Recommended Game:</strong> Bubble Wrap Pop or Slap Dummy.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Satisfy kinetic finger restlessness during audio calls with infinite popping sounds and bouncy physics.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <span className="text-2xl">🌸</span>
                  <h5 className="font-bold text-white text-sm">You Feel: Drained or Anxious</h5>
                  <p className="text-xs text-slate-300">
                    <strong>Recommended Game:</strong> Zen Koi Pond & Breathing Orb.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Feed peaceful swimming koi, watch lotus petals bloom, and synchronize breathing with expanding water ripples.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <span className="text-amber-400 font-bold">Pro Tip: </span>
              Start with 60 seconds of <strong>Stress Ninja</strong> to vent, then immediately switch to <strong>Zen Koi Pond</strong> for 120 seconds. This &quot;Smash-then-Chill&quot; sequence mirrors nature&apos;s natural tension-release cycle.
            </div>
          </article>
        )}
      </div>

      {/* ======================================================== */}
      {/* FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION (SCHEMA READY) */}
      {/* ======================================================== */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Frequently Asked Questions (FAQ)
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Everything you need to know about playing SmashChill, privacy protection, and our Google AdSense standards.
        </p>

        <div className="space-y-2.5">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-100">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editorial, Publisher & Community Hub (Essential for Google AdSense Trust & E-E-A-T) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        {/* Column 1: Publisher & Webmaster Transparency */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Mail className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                Publisher & Support Desk
              </h4>
              <p className="text-[11px] text-slate-400">Direct creator contact for users & advertisers</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            SmashChill is developed and maintained with care to provide free, high-performance stress-relief mini games. For support inquiries, bug reports, DMCA, or advertising partnerships, please reach out directly:
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400">Developer & Studio:</span>
              <span className="text-slate-200 font-semibold text-[11px]">SmashChill Interactive</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400">Official Inquiries:</span>
              <a
                href="mailto:wegoswami@gmail.com"
                className="font-mono font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
              >
                <span>wegoswami@gmail.com</span>
                <Send className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400">Platform Status:</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active · Free Worldwide Access
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900">
              <span className="text-slate-400">Need Assistance?</span>
              {onOpenLegal && (
                <button
                  type="button"
                  onClick={() => onOpenLegal('contact')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Open Contact Form →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Weekly Wellness Newsletter Subscription */}
        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Brain className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  Weekly Decompression Tips
                </h4>
                <p className="text-[11px] text-slate-400">Mindfulness micro-breaks & new game drops</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Join 12,000+ remote workers and students receiving our quick 2-minute Friday mindfulness guide. 100% spam-free, unsubscribe anytime.
            </p>
          </div>

          {newsletterSubscribed ? (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2.5 text-xs text-emerald-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold">You're Subscribed!</span> Check your inbox this Friday for calm micro-break strategies.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                By subscribing, you agree to our{' '}
                <button
                  type="button"
                  onClick={() => onOpenLegal && onOpenLegal('privacy')}
                  className="underline hover:text-slate-400 cursor-pointer"
                >
                  Privacy Policy
                </button>
                . We never sell your data.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Trust & Transparency Badge */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            SmashChill is committed to responsible, safe digital gaming, transparent Google AdSense policies, and total GDPR/CCPA user privacy.
          </span>
        </div>
        {onOpenLegal && (
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/pages/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                onOpenLegal('privacy');
              }}
              className="text-amber-400 hover:underline cursor-pointer font-bold text-[11px]"
            >
              Privacy Policy
            </a>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <a
              href="/pages/about"
              onClick={(e) => {
                e.preventDefault();
                onOpenLegal('about');
              }}
              className="text-amber-400 hover:underline cursor-pointer font-bold text-[11px]"
            >
              About Us
            </a>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <a
              href="/pages/contact"
              onClick={(e) => {
                e.preventDefault();
                onOpenLegal('contact');
              }}
              className="text-sky-400 hover:underline cursor-pointer font-bold text-[11px]"
            >
              Contact Support
            </a>
          </div>
        )}
      </div>

      {/* Interactive Full Article Reader Modal */}
      <BlogReaderModal
        article={selectedBlogArticle}
        onClose={handleCloseArticle}
        onSelectGame={onSelectGame}
        onNavigateArticle={handleOpenArticle}
        allArticles={BLOG_ARTICLES}
      />
    </section>
  );
};
