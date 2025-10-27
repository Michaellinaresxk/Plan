const YOGA_STYLES = [
  {
    id: 'hatha',
    name: 'Hatha',
    gradient: 'from-stone-100 via-stone-200 to-stone-300',
  },
  {
    id: 'vinyasa',
    name: 'Vinyasa',
    gradient: 'from-slate-100 via-slate-200 to-slate-300',
  },
  {
    id: 'ashtanga',
    name: 'Ashtanga',
    gradient: 'from-gray-100 via-gray-200 to-gray-300',
  },
  {
    id: 'yin',
    name: 'Yin (Estiramientos)',
    gradient: 'from-neutral-100 via-neutral-200 to-neutral-300',
  },
  {
    id: 'restorative',
    name: 'Restaurativo',
    gradient: 'from-zinc-100 via-zinc-200 to-zinc-300',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const videos = [
  {
    id: '1',
    url: 'https://res.cloudinary.com/ddg92xar5/video/upload/v1761498537/IMG_2109_xfgvxu.mov',
    thumbnail: 'https://tu-cdn.com/thumb1.jpg',
    title: 'Video 1',
  },
  {
    id: '2',
    url: 'https://res.cloudinary.com/ddg92xar5/video/upload/v1761498529/IMG_9304_bdjr4v.mov',
    thumbnail: 'https://tu-cdn.com/thumb2.jpg',
    title: 'Video 2',
  },
  {
    id: '3',
    url: 'https://res.cloudinary.com/ddg92xar5/video/upload/v1761498517/IMG_2453_egibrh.mov',
    thumbnail: 'https://tu-cdn.com/thumb3.jpg',
    title: 'Video 3',
  },
];
export { YOGA_STYLES, videos, fadeInUp, slideIn };
