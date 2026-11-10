import { StaticPage } from '../pagesData';

export const pageTermsOfService: StaticPage = {
  slug: 'terms-of-service',
  aliases: ['terms'],
  title: 'Terms of Service & User Agreement | Smash and Chill',
  description: 'Terms of Service & User Agreement for Smash and Chill (smashchill.online). Covers acceptable casual gameplay, intellectual property, and advertising policies.',
  keywords: 'terms of service smash and chill, smashchill user agreement, acceptable use policy, gaming terms',
  category: 'Legal',
  badge: 'USER AGREEMENT',
  lastUpdated: 'November 2026',
  schemaType: 'WebPage',
  sections: [
    {
      heading: '1. Permitted License & Entertainment Use',
      body: [
        'Welcome to Smash and Chill. By accessing or using our interactive stress-relief arcade web application, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our services.',
        'SmashChill grants you a personal, revocable, non-exclusive, non-transferable license to access and play our mini-games for casual stress-relief, relaxation, and entertainment purposes on personal web browsers and mobile devices.',
      ],
    },
    {
      heading: '2. Prohibited Conduct & Ad Integrity',
      body: [
        'You agree NOT to employ automated scripts, bots, spiders, or headless scrapers to artificially manipulate game scores, leaderboard ranks, or advertising impressions.',
        'You agree NOT to engage in invalid click generation or fraudulent interaction with Google AdSense sponsored banners.',
        'You agree NOT to reverse engineer, decompile, or redistribute the source code, game sprites, sound synthesis engines, or visual assets without written consent.',
      ],
    },
    {
      heading: '3. Intellectual Property Rights',
      body: [
        'All trademarks, logos, audio algorithms, game concepts, and design interfaces displayed on smashchill.online are the proprietary property of SmashChill and its licensors. All rights reserved.',
      ],
    },
    {
      heading: '4. Disclaimer of Warranties & Limitation of Liability',
      body: [
        'SmashChill is provided on an AS IS and AS AVAILABLE basis without warranties of any kind. In no event shall SmashChill, its founders, or affiliates be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our website.',
      ],
    },
  ],
};
