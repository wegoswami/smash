import { StaticPage } from '../pagesData';
import { pageAbout } from './about';
import { pagePrivacyPolicy } from './privacy-policy';
import { pageTermsOfService } from './terms-of-service';
import { pageContact } from './contact';
import { pageMedicalDisclaimer } from './medical-disclaimer';
import { pageDmcaPolicy } from './dmca-policy';
import { pageFaq } from './faq';

export {
  pageAbout,
  pagePrivacyPolicy,
  pageTermsOfService,
  pageContact,
  pageMedicalDisclaimer,
  pageDmcaPolicy,
  pageFaq,
};

export const ALL_PAGES: StaticPage[] = [
  pageAbout,
  pagePrivacyPolicy,
  pageTermsOfService,
  pageContact,
  pageMedicalDisclaimer,
  pageDmcaPolicy,
  pageFaq,
];

export function getPageBySlug(slug: string): StaticPage | undefined {
  const clean = slug.toLowerCase().replace(/^\/pages\//, '').replace(/^\//, '');
  return ALL_PAGES.find(
    (p) => p.slug === clean || p.aliases.includes(clean)
  );
}

export function getAllPageSlugs(): string[] {
  return ALL_PAGES.map((p) => p.slug);
}
