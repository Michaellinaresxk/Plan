import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useWindowDimensions from '@/hooks/useWindowDimensions';

const AnimatedParticles = ({ scrollY }) => {
  const { width, height } = useWindowDimensions();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // No renderizar hasta que esté en el cliente
  if (!isClient || width === 0 || height === 0) {
    return null;
  }

  return (
    <motion.div
      className='absolute inset-0 z-15 pointer-events-none overflow-hidden'
      style={{
        transform: `translateY(${scrollY * 0.3}px)`,
      }}
    >
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            scale: 0,
            x: Math.random() * width,
            y: Math.random() * height,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
            y: [Math.random() * height, -100],
          }}
          transition={{
            duration: Math.random() * 4 + 6,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
          className='absolute w-1 h-1 bg-amber-400 rounded-full'
        />
      ))}
    </motion.div>
  );
};

export default AnimatedParticles;
