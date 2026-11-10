import { StaticPage } from '../pagesData';

export const pageContact: StaticPage = {
  slug: 'contact',
  aliases: ['contact-us'],
  title: 'Contact Us & Publisher Support Desk | Smash and Chill',
  description: 'Contact the creators of Smash and Chill (smashchill.online). Inquiries regarding game suggestions, technical bug reports, advertising partnerships, and Google AdSense.',
  keywords: 'contact smash and chill, smashchill support, game feedback, developer contact, adsense publisher desk',
  category: 'Support',
  badge: 'DIRECT SUPPORT DESK',
  lastUpdated: 'November 2026',
  schemaType: 'ContactPage',
  sections: [
    {
      heading: 'Official Communication Channels',
      body: [
        'For user feedback, new game suggestions, bug reports, and Google AdSense / business inquiries, reach our maintainers directly:',
        'Lead Publisher & Support Email: wegoswami@gmail.com',
        'Alternate Domain Desk: contact@smashchill.online',
        'Expected response time: within 24 to 48 business hours.',
      ],
    },
    {
      heading: 'Game Feedback & Community Submissions',
      body: [
        'Have a new anti-stress, fidget, or ASMR game mechanic idea? We actively develop and publish community-requested casual stress relief tools. Send your sketches, physics ideas, or acoustic preferences to wegoswami@gmail.com.',
      ],
    },
    {
      heading: 'Bug Reports & Device Compatibility',
      body: [
        'If you encounter a visual glitch or audio issue on a specific mobile browser or operating system, let us know your exact browser version and device model so we can release an immediate patch.',
      ],
    },
    {
      heading: 'Google AdSense Verification & Advertising Partnerships',
      body: [
        'SmashChill is committed to transparent Google AdSense standards and safe digital gaming. Publisher ID: pub-7658190454263901.',
      ],
    },
  ],
};
