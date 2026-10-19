export type PromptCategory =
  | 'ChatGPT'
  | 'Midjourney'
  | 'Business'
  | 'Marketing'
  | 'Coding'
  | 'Education'
  | 'Productivity'
  | 'Creative';

export interface PromptVariable {
  key: string;
  label: string;
  defaultValue: string;
  placeholder: string;
  options?: string[];
}

export interface PromptItem {
  id: string;
  title: string;
  description: string;
  category: PromptCategory;
  modelTarget: 'ChatGPT-4o' | 'Midjourney v6.1' | 'Claude 3.5 Sonnet' | 'DALL-E 3' | 'Gemini 1.5 Pro';
  rawPrompt: string;
  variables: PromptVariable[];
  tags: string[];
  isDaily: boolean;
  dailyDate?: string;
  isTrending: boolean;
  isEditorsChoice: boolean;
  copyCount: number;
  likesCount: number;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  sampleOutput?: string;
  midjourneyParams?: string;
}

export interface NewsChannel {
  id: string;
  name: string;
  shortName: string;
  country: string;
  city: string;
  language: string;
  category: string;
  isLive: boolean;
  embedVideoId: string; // YouTube embed ID for live streams
  logoText: string;
  color: string;
  headline: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
  source: {
    name: string;
    logoUrl?: string;
    isVerified: boolean;
    domain: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  category: 'AI & Machine Learning' | 'Pakistan Tech & Economy' | 'Global Tech' | 'Robotics' | 'Cybersecurity';
  country?: string;
  city?: string;
  relatedPromptId?: string;
  url: string;
}

export interface LocationUpdate {
  id: string;
  city: string;
  region: string;
  country: string;
  temperature: string;
  weatherCondition: string;
  pulseHeadline: string;
  pulseDescription: string;
  activeAiEventsCount: number;
  trendingTopic: string;
  featuredChannelId?: string;
}

export interface AiAchievement {
  id: string;
  title: string;
  subtitle: string;
  category: 'Autonomous Agents' | 'Biotechnology' | 'Video Synthesis' | 'Quantum & Physics' | 'Robotics & Vision' | 'LLM Reasoning';
  organization: string;
  year: string;
  impactMetric: string;
  description: string;
  coverImage: string;
  readTime: string;
  relatedPromptSnippet?: string;
  tags: string[];
}

export interface DiscoverStory {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  tag: string;
  author: string;
  promptSnippet: string;
  readCount: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  isLoggedIn: boolean;
  currentCity: string;
  currentCountry: string;
  interests: string[];
  streakCount: number;
  lastActiveDate: string;
  savedPromptIds: string[];
  savedNewsIds: string[];
  likedPromptIds: string[];
  copiedPromptIds: string[];
  role: 'user' | 'admin' | 'editor';
}

export type AiStudioTab = 'all' | 'chat' | 'image' | 'video' | 'animate' | 'search';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  timestamp: string;
  isEdit?: boolean;
}

export interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  mode: 'text-to-video' | 'image-to-video';
  timestamp: string;
}

export interface SearchGroundingResult {
  query: string;
  text: string;
  sources: { title: string; url: string }[];
  timestamp: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  promptId?: string;
  category: 'daily_drop' | 'streak_alert' | 'curator_pick' | 'news';
}

export interface AdminAnalyticsData {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  totalCopies: number;
  averageStreak: number;
  categoryBreakdown: { category: string; count: number; percentage: number }[];
  dailyCopiesTrend: { date: string; copies: number }[];
}
