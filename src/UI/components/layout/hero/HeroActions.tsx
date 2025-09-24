import { motion } from 'framer-motion';
import { ArrowDownCircle, ChevronRight, Link } from 'lucide-react';

// Componente para los botones de acción
const HeroActions = (scrollY) => {
  const smoothScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      // Fallback: scroll hacia abajo una pantalla completa
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollClick = (e) => {
    e.preventDefault();
    smoothScrollToSection('packages'); // Cambia 'packages' por el ID de tu sección
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.5, duration: 1 }}
      className='pb-16 flex flex-col items-center space-y-6'
      style={{
        transform: `translateY(${scrollY * -0.1}px)`,
      }}
    >
      {/* Botón circular con scroll suave mejorado */}
      {/* <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      >
        <button
          onClick={handleScrollClick}
          className='w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center hover:border-amber-400/60 transition-all duration-500 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/50'
          aria-label='Scroll to next section'
        >
          <ArrowDownCircle
            size={28}
            className='text-white/60 group-hover:text-amber-400/90 transition-colors duration-500'
          />
        </button>
      </motion.div> */}
    </motion.div>
  );
};

export default HeroActions;
