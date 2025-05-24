export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
  social_links?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  template_id: string;
  description?: string;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  likes_count: number;
  loves_count: number;
}

export interface Artwork {
  id: string;
  portfolio_id: string;
  user_id: string;
  title: string;
  description?: string;
  year?: number;
  medium?: string;
  tags?: string[];
  blockchain?: string;
  external_url?: string;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
  updated_at: string;
  display_order: number;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  preview_image_url: string;
  is_premium: boolean;
  price?: number;
  features: Record<string, any>;
}

export interface OpenCall {
  id: string;
  user_id: string;
  title: string;
  description: string;
  organization_name: string;
  organization_links: Record<string, string>;
  banner_image_url: string;
  submission_deadline: string;
  created_at: string;
  updated_at: string;
  is_approved: boolean;
  field_requirements: Record<string, any>;
  status: 'draft' | 'pending_approval' | 'active' | 'closed';
}

export interface Submission {
  id: string;
  open_call_id: string;
  user_id: string;
  artwork_id?: string;
  media_url?: string;
  bio: string;
  responses: Record<string, any>;
  created_at: string;
  is_selected: boolean;
  payment_id?: string;
}

export interface EducationContent {
  id: string;
  title: string;
  category: 'digital_art' | 'marketing' | 'web3' | 'ai_tools';
  thumbnail_url: string;
  preview_text: string;
  full_content: string;
  created_at: string;
  updated_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  portfolio_id: string;
  type: 'like' | 'love';
  created_at: string;
}
