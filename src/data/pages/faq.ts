import { StaticPage } from '../pagesData';

export const pageFaq: StaticPage = {
  slug: 'faq',
  aliases: ['frequently-asked-questions'],
  title: 'Frequently Asked Questions (FAQ) | Smash and Chill',
  description: 'Frequently Asked Questions about Smash and Chill: 15 free online stress-relief arcade games, how audio synthesis works, privacy, and device support.',
  keywords: 'faq smash and chill, frequently asked questions smashchill, how to play smash chill, free games without download, audio synthesis web games',
  category: 'Support',
  badge: 'PLAYER & USER GUIDE',
  lastUpdated: 'November 2026',
  schemaType: 'QAPage',
  sections: [
    {
      heading: 'What is Smash and Chill?',
      body: [
        'Smash and Chill (smashchill.online) is a free web-based anti-stress arcade offering 15 interactive decompression mini-games. It combines high-energy physical catharsis (smashing plates, slicing items, crushing objects) with soothing mindfulness (koi ponds, Tibetan tongue drum chimes, kinetic sand).',
      ],
    },
    {
      heading: 'Do I need to download or install anything?',
      body: [
        'No! All 15 games run instantly in any modern desktop or mobile web browser with zero installation, zero downloads, and no account registration required.',
      ],
    },
    {
      heading: 'Is Smash and Chill safe and free to play?',
      body: [
        'Yes, 100% free. SmashChill is monetized responsibly via verified Google AdSense ads, ensuring users can play without paywalls while maintaining strict privacy standards.',
      ],
    },
    {
      heading: 'How does sound and audio synthesis work?',
      body: [
        'Smash and Chill uses the native Web Audio API to dynamically synthesize physical shatter tones, pentatonic bell chimes, and haptic clicks in real-time on your device, ensuring crystal-clear audio with zero audio buffering delay.',
      ],
    },
  ],
};
