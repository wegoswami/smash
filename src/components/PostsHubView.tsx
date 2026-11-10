import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Filter,
  Home,
  Search,
  Sparkles,
} from 'lucide-react';
import { BLOG_ARTICLES, BlogArticle } from '../data/blogArticles';
import { GameMode } from './Header';

interface PostsHubViewProps {
  onBackToArcade: () => void;
  onSelectPost: (slug: string) => void;
  onSelectGame: (mode: GameMode) => void;
}

export const PostsHubView: React.FC<PostsHubViewProps> = ({
  onBackToArcade,
  onSelectPost,
  onSelectGame,
}) => {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Research Posts & Clinical Articles | Smash and Chill';

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', 'Explore clinical stress-relief studies, workplace micro-break neuroscience, and kinetic tactile audio research by Smash and Chill.');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://smashchill.online/posts');
    }

    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Research Posts & Clinical Articles | Smash and Chill');
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', 'Explore clinical stress-relief studies, workplace micro-break neuroscience, and kinetic tactile audio research.');
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', 'https://smashchill.online/posts');
  }, []);

  const categories = ['All', 'Neuroscience', 'Ergonomics', 'Acoustic Psychology', 'Cognitive Behavior'];

  const filteredPosts = BLOG_ARTICLES.filter((a) => {
    const matchesCat = categoryFilter === 'All' || a.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

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
          <span>Play Games ▶</span>
        </button>
      </header>

      {/* Main Catalog Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
          <button
            onClick={onBackToArcade}
            className="hover:text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>Home</span>
          </button>
          <span className="text-slate-700">/</span>
          <span className="text-slate-300 font-medium">Research Posts Directory</span>
        </nav>

        {/* Page Header */}
        <header className="space-y-3 text-center sm:text-left border-b border-slate-800 pb-6">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
            CLINICAL KNOWLEDGE BASE
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Stress Relief Science &amp; Gaming Ergonomics
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Explore peer-reviewed cognitive research, workplace micro-break protocols, and acoustic psychology studies curated by the SmashChill research team.
          </p>
        </header>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  categoryFilter === cat
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((art) => (
            <article
              key={art.id}
              onClick={() => onSelectPost(art.slug)}
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
                  <h2 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                    {art.title}
                  </h2>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPost(art.slug);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Read Article</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectGame(art.recommendedGame.mode);
                    }}
                    title={`Play ${art.recommendedGame.label}`}
                    className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                  >
                    <span className="text-xs">{art.recommendedGame.icon}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

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
