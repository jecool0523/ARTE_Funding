import { ProjectData, Comment } from './types';

// Reverting to simple relative path to avoid "Invalid URL" errors in environments 
// where import.meta.url might be undefined or unsupported.
const VIDEO_PATH = 'assets/rent_video.mp4';

export const PROJECT_DATA: ProjectData = {
  meta: {
    title: "RENT:\nSchool Edition",
    company: "Dream Big Productions",
    tags: ["Musical", "Rock", "Youth"],
    logoUrl: "https://picsum.photos/50/50?random=12"
  },
  hero: {
    // MediaUrl is for the poster image (displayed before video loads or on error)
    mediaUrl: "https://picsum.photos/800/1200?random=101",
    // VideoUrl for the local file
    videoUrl: VIDEO_PATH, 
    badge: "D-1 PREMIERE"
  },
  funding: {
    goalAmount: 5000000,
  },
  synopsis: [
    {
      id: '1',
      icon: '🕯️',
      title: 'Seasons of Love',
      description: '525,600 minutes. How do you measure a year in the life? Join us for a story about falling in love, finding your voice, and living for today.',
      highlight: '525,600 minutes'
    },
    {
      id: '2',
      icon: '🎸',
      title: 'No Day But Today',
      description: 'Set in the East Village of New York City, a group of impoverished young artists struggle to survive and create a life under the shadow of HIV/AIDS.',
      highlight: 'New York City'
    }
  ],
  cast: [
    {
      id: '1',
      name: 'Mark',
      role: 'Filmmaker',
      actorName: 'Ji-Hoon K.',
      imageUrl: 'https://picsum.photos/200/200?random=11'
    },
    {
      id: '2',
      name: 'Roger',
      role: 'Musician',
      actorName: 'Min-Su L.',
      imageUrl: 'https://picsum.photos/200/200?random=12'
    },
    {
      id: '3',
      name: 'Mimi',
      role: 'Dancer',
      actorName: 'Su-Jin P.',
      imageUrl: 'https://picsum.photos/200/200?random=13'
    },
    {
      id: '4',
      name: 'Angel',
      role: 'Drummer',
      actorName: 'Tae-Young C.',
      imageUrl: 'https://picsum.photos/200/200?random=14'
    },
    {
      id: '5',
      name: 'Maureen',
      role: 'Performer',
      actorName: 'Ha-Eun Y.',
      imageUrl: 'https://picsum.photos/200/200?random=15'
    }
  ],
  gallery: [
    {
      id: '1',
      imageUrl: 'https://picsum.photos/600/400?random=20',
      caption: 'Full Cast Rehearsal',
      size: 'large'
    },
    {
      id: '2',
      imageUrl: 'https://picsum.photos/300/400?random=21',
      caption: 'Costume Design Sketch',
      size: 'tall'
    },
    {
      id: '3',
      imageUrl: 'https://picsum.photos/400/300?random=22',
      caption: 'The Band Warming Up',
      size: 'normal'
    },
    {
      id: '4',
      imageUrl: 'https://picsum.photos/400/300?random=23',
      caption: 'Set Construction Day 1',
      size: 'normal'
    }
  ],
  venue: {
    name: "Dream Art Center",
    address: "123 Daehak-ro, Seoul",
    mapImageUrl: "https://picsum.photos/600/300?grayscale"
  },
  share: {
    title: "RENT: School Edition",
    text: "No day but today! Support our production of RENT.",
  }
};

export const COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'Ji-Soo Park',
    initials: 'JS',
    timeAgo: '2h ago',
    text: "The teaser looks amazing! Mark's camera work is on point! 🎥",
    colorFrom: 'from-blue-400',
    colorTo: 'to-blue-600',
    align: 'left'
  },
  {
    id: '2',
    author: 'Min-Kyung Lee',
    initials: 'MK',
    timeAgo: '5h ago',
    text: "Can't wait to hear 'One Song Glory' live! 🎸",
    colorFrom: 'from-brand-pink',
    colorTo: 'to-pink-600',
    align: 'right'
  }
];