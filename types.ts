import React from 'react';

export interface CastMember {
  id: string;
  name: string;
  role: string;
  actorName: string;
  imageUrl: string;
}

export interface SynopsisItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  highlight?: string;
}

export interface Comment {
  id: string;
  author: string;
  initials: string;
  timeAgo: string;
  text: string;
  colorFrom: string;
  colorTo: string;
  align: 'left' | 'right';
}

export interface Cheer {
  id: number;
  created_at: string;
  author: string;
  message: string;
  initials: string;
  color_from: string;
  color_to: string;
}

export interface NavTab {
  id: 'story' | 'news' | 'talk';
  label: string;
  icon: React.ReactNode;
}

export interface ProjectData {
  meta: {
    title: string; // e.g., "The Cat's Meow..."
    company: string; // e.g., "Dream Big Productions"
    tags: string[]; // e.g., ["Musical", "Romance"]
    logoUrl: string;
  };
  hero: {
    mediaUrl: string; // Background image or video poster
    videoUrl?: string; // Optional actual video link
    badge: string; // e.g., "Official Trailer"
  };
  funding: {
    goalAmount: number;
  };
  synopsis: SynopsisItem[];
  cast: CastMember[];
  venue: {
    name: string;
    address: string;
    mapImageUrl: string;
  };
  share: {
    title: string;
    text: string;
    url?: string; // Defaults to current window location
  };
}