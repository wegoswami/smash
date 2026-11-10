import { StaticPage } from '../pagesData';

export const pageMedicalDisclaimer: StaticPage = {
  slug: 'medical-disclaimer',
  aliases: ['disclaimer'],
  title: 'Health & Medical Disclaimer | Smash and Chill',
  description: 'Health and medical disclaimer for Smash and Chill. Explains that casual web games provide recreational stress reduction and do not replace professional psychological care.',
  keywords: 'medical disclaimer smash and chill, mental health disclaimer, casual stress relief, crisis hotline numbers',
  category: 'Safety',
  badge: 'HEALTH & SAFETY NOTICE',
  lastUpdated: 'November 2026',
  schemaType: 'WebPage',
  sections: [
    {
      heading: 'Recreational Entertainment Disclaimer',
      body: [
        'SmashChill (smashchill.online) is an interactive web game engineered purely for casual recreation, amusement, lighthearted tension-release, and personal entertainment.',
        'The content, audio frequencies, and interactive games provided on this site are NOT intended to diagnose, treat, cure, or prevent any mental illness, acute clinical depression, panic disorders, or psychiatric conditions.',
        'Casual web micro-breaks help lower transient screen fatigue, but they do not constitute medical, psychological, psychiatric, or healthcare advice.',
      ],
    },
    {
      heading: 'Crisis & Emergency Mental Health Support Resources',
      body: [
        'If you or someone you know is in acute psychological distress, experiencing severe anxiety, or in an emergency, please connect with trained compassionate counselors immediately:',
        'United States & Canada: Call or text 988 (Suicide & Crisis Lifeline) available 24/7/365.',
        'United Kingdom: Call 111 (NHS Mental Health Services) or text SHOUT to 85258.',
        'India: Call Sneha India Foundation at +91 44 2464 0050 or KIRAN at 1800-599-0019.',
        'Worldwide / International: Visit befrienders.org or findahelpline.com for local 24/7 crisis hotlines.',
      ],
    },
  ],
};
