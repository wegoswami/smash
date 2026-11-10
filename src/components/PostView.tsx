import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Gamepad2,
  Share2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Home,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BLOG_ARTICLES, BlogArticle } from '../data/blogArticles';
import { GameMode } from './Header';

interface PostViewProps {
  slug: string;
  onBackToArcade: () => void;
  onSelectPost: (slug: string) => void;
  onSelectGame: (mode: GameMode) => void;
}

export const PostView: React.FC<PostViewProps> = ({
  slug,
  onBackToArcade,
  onSelectPost,
  onSelectGame,
}) => {
  const [copied, setCopied] = useState(false);

  const article = BLOG_ARTICLES.find(
    (a) => a.slug === slug || a.id === slug
  ) || BLOG_ARTICLES[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `${article.title} | Smash and Chill`;

    // Dynamic SEO Metadata updates
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', article.summary);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://smashchill.online/posts/${article.slug}`);
    }

    document.querySelector('meta[property="og:title"]')?.setAttribute('content', article.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', article.summary);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://smashchill.online/posts/${article.slug}`);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', article.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', article.summary);
  }, [article]);

  const handleShare = () => {
    const url = `https://smashchill.online/posts/${article.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#fbbf24', '#f43f5e'],
    });
  };

  const currentIndex = BLOG_ARTICLES.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? BLOG_ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < BLOG_ARTICLES.length - 1 ? BLOG_ARTICLES[currentIndex + 1] : null;

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

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            aria-label="Share article link"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copied ? 'Copied URL!' : 'Share'}</span>
          </button>
          <button
            onClick={() => onSelectGame(article.recommendedGame.mode)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-black tracking-wide transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Play Game</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
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
            href="/posts"
            onClick={(e) => {
              e.preventDefault();
              onBackToArcade();
            }}
            className="hover:text-amber-400 cursor-pointer transition-colors"
          >
            Research Posts
          </a>
          <span className="text-slate-700">/</span>
          <span className="text-slate-300 truncate max-w-[240px] font-mono text-[11px]">
            {article.slug}
          </span>
        </nav>

        {/* Article Header Card */}
        <header className="space-y-4 border-b border-slate-800/80 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">
              {article.icon}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {article.category}
            </span>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono ml-auto">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {article.readTime}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {article.publishDate}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {article.subtitle}
            </p>
          )}

          {/* Author Badge & Accreditation */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg">
                {article.author.avatar}
              </div>
              <div>
                <div className="font-extrabold text-white">{article.author.name}</div>
                <div className="text-[11px] text-slate-400">{article.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl font-medium">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Clinically Reviewed &amp; Fact-Checked</span>
            </div>
          </div>
        </header>

        {/* Key Takeaways Callout Box */}
        <section className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Key Clinical Takeaways</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
            {article.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Structured Article Body */}
        <article className="space-y-6 text-sm leading-relaxed text-slate-300">
          {article.content.map((sec, sIdx) => (
            <section key={sIdx} className="space-y-3 p-5 sm:p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <span>{sec.sectionHeading}</span>
              </h2>
              {sec.body.map((p, pIdx) => (
                <p key={pIdx} className="text-slate-300 text-sm leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>

        {/* Interactive Recommended Game Callout */}
        <section className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950/30 to-amber-950/20 border-2 border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-rose-400 text-xs font-black uppercase tracking-wider">
              <Gamepad2 className="w-4 h-4" />
              <span>Recommended Anti-Stress Game</span>
            </div>
            <h3 className="text-lg font-black text-white">
              {article.recommendedGame.label}
            </h3>
            <p className="text-xs text-slate-300 max-w-lg">
              {article.recommendedGame.actionPrompt}
            </p>
          </div>
          <button
            onClick={() => onSelectGame(article.recommendedGame.mode)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs shadow-xl transition-transform hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Play This Game Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

        {/* Scientific Citations (E-E-A-T Quality Signal) */}
        <section className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Scientific Citations &amp; Academic References</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
            {article.scientificCitations.map((cite, idx) => (
              <li key={idx}>{cite}</li>
            ))}
          </ul>
        </section>

        {/* Prev / Next Article Navigation Strip */}
        <nav aria-label="Adjacent articles" className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevArticle ? (
            <button
              onClick={() => onSelectPost(prevArticle.slug)}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
            >
              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                <span>Previous Post</span>
              </div>
              <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                {prevArticle.title}
              </div>
            </button>
          ) : (
            <div />
          )}

          {nextArticle && (
            <button
              onClick={() => onSelectPost(nextArticle.slug)}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-right transition-colors cursor-pointer group"
            >
              <div className="text-[11px] text-amber-500 font-mono flex items-center justify-end gap-1 mb-1">
                <span>Next Post</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                {nextArticle.title}
              </div>
            </button>
          )}
        </nav>

        {/* Bottom Back Button */}
        <div className="text-center pt-4">
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
