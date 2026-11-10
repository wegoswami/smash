import { ALL_PAGES } from './pages/index';

export interface StaticPage {
  slug: string;
  aliases: string[];
  title: string;
  description: string;
  keywords: string;
  category: 'Legal' | 'Company' | 'Support' | 'Safety';
  badge: string;
  lastUpdated: string;
  schemaType: 'AboutPage' | 'ContactPage' | 'QAPage' | 'WebPage';
  sections: {
    heading: string;
    body: string[];
  }[];
}

// Re-export all pages from individual page files
export const PAGES_DATA: StaticPage[] = ALL_PAGES;
