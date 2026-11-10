import { GameMode } from '../components/Header';
import { ALL_POSTS } from './posts/index';

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Neuroscience' | 'Workplace' | 'Ergonomics' | 'ASMR & Audio' | 'Mindfulness' | 'ADHD & Focus';
  readTime: string;
  publishDate: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  coverGradient: string;
  icon: string;
  summary: string;
  keyTakeaways: string[];
  recommendedGame: {
    mode: GameMode;
    label: string;
    icon: string;
    actionPrompt: string;
  };
  content: {
    sectionHeading: string;
    body: string[];
  }[];
  scientificCitations: string[];
}

// Re-export all posts from individual post files
export const BLOG_ARTICLES: BlogArticle[] = ALL_POSTS;
