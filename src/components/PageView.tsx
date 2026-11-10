import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Shield,
  FileText,
  Info,
  Mail,
  AlertTriangle,
  Copyright,
  HelpCircle,
  Home,
  Check,
  Send,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PAGES_DATA, StaticPage } from '../data/pagesData';

interface PageViewProps {
  slug: string;
  onBackToArcade: () => void;
  onSelectPage: (slug: string) => void;
}

export const PageView: React.FC<PageViewProps> = ({
  slug,
  onBackToArcade,
  onSelectPage,
}) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('Feedback / Suggestion');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Normalize slug and find page
  const page = PAGES_DATA.find(
    (p) => p.slug === slug || p.aliases.includes(slug)
  ) || PAGES_DATA[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = page.title;

    // Dynamic SEO Metadata updates
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', page.description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://smashchill.online/pages/${page.slug}`);
    }

    document.querySelector('meta[property="og:title"]')?.setAttribute('content', page.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', page.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://smashchill.online/pages/${page.slug}`);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', page.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', page.description);
  }, [page]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMessage) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#fbbf24', '#38bdf8'],
      });
    }, 700);
  };

  const navTabs: { slug: string; label: string; icon: React.ReactNode }[] = [
    { slug: 'privacy-policy', label: 'Privacy Policy', icon: <Shield className="w-3.5 h-3.5" /> },
    { slug: 'terms-of-service', label: 'Terms of Service', icon: <FileText className="w-3.5 h-3.5" /> },
    { slug: 'about', label: 'About Us', icon: <Info className="w-3.5 h-3.5" /> },
    { slug: 'contact', label: 'Contact Us', icon: <Mail className="w-3.5 h-3.5" /> },
    { slug: 'medical-disclaimer', label: 'Disclaimer', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { slug: 'dmca-policy', label: 'DMCA Policy', icon: <Copyright className="w-3.5 h-3.5" /> },
    { slug: 'faq', label: 'FAQ', icon: <HelpCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-600 selection:text-white">
      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToArcade}
            aria-label="Back to Free Arcade Games"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>← Back to Arcade Games</span>
          </button>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <button
            onClick={onBackToArcade}
            className="hidden sm:flex items-center gap-2 text-xs font-black tracking-wider text-rose-400 uppercase"
          >
            <span>⚡ SMASH &amp; CHILL</span>
          </button>
        </div>

        <button
          onClick={onBackToArcade}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-black tracking-wide transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer"
        >
          <span>Play 15 Free Games ▶</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
          <button
            onClick={onBackToArcade}
            className="hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>Home</span>
          </button>
          <span className="text-slate-700">/</span>
          <a
            href="/pages"
            onClick={(e) => {
              e.preventDefault();
              onSelectPage('about');
            }}
            className="hover:text-amber-400 cursor-pointer transition-colors"
          >
            Pages
          </a>
          <span className="text-slate-700">/</span>
          <span className="text-slate-300 font-mono text-[11px] truncate max-w-[200px]">
            {page.slug}
          </span>
        </nav>

        {/* Tab Navigation Strip across all 7 pages */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-800 text-xs">
          {navTabs.map((tab) => {
            const isActive = page.slug === tab.slug || page.aliases.includes(tab.slug);
            return (
              <button
                key={tab.slug}
                onClick={() => onSelectPage(tab.slug)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dedicated Page Header Card */}
        <header className="space-y-4 border-b border-slate-800/80 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {page.category} · {page.badge}
            </span>
            <div className="text-xs text-slate-400 font-mono">
              Last Updated: <span className="text-slate-300">{page.lastUpdated}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {page.title.split('|')[0].trim()}
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {page.description}
          </p>

          {/* Canonical Slug Badge */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 w-fit">
            <span className="text-slate-500">Dedicated URL:</span>
            <span className="text-amber-400 font-bold">https://smashchill.online/pages/{page.slug}</span>
          </div>
        </header>

        {/* Structured Sections Body */}
        <div className="space-y-6 text-sm leading-relaxed text-slate-300">
          {page.sections.map((sec, sIdx) => (
            <section
              key={sIdx}
              className="space-y-3 p-5 sm:p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 shadow-md"
            >
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <span>{sec.heading}</span>
              </h2>
              {sec.body.map((p, pIdx) => (
                <p key={pIdx} className="text-slate-300 text-sm leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* Special Interactive Contact Form if Contact Page */}
        {(page.slug === 'contact' || page.aliases.includes('contact')) && (
          <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>Send Message to SmashChill Support</span>
            </div>

            {isSent ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h4 className="text-base font-extrabold text-white">Message Transmitted!</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Thank you! Our support team typically replies within 24-48 business hours. Direct email: wegoswami@gmail.com
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="mt-3 text-xs text-amber-400 hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Alex Miller"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Message Subject *</label>
                  <input
                    type="text"
                    required
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="Brief summary of inquiry"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Detailed Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your inquiry, bug report, or feedback..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </section>
        )}

        {/* Bottom Back Button */}
        <div className="text-center pt-6 border-t border-slate-800">
          <button
            onClick={onBackToArcade}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Return to SmashChill Free Arcade Games</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-6 text-xs text-slate-500 text-center">
        <p>&copy; {new Date().getFullYear()} SmashChill Interactive Studio · smashchill.online · All rights reserved.</p>
      </footer>
    </div>
  );
};
