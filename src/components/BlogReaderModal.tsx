import React, { useEffect } from 'react';
import { X, Clock, Calendar, Share2, BookOpen, ArrowRight, ArrowLeft, Check, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BlogArticle } from '../data/blogArticles';
import { GameMode } from './Header';

interface BlogReaderModalProps {
  article: BlogArticle | null;
  onClose: () => void;
  onSelectGame?: (mode: GameMode) => void;
  onNavigateArticle?: (article: BlogArticle) => void;
  allArticles?: BlogArticle[];
}

export const BlogReaderModal: React.FC<BlogReaderModalProps> = ({
  article,
  onClose,
  onSelectGame,
  onNavigateArticle,
  allArticles = [],
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (article) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [article, onClose]);

  if (!article) return null;

  const handleShare = () => {
    const url = `https://smashchill.online/posts/${article.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#fbbf24', '#38bdf8'],
    });
  };

  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl my-auto rounded-3xl bg-slate-900 border-2 border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Sticky Header with Close & Category */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:px-6 bg-slate-950/90 backdrop-blur border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">{article.icon}</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {article.category}
            </span>
            <a
              href={`/posts/${article.slug}`}
              className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 font-mono transition-colors bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800"
              title="Dedicated Post Canonical URL"
            >
              <span>/posts/{article.slug}</span>
            </a>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
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

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share Article Link"
              aria-label="Share article link"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link!' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              title="Close Article"
              aria-label="Close article modal"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* Article Title & Hero Subtitle */}
          <div className="space-y-3 border-b border-slate-800 pb-5">
            <h1 id="article-modal-title" className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
              {article.title}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              {article.subtitle}
            </p>

            {/* Author Profile */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-xl shadow-inner border border-slate-700">
                {article.author.avatar}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{article.author.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {article.author.role}
                </div>
              </div>
            </div>
          </div>

          {/* Key Takeaways Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-900 border border-amber-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Key Takeaways for Readers</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">✓</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Full Formatted Article Sections */}
          <div className="space-y-6 pt-2">
            {article.content.map((sec, idx) => (
              <div key={idx} className="space-y-2.5">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {sec.sectionHeading}
                </h2>
                {sec.body.map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Recommended Interactive Game Call-To-Action */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-rose-950/30 to-slate-950 border-2 border-rose-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-3xl shrink-0">
                {article.recommendedGame.icon}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                  Recommended Practical Exercise
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  {article.recommendedGame.label}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {article.recommendedGame.actionPrompt}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onSelectGame?.(article.recommendedGame.mode);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Play This Game Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scientific Citations (High E-E-A-T Signal for Google) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 mt-6">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Scientific Research & Citations</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-400">
              {article.scientificCitations.map((cite, idx) => (
                <li key={idx}>{cite}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer with Previous / Next Article Navigation */}
        <div className="p-3 sm:px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
          {prevArticle ? (
            <button
              onClick={() => onNavigateArticle?.(prevArticle)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline truncate max-w-[200px]">Prev: {prevArticle.title}</span>
              <span className="sm:hidden">Previous</span>
            </button>
          ) : (
            <div />
          )}

          {nextArticle ? (
            <button
              onClick={() => onNavigateArticle?.(nextArticle)}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer py-1"
            >
              <span className="hidden sm:inline truncate max-w-[200px]">Next: {nextArticle.title}</span>
              <span className="sm:hidden">Next Article</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white font-bold transition-colors cursor-pointer py-1"
            >
              Back to Arcade
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
