export type PostStatus = 'draft' | 'scheduled' | 'published';

export type Platform = 'twitter' | 'facebook' | 'instagram' | 'linkedin';

export interface Post {
  id: string;
  title: string;
  content: string;
  platforms: Platform[];
  status: PostStatus;
  scheduledDate?: Date;
  scheduledTime?: string;
  hashtags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Stats {
  totalPosts: number;
  scheduledPosts: number;
  draftPosts: number;
  publishedPosts: number;
}

export interface AIContentSuggestion {
  id: string;
  title: string;
  content: string;
  platforms: Platform[];
}
