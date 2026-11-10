import { StaticPage } from '../pagesData';

export const pageDmcaPolicy: StaticPage = {
  slug: 'dmca-policy',
  aliases: ['dmca'],
  title: 'DMCA Copyright Policy & Takedown Notice | Smash and Chill',
  description: 'Digital Millennium Copyright Act (DMCA) policy for Smash and Chill (smashchill.online). Instructions for submitting copyright infringement notices.',
  keywords: 'dmca policy smash and chill, copyright infringement, takedown notice, intellectual property compliance',
  category: 'Legal',
  badge: 'INTELLECTUAL PROPERTY',
  lastUpdated: 'November 2026',
  schemaType: 'WebPage',
  sections: [
    {
      heading: 'Commitment to Copyright Protection',
      body: [
        'SmashChill respects the intellectual property rights of creators and complies with the provisions of Title 17, United States Code, Section 512 (Digital Millennium Copyright Act).',
        'All game algorithms, audio synthesis envelopes, and graphical elements are original creations or licensed open assets. If you believe your copyrighted work has been infringed, we will respond promptly to valid notices.',
      ],
    },
    {
      heading: 'Filing a Copyright Infringement Notice',
      body: [
        'To file a DMCA notice, send a written communication to our designated copyright agent at wegoswami@gmail.com with the subject line "DMCA Notice" including:',
        '1. Physical or electronic signature of the authorized copyright owner.',
        '2. Identification of the copyrighted work claimed to have been infringed.',
        '3. URL location of the claimed infringing material on smashchill.online.',
        '4. Your full name, physical address, telephone number, and email address.',
        '5. A good faith statement that the disputed use is not authorized by the copyright owner, agent, or law.',
      ],
    },
  ],
};
