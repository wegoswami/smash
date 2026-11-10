import fs from 'fs';
import path from 'path';
import { POSTS_DATA, Post } from '../src/data/postsData';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const POSTS_DIR = path.resolve(PUBLIC_DIR, 'posts');
const BLOG_DIR = path.resolve(PUBLIC_DIR, 'blog');

[POSTS_DIR, BLOG_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const COMMON_HEAD = `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#e11d48" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="google-site-verification" content="google0cc72dfb11e39ef0" />
  <meta name="google-adsense-account" content="ca-pub-7658190454263901" />
  <link rel="icon" type="image/svg+xml" href="/icon.svg" />
  <link rel="apple-touch-icon" href="/icon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@600;700&display=swap">
`;

const COMMON_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: #020617;
    color: #e2e8f0;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.7;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4, .font-heading {
    font-family: 'Outfit', sans-serif;
    color: #ffffff;
    line-height: 1.25;
  }
  .font-mono { font-family: 'JetBrains Mono', monospace; }
  a { color: inherit; text-decoration: none; }
  .container {
    max-width: 860px;
    margin: 0 auto;
    padding: 24px 20px 80px 20px;
  }
  .nav-bar {
    border-bottom: 1px solid #1e293b;
    background: rgba(2, 6, 23, 0.94);
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .nav-container {
    max-width: 1040px;
    margin: 0 auto;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav-logo {
    font-size: 1.15rem;
    font-weight: 900;
    background: linear-gradient(to right, #fbbf24, #f43f5e, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .nav-tag {
    font-size: 9px;
    padding: 2px 6px;
    background: rgba(225, 29, 72, 0.2);
    border: 1px solid rgba(244, 63, 94, 0.4);
    color: #fb7185;
    border-radius: 9999px;
    font-weight: 800;
    text-transform: uppercase;
    -webkit-text-fill-color: #fb7185;
  }
  .nav-play-btn {
    background: linear-gradient(135deg, #e11d48, #d97706);
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 800;
    box-shadow: 0 4px 14px rgba(225, 29, 72, 0.35);
    transition: transform 0.15s ease;
  }
  .nav-play-btn:hover { transform: scale(1.04); }
  .breadcrumbs {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #94a3b8;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .breadcrumbs a:hover { color: #f43f5e; }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: rgba(244, 63, 94, 0.15);
    border: 1px solid rgba(244, 63, 94, 0.35);
    color: #fda4af;
    margin-bottom: 16px;
  }
  .article-title {
    font-size: 2.1rem;
    font-weight: 900;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
  }
  @media (min-width: 640px) {
    .article-title { font-size: 2.6rem; }
  }
  .article-subtitle {
    font-size: 1.12rem;
    color: #cbd5e1;
    margin-bottom: 24px;
    font-weight: 500;
  }
  .author-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 16px;
    margin-bottom: 32px;
  }
  .author-avatar {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #1e293b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .author-meta { font-size: 12px; color: #94a3b8; }
  .author-name { font-size: 14px; font-weight: 800; color: #ffffff; }

  .takeaways-box {
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.5));
    border: 1px solid rgba(244, 63, 94, 0.3);
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 36px;
  }
  .takeaways-title {
    font-size: 14px;
    font-weight: 900;
    color: #fbbf24;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .takeaways-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .takeaways-list li {
    position: relative;
    padding-left: 24px;
    font-size: 14px;
    color: #e2e8f0;
  }
  .takeaways-list li::before {
    content: '✔';
    position: absolute;
    left: 0;
    color: #34d399;
    font-weight: bold;
  }

  .game-cta {
    background: linear-gradient(135deg, #1e1b4b, #0f172a);
    border: 2px solid #6366f1;
    border-radius: 20px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-items: flex-start;
    margin-bottom: 40px;
  }
  @media (min-width: 640px) {
    .game-cta {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
  .game-cta-info {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .game-cta-icon {
    font-size: 36px;
    background: rgba(99, 102, 241, 0.2);
    width: 58px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    flex-shrink: 0;
  }
  .game-cta-btn {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 900;
    box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    transition: transform 0.15s ease;
  }
  .game-cta-btn:hover { transform: scale(1.05); }

  .article-body h2 {
    font-size: 1.45rem;
    font-weight: 800;
    margin: 36px 0 16px 0;
    color: #f8fafc;
    border-left: 4px solid #f43f5e;
    padding-left: 12px;
  }
  .article-body p {
    font-size: 1.02rem;
    color: #cbd5e1;
    margin-bottom: 20px;
    line-height: 1.85;
  }

  .citations-box {
    margin-top: 48px;
    padding: 24px;
    background: #0f172a;
    border-radius: 18px;
    border: 1px solid #1e293b;
  }
  .citations-title {
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
    margin-bottom: 12px;
  }
  .citations-list {
    list-style: decimal;
    padding-left: 20px;
    font-size: 12px;
    color: #94a3b8;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .disclaimer-box {
    margin-top: 24px;
    padding: 16px;
    background: rgba(30, 41, 59, 0.4);
    border-radius: 12px;
    font-size: 11px;
    color: #64748b;
    line-height: 1.6;
  }

  .related-section {
    margin-top: 56px;
    border-top: 1px solid #1e293b;
    padding-top: 40px;
  }
  .related-heading {
    font-size: 1.3rem;
    font-weight: 800;
    margin-bottom: 20px;
  }
  .related-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  @media (min-width: 640px) {
    .related-grid { grid-template-columns: repeat(3, 1fr); }
  }
  .related-card {
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 16px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.2s ease;
  }
  .related-card:hover {
    border-color: #f43f5e;
    transform: translateY(-2px);
  }
  .related-card h3 {
    font-size: 14px;
    font-weight: 800;
    line-height: 1.4;
    margin-bottom: 8px;
  }
  .related-card p {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.5;
  }

  footer {
    border-top: 1px solid #1e293b;
    margin-top: 60px;
    padding: 30px 20px;
    text-align: center;
    font-size: 12px;
    color: #64748b;
  }
  .footer-links {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 10px;
    flex-wrap: wrap;
  }
  .footer-links a:hover { color: #f43f5e; }
`;

function writePostFiles(targetDir: string, slug: string, content: string) {
  // 1. file.html
  fs.writeFileSync(path.join(targetDir, `${slug}.html`), content, 'utf-8');
  // 2. folder/index.html
  const folder = path.join(targetDir, slug);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  fs.writeFileSync(path.join(folder, 'index.html'), content, 'utf-8');
}

// =========================================================================
// 1. GENERATE INDIVIDUAL POSTS (/posts/:slug)
// =========================================================================
for (const post of POSTS_DATA) {
  const canonicalUrl = `https://smashchill.online/posts/${post.slug}`;
  const keywords = [
    ...post.tags,
    'smash and chill',
    'smashchill',
    'smash chill',
    'clinical stress relief posts',
    'free online arcade games',
    'stress relief mini games',
  ].join(', ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: post.title,
    description: post.summary,
    image: 'https://smashchill.online/icon.svg',
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SmashChill Interactive Studio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://smashchill.online/icon.svg',
      },
    },
    datePublished: '2026-11-01T08:00:00+00:00',
    dateModified: '2026-11-06T08:00:00+00:00',
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content.reduce((acc, c) => acc + c.body.join(' ').split(' ').length, 0),
    isPartOf: {
      '@type': 'Blog',
      name: 'Smash and Chill Research & Clinical Posts',
      url: 'https://smashchill.online/posts',
    },
  };

  const breadcrumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://smashchill.online/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Research Posts',
        item: 'https://smashchill.online/posts',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  const relatedPosts = POSTS_DATA.filter((p) => p.id !== post.id).slice(0, 3);

  const html = `<!doctype html>
<html lang="en">
<head>
  ${COMMON_HEAD}
  <title>${escapeHtml(post.title)} | Smash and Chill Post</title>
  <meta name="description" content="${escapeHtml(post.summary)}" />
  <meta name="keywords" content="${escapeHtml(keywords)}" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- OpenGraph -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Smash and Chill" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${escapeHtml(post.title)}" />
  <meta property="og:description" content="${escapeHtml(post.summary)}" />
  <meta property="og:image" content="https://smashchill.online/icon.svg" />
  <meta property="article:published_time" content="2026-11-01T08:00:00+00:00" />
  <meta property="article:modified_time" content="2026-11-06T08:00:00+00:00" />
  <meta property="article:section" content="${escapeHtml(post.category)}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@SmashChillGame" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:title" content="${escapeHtml(post.title)}" />
  <meta name="twitter:description" content="${escapeHtml(post.summary)}" />
  <meta name="twitter:image" content="https://smashchill.online/icon.svg" />

  <script type="application/ld+json">
  ${JSON.stringify(jsonLd, null, 2)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify(breadcrumbsLd, null, 2)}
  </script>

  <style>
    ${COMMON_CSS}
  </style>
</head>
<body>

  <header class="nav-bar">
    <div class="nav-container">
      <a href="https://smashchill.online/" class="nav-logo" aria-label="Smash and Chill Homepage">
        <span>⚡ SMASH &amp; CHILL</span>
        <span class="nav-tag">POST</span>
      </a>
      <a href="https://smashchill.online/#${post.recommendedGame.mode}" class="nav-play-btn">
        <span>Play ${escapeHtml(post.recommendedGame.label)} ▶</span>
      </a>
    </div>
  </header>

  <main class="container">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="https://smashchill.online/">Home</a>
      <span>/</span>
      <a href="https://smashchill.online/posts">Research Posts</a>
      <span>/</span>
      <span style="color: #cbd5e1;">${escapeHtml(post.category)}</span>
    </nav>

    <article>
      <header>
        <span class="badge">${escapeHtml(post.category)} · ${escapeHtml(post.readTime)}</span>
        <h1 class="article-title">${escapeHtml(post.title)}</h1>
        <p class="article-subtitle">${escapeHtml(post.subtitle)}</p>

        <div class="author-card">
          <div class="author-avatar">${post.author.avatar}</div>
          <div>
            <div class="author-name">${escapeHtml(post.author.name)}</div>
            <div class="author-meta">${escapeHtml(post.author.role)} · Published ${escapeHtml(post.publishDate)} · Peer-Reviewed</div>
          </div>
        </div>
      </header>

      <aside class="takeaways-box" aria-label="Clinical Summary and Key Takeaways">
        <div class="takeaways-title">
          <span>🧠</span>
          <span>Executive Clinical Takeaways</span>
        </div>
        <ul class="takeaways-list">
          ${post.keyTakeaways.map((point) => `<li>${escapeHtml(point)}</li>`).join('\n          ')}
        </ul>
      </aside>

      <section class="game-cta">
        <div class="game-cta-info">
          <div class="game-cta-icon">${post.recommendedGame.icon}</div>
          <div>
            <h3 style="font-size: 16px; font-weight: 800; color: #ffffff;">Prescribed Micro-Break: ${escapeHtml(post.recommendedGame.label)}</h3>
            <p style="font-size: 13px; color: #cbd5e1; margin-top: 2px;">${escapeHtml(post.recommendedGame.actionPrompt)}</p>
          </div>
        </div>
        <a href="https://smashchill.online/#${post.recommendedGame.mode}" class="game-cta-btn">
          <span>Play Now Free</span>
          <span>⚡</span>
        </a>
      </section>

      <div class="article-body">
        ${post.content
          .map(
            (sec) => `
        <section>
          <h2>${escapeHtml(sec.sectionHeading)}</h2>
          ${sec.body.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n          ')}
        </section>`
          )
          .join('\n')}
      </div>

      <footer class="citations-box">
        <h3 class="citations-title">Scientific References &amp; Clinical Citations</h3>
        <ol class="citations-list">
          ${post.scientificCitations.map((cite) => `<li>${escapeHtml(cite)}</li>`).join('\n          ')}
        </ol>
      </footer>

      <div class="disclaimer-box">
        <strong>Editorial &amp; Medical Disclaimer:</strong> Smash and Chill posts provide peer-reviewed psychological and ergonomic education regarding stress management and micro-breaks. Interactive casual games are intended for general relaxation and cognitive decompression. They do not constitute a substitute for clinical psychiatric care or professional medical diagnosis. Read our <a href="https://smashchill.online/pages/medical-disclaimer" style="color: #fbbf24; text-decoration: underline;">full medical disclaimer</a>.
      </div>
    </article>

    <section class="related-section" aria-label="Related Clinical Research Posts">
      <h2 class="related-heading">Related Clinical Guides &amp; Protocols</h2>
      <div class="related-grid">
        ${relatedPosts
          .map(
            (rel) => `
        <a href="https://smashchill.online/posts/${rel.slug}" class="related-card">
          <div>
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #fb7185; margin-bottom: 6px; display: inline-block;">${escapeHtml(rel.category)}</span>
            <h3>${escapeHtml(rel.title)}</h3>
            <p>${escapeHtml(rel.summary.slice(0, 110))}...</p>
          </div>
          <div style="font-size: 11px; font-weight: 800; color: #38bdf8; margin-top: 12px; display: flex; align-items: center; gap: 4px;">
            <span>Read Post</span>
            <span>→</span>
          </div>
        </a>`
          )
          .join('\n')}
      </div>
    </section>
  </main>

  <footer>
    <p>© 2026 Smash and Chill Interactive Studio · smashchill.online · All rights reserved.</p>
    <div class="footer-links">
      <a href="https://smashchill.online/">All 15 Free Arcade Games</a>
      <a href="https://smashchill.online/posts">All Posts</a>
      <a href="https://smashchill.online/pages">All Pages</a>
      <a href="https://smashchill.online/pages/privacy-policy">Privacy Policy</a>
      <a href="https://smashchill.online/pages/terms-of-service">Terms of Service</a>
      <a href="https://smashchill.online/pages/about">About Us</a>
      <a href="https://smashchill.online/pages/contact">Contact Support</a>
    </div>
  </footer>

</body>
</html>
`;

  // 1. Write under /posts/:slug
  writePostFiles(POSTS_DIR, post.slug, html);

  // 2. Also write under /blog/:slug for backward compatibility
  writePostFiles(BLOG_DIR, post.slug, html);

  console.log(`Generated Post: /posts/${post.slug}`);
}

// =========================================================================
// 2. GENERATE ALL POSTS DIRECTORY / HUB (/posts)
// =========================================================================
const postsHubJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Smash and Chill Research & Clinical Posts',
  description: 'Evidence-based clinical research posts on stress reduction, dopamine regulation, ergonomic micro-breaks, ASMR acoustic psychology, and neurodivergent focus routines.',
  url: 'https://smashchill.online/posts',
  publisher: {
    '@type': 'Organization',
    name: 'SmashChill Interactive Studio',
    url: 'https://smashchill.online/',
  },
  hasPart: POSTS_DATA.map((p) => ({
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.summary,
    url: `https://smashchill.online/posts/${p.slug}`,
  })),
};

const postsHubHtml = `<!doctype html>
<html lang="en">
<head>
  ${COMMON_HEAD}
  <title>Research Posts Directory | Smash and Chill (smashchill.online)</title>
  <meta name="description" content="Explore evidence-based research posts on stress relief, ergonomic gaming, digital decompression, ASMR acoustic psychology, and 5-minute cognitive micro-breaks." />
  <link rel="canonical" href="https://smashchill.online/posts" />

  <style>
    ${COMMON_CSS}
    .hero-box {
      text-align: center;
      padding: 36px 16px 28px 16px;
      margin-bottom: 32px;
    }
    .hero-title {
      font-size: 2.2rem;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
      background: linear-gradient(to right, #ffffff, #e2e8f0, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    @media (min-width: 640px) {
      .hero-title { font-size: 2.8rem; }
    }
    .hero-sub {
      font-size: 1.05rem;
      color: #94a3b8;
      max-width: 650px;
      margin: 0 auto;
    }
    .posts-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .post-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 20px;
      padding: 24px;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .post-card:hover {
      border-color: #f43f5e;
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(244, 63, 94, 0.15);
    }
    .post-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .post-category {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #fb7185;
      background: rgba(244, 63, 94, 0.12);
      padding: 3px 10px;
      border-radius: 9999px;
    }
    .post-read-time {
      font-size: 11px;
      color: #94a3b8;
      font-weight: 600;
    }
    .post-card-title {
      font-size: 1.3rem;
      font-weight: 800;
      line-height: 1.35;
      margin-bottom: 10px;
      color: #f8fafc;
    }
    .post-card-summary {
      font-size: 13.5px;
      color: #94a3b8;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .post-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #1e293b;
      padding-top: 16px;
      margin-top: 8px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .author-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #cbd5e1;
    }
    .read-more-btn {
      color: #38bdf8;
      font-size: 13px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .read-more-btn:hover { color: #7dd3fc; }
  </style>
</head>
<body>

  <header class="nav-bar">
    <div class="nav-container">
      <a href="https://smashchill.online/" class="nav-logo" aria-label="Smash and Chill Homepage">
        <span>⚡ SMASH &amp; CHILL</span>
        <span class="nav-tag">POSTS</span>
      </a>
      <a href="https://smashchill.online/" class="nav-play-btn">
        <span>Play 15 Free Games ▶</span>
      </a>
    </div>
  </header>

  <main class="container">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="https://smashchill.online/">Home</a>
      <span>/</span>
      <span style="color: #cbd5e1;">Research Posts</span>
    </nav>

    <div class="hero-box">
      <span class="badge">EVIDENCE-BASED SANCTUARY</span>
      <h1 class="hero-title">Wellness &amp; Neurobiology Posts</h1>
      <p class="hero-sub">
        Explore clinical research articles on 5-minute micro-breaks, ASMR acoustics, ergonomic gaming posture, and dopamine restoration protocols from Smash and Chill.
      </p>
    </div>

    <div class="posts-grid">
      ${POSTS_DATA.map(
        (post) => `
        <article class="post-card">
          <div>
            <div class="post-card-header">
              <span class="post-category">${escapeHtml(post.category)}</span>
              <span class="post-read-time">⏱ ${escapeHtml(post.readTime)}</span>
            </div>
            <a href="https://smashchill.online/posts/${post.slug}">
              <h2 class="post-card-title">${escapeHtml(post.title)}</h2>
            </a>
            <p class="post-card-summary">${escapeHtml(post.summary)}</p>
          </div>
          <div class="post-card-footer">
            <div class="author-info">
              <span>${post.author.avatar}</span>
              <span><strong>${escapeHtml(post.author.name)}</strong> · ${escapeHtml(post.author.role)}</span>
            </div>
            <a href="https://smashchill.online/posts/${post.slug}" class="read-more-btn">
              <span>Read Full Post</span>
              <span>→</span>
            </a>
          </div>
        </article>
      `
      ).join('\n')}
    </div>
  </main>

  <footer>
    <p>© 2026 Smash and Chill Interactive Studio · smashchill.online · All rights reserved.</p>
    <div class="footer-links">
      <a href="https://smashchill.online/">All 15 Free Arcade Games</a>
      <a href="https://smashchill.online/posts">All Posts</a>
      <a href="https://smashchill.online/pages">All Pages</a>
      <a href="https://smashchill.online/pages/privacy-policy">Privacy Policy</a>
      <a href="https://smashchill.online/pages/terms-of-service">Terms of Service</a>
      <a href="https://smashchill.online/pages/about">About Us</a>
      <a href="https://smashchill.online/pages/contact">Contact Support</a>
    </div>
  </footer>

</body>
</html>
`;

writePostFiles(POSTS_DIR, 'index', postsHubHtml);
fs.writeFileSync(path.join(PUBLIC_DIR, 'posts.html'), postsHubHtml, 'utf-8');

// Also update /blog/index.html to point to /posts and maintain backward compatibility
writePostFiles(BLOG_DIR, 'index', postsHubHtml);
fs.writeFileSync(path.join(PUBLIC_DIR, 'blog.html'), postsHubHtml, 'utf-8');

console.log('Generated Posts Directory Hub: /posts (+ alias /blog)');
