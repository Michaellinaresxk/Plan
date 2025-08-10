// ============================================
// SCROLL-TRIGGERED SERVICES GALLERY - MODERNA Y PREMIUM
// ============================================

import { useEffect, useState } from 'react';

export const useScrollGallery = (totalServices) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 3 });

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrolled / maxScroll, 1);
      setScrollProgress(progress);

      // Calculate which services should be visible based on scroll
      const progressThroughGallery = Math.max(
        0,
        Math.min(1, (progress - 0.3) / 0.4)
      );
      const maxVisible = Math.ceil(totalServices * progressThroughGallery) || 3;
      setVisibleRange({ start: 0, end: Math.min(maxVisible, totalServices) });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalServices]);

  return { scrollProgress, visibleRange };
};
