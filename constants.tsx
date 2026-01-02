import { ProjectData, Comment } from './types';

export const PROJECT_DATA: ProjectData = {
  meta: {
    title: "The Cat's Meow:\nA Purr-fect Melody",
    company: "Dream Big Productions",
    tags: ["Musical", "Romance"],
    logoUrl: "https://picsum.photos/50/50?random=10"
  },
  hero: {
    mediaUrl: "https://picsum.photos/800/1200?random=99",
    badge: "Official Trailer"
  },
  funding: {
    goalAmount: 1000000,
  },
  synopsis: [
    {
      id: '1',
      icon: '🏙️',
      title: 'Big City Dreams',
      description: 'In the bustling alleyways of New York City, a stray cat named Whiskers dreams of performing on Broadway.',
      highlight: 'New York City'
    },
    {
      id: '2',
      icon: '🎷',
      title: 'Jazz & Friendship',
      description: 'When he stumbles upon a struggling jazz club run by a retired opera singer, his life changes forever. Join us on this toe-tapping journey!',
      highlight: 'toe-tapping journey'
    }
  ],
  cast: [
    {
      id: '1',
      name: 'Luna',
      role: 'The Diva',
      actorName: 'Sarah J.',
      imageUrl: 'https://picsum.photos/200/200?random=1'
    },
    {
      id: '2',
      name: 'Whiskers',
      role: 'The Dreamer',
      actorName: 'Mike C.',
      imageUrl: 'https://picsum.photos/200/200?random=2'
    },
    {
      id: '3',
      name: 'Bella',
      role: 'The Sweetheart',
      actorName: 'Emily D.',
      imageUrl: 'https://picsum.photos/200/200?random=3'
    },
    {
      id: '4',
      name: 'Tom',
      role: 'The Grump',
      actorName: 'David K.',
      imageUrl: 'https://picsum.photos/200/200?random=4'
    },
    {
      id: '5',
      name: 'Jazzy',
      role: 'The Sax Player',
      actorName: 'Alex R.',
      imageUrl: 'https://picsum.photos/200/200?random=5'
    }
  ],
  venue: {
    name: "Dream Art Center",
    address: "123 Daehak-ro, Seoul",
    mapImageUrl: "https://picsum.photos/600/300?grayscale"
  },
  share: {
    title: "The Cat's Meow Mus\\ical",
    text: "Help bring this purr-fect melody to life! Check out the funding project.",
  }
};

// Exporting separate lists for backward compatibility if needed, 
// but components should ideally use PROJECT_DATA directly.
export const COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'Ji-Soo Park',
    initials: 'JS',
    timeAgo: '2h ago',
    text: "Can't wait to see this! The character designs are so adorable! 😻",
    colorFrom: 'from-blue-400',
    colorTo: 'to-blue-600',
    align: 'left'
  },
  {
    id: '2',
    author: 'Min-Kyung Lee',
    initials: 'MK',
    timeAgo: '5h ago',
    text: "Supported! Hope it reaches the stretch goal for the soundtrack CD. 💿",
    colorFrom: 'from-brand-pink',
    colorTo: 'to-pink-600',
    align: 'right'
  }
];