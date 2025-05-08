export const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
];

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  hover: {
    scale: 1.03,
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.98 },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const travelPurposes = [
  {
    id: 'family',
    name: 'Familia',
    image: '/img/purpose/familia.jpg',
    desc: 'Viaje con niños',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'couple',
    name: 'Pareja',
    image: '/img/purpose/pareja.jpg',
    desc: 'Escapada romántica',
    color: 'from-rose-500 to-pink-400',
  },
  {
    id: 'friends',
    name: 'Amigos',
    image: '/img/purpose/amigos.webp',
    desc: 'Diversión en grupo',
    color: 'from-amber-500 to-orange-400',
  },
  {
    id: 'relax',
    name: 'Relajación',
    image: '/img/purpose/relax.jpg',
    desc: 'Descanso y bienestar',
    color: 'from-emerald-500 to-teal-400',
  },
];
