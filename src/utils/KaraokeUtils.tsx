// views/KaraokeUtils.tsx

/**
 * Utility functions for the Karaoke Service View
 */

/**
 * Formats a setup name from kebab-case or camelCase to a user-friendly format
 */
export function formatSetupName(name: string): string {
  if (name === 'basic') return 'Standard Setup';
  if (name === 'premium') return 'Premium Setup';

  // General case: convert camelCase or kebab-case to Title Case
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Returns the features for each setup type
 */
export function getSetupFeatures(setupType: string): string[] {
  if (setupType === 'basic') {
    return [
      'Professional karaoke system',
      'Two wireless microphones',
      'Standard speaker system',
      'Song catalog with over 5,000 songs',
      'Basic lighting setup',
      'Tablet-based song selection',
      'Dual-screen display system',
    ];
  } else if (setupType === 'premium') {
    return [
      'Pro-grade karaoke system',
      'Four wireless microphones',
      'Premium speaker system with enhanced bass',
      'Song catalog with over 10,000 songs',
      'Advanced LED lighting system',
      'Fog machine',
      'Personalized welcome screen',
      'Voice effects processor',
      'Professional sound mixer',
    ];
  }

  return ['Professional equipment', 'Easy setup', 'Technical support'];
}

/**
 * Returns testimonials for the karaoke service
 */
export function getKaraokeTestimonials(): Array<{
  name: string;
  location: string;
  rating: number;
  comment: string;
}> {
  return [
    {
      name: 'Carlos M.',
      location: 'Punta Cana',
      rating: 5,
      comment:
        'The karaoke setup was incredible! Even our shy relatives were singing by the end of the night. Definitely the highlight of our family reunion.',
    },
    {
      name: 'Sarah J.',
      location: 'Bavaro',
      rating: 5,
      comment:
        'We had the premium package with the professional host, and it was worth every penny. He kept the energy high and made sure everyone had a great time.',
    },
    {
      name: 'Miguel R.',
      location: 'Cap Cana',
      rating: 4,
      comment:
        'Great selection of songs in both English and Spanish. The equipment was top quality and easy to use. Would recommend!',
    },
  ];
}

/**
 * Returns frequently asked questions about the karaoke service
 */
export function getKaraokeFAQs(): Array<{
  question: string;
  answer: string;
}> {
  return [
    {
      question: 'How much space is needed for the karaoke setup?',
      answer:
        'The standard setup requires about 10×10 feet of space. The premium setup with lighting effects needs slightly more room, around 12×12 feet. We can adjust to your space requirements.',
    },
    {
      question: 'Can we request specific songs in advance?',
      answer:
        "Absolutely! When you book, you can send us a list of must-have songs, and we'll make sure they're ready to go. Our catalog already includes over 5,000 songs (10,000+ with premium), but if there's something special you want, let us know.",
    },
    {
      question: 'Is there an age limit for the karaoke service?',
      answer:
        'Not at all! Our karaoke experience is family-friendly. We have songs for all ages, from Disney classics for the little ones to current hits and timeless favorites for adults.',
    },
    {
      question: "What happens if there's a technical issue during our event?",
      answer:
        'Our equipment is thoroughly tested before every event, but in the rare case of technical difficulties, our technician is just a phone call away and can resolve most issues remotely or arrive within 30 minutes to fix any problems.',
    },
  ];
}
