import { StaticPage } from '../pagesData';

export const pagePrivacyPolicy: StaticPage = {
  slug: 'privacy-policy',
  aliases: ['privacy'],
  title: 'Privacy Policy | Smash and Chill (smashchill.online)',
  description: 'Privacy Policy for Smash and Chill (smashchill.online). Explains Google AdSense, DoubleClick DART cookies, log files, GDPR rights, CCPA compliance, and user data protections.',
  keywords: 'privacy policy smash and chill, smashchill privacy, google adsense cookies, dart cookies opt out, gdpr compliance, ccpa privacy rights',
  category: 'Legal',
  badge: 'GDPR & CCPA COMPLIANT',
  lastUpdated: 'November 3, 2026',
  schemaType: 'WebPage',
  sections: [
    {
      heading: 'Introduction & Privacy Commitment',
      body: [
        'At Smash and Chill (accessible from https://smashchill.online), one of our main priorities is the privacy of our visitors. This Privacy Policy outlines what information is collected, how it is recorded by SmashChill, and how it is used.',
        'If you have questions or require further information regarding our privacy practices, contact our Data Protection desk directly at wegoswami@gmail.com or contact@smashchill.online.',
      ],
    },
    {
      heading: '1. Google AdSense & DoubleClick DART Cookies',
      body: [
        'Google is one of the third-party advertising vendors on our site. Google uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to smashchill.online and other sites on the internet.',
        'Visitors may opt out of personalized advertising by visiting Google Ads Settings: https://www.google.com/settings/ads.',
        'Alternatively, you can opt out of third-party vendor cookies for personalized advertising by visiting the Network Advertising Initiative (https://optout.networkadvertising.org/) or the Digital Advertising Alliance (https://www.aboutads.info/choices/).',
      ],
    },
    {
      heading: '2. Log Files & Anonymous Technical Metrics',
      body: [
        'SmashChill follows a standard procedure of utilizing log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users movement on the website, and gathering demographic information.',
      ],
    },
    {
      heading: '3. Local Storage (Privacy by Architecture)',
      body: [
        'SmashChill stores your gameplay high scores, sound toggles, unlocked weapons, and quest progress exclusively within your devices browser window.localStorage. This data never leaves your machine, is never transmitted to any remote database, and can be cleared at any time via your browser settings.',
      ],
    },
    {
      heading: '4. CCPA Privacy Rights (Do Not Sell My Personal Information)',
      body: [
        'Under the California Consumer Privacy Act (CCPA), California consumers have the right to request disclosure of personal data categories collected, request erasure of personal data, and demand that personal data not be sold. SmashChill does not sell personal user information.',
      ],
    },
    {
      heading: '5. GDPR Data Protection Rights',
      body: [
        'We ensure all users are fully aware of all of their data protection rights under GDPR, including the right to access, the right to rectification, the right to erasure, and the right to restrict processing.',
      ],
    },
    {
      heading: '6. Childrens Online Privacy Protection (COPPA)',
      body: [
        'Another priority is protecting children while using the internet. SmashChill does not knowingly collect any Personal Identifiable Information from children under the age of 13.',
      ],
    },
  ],
};
