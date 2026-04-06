import React, { useState, useRef, useCallback } from 'react';
import { Play, X, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MediaItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  title: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VIDEOS: MediaItem[] = [
  {
    id: 1,
    type: 'video',
    src: 'https://res.cloudinary.com/ddg92xar5/video/upload/v1759669338/yate_m7z3ve.mp4',
    thumbnail:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600018/2_dc7fry.jpg',
    title: 'Luxury Yacht Experience',
  },
  {
    id: 2,
    type: 'video',
    src: 'https://res.cloudinary.com/ddg92xar5/video/upload/v1759669338/yate_m7z3ve.mp4',
    thumbnail:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600017/3_eapwql.jpg',
    title: 'Caribbean Adventure',
  },
  {
    id: 3,
    type: 'video',
    src: 'https://res.cloudinary.com/ddg92xar5/video/upload/v1759669338/yate_m7z3ve.mp4',
    thumbnail:
      'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600209/3_dvbeqw.jpg',
    title: 'Sunset Sailing',
  },
];

const IMAGES: MediaItem[] = [
  {
    id: 4,
    type: 'image',
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600211/1_k81g6k.jpg',
    title: 'Ocean Paradise',
  },
  {
    id: 5,
    type: 'image',
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1755956399/3380551b-f82f-4fdc-86e2-47cf2ad3a6dc_foh9sp.jpg',
    title: 'Luxury Interior',
  },
  {
    id: 6,
    type: 'image',
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1754600208/2_k72tfn.jpg',
    title: 'Crystal Waters',
  },
];

// ─── Animation ────────────────────────────────────────────────────────────────

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Video Player Modal ───────────────────────────────────────────────────────

const VideoPlayerModal: React.FC<{
  src: string;
  thumbnail: string;
  onClose: () => void;
}> = ({ src, thumbnail, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) v.pause();
    else v.play();
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8'
    >
      <button
        onClick={onClose}
        className='absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10'
        aria-label='Close'
      >
        <X className='w-4 h-4' />
      </button>

      <div className='relative w-full max-w-5xl'>
        <video
          ref={videoRef}
          src={src}
          poster={thumbnail}
          className='w-full'
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlay}
        />

        {/* Controls */}
        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6'>
          <div className='flex items-center gap-3'>
            <button
              onClick={togglePlay}
              aria-label='Play/Pause'
              className='w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors'
            >
              {isPlaying ? (
                <Pause className='w-4 h-4' />
              ) : (
                <Play className='w-4 h-4 ml-0.5' />
              )}
            </button>

            <div className='flex-1 h-1 bg-white/20 overflow-hidden'>
              <div
                className='h-full bg-amber-500 transition-all duration-200'
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              onClick={toggleMute}
              aria-label='Mute/Unmute'
              className='text-white/60 hover:text-white transition-colors'
            >
              {isMuted ? (
                <VolumeX className='w-4 h-4' />
              ) : (
                <Volume2 className='w-4 h-4' />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const YachtVideoGallery: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);

  return (
    <section className='bg-stone-950 py-14 sm:py-18 lg:py-20'>
      <div className='px-5 sm:px-8 lg:px-12'>
        {/* Header */}
        <motion.div
          className='mb-10'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeIn}
        >
          <p className='text-amber-500 uppercase tracking-[0.25em] text-[11px] font-medium mb-2'>
            Video Gallery
          </p>
          <h2 className='text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-tight'>
            Experience the <span className='font-semibold'>Journey</span>
          </h2>
        </motion.div>

        {/* Videos — 3 columns, compact landscape */}
        <motion.div
          className='grid grid-cols-3 gap-1.5 sm:gap-2 mb-1.5 sm:mb-2'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          {VIDEOS.map((video) => (
            <motion.div
              key={video.id}
              className='relative aspect-[4/3] overflow-hidden cursor-pointer group'
              variants={fadeIn}
              onClick={() => setActiveVideo(video)}
            >
              <Image
                src={video.thumbnail!}
                alt={video.title}
                fill
                className='object-cover transition-transform duration-700 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500' />

              {/* Play icon */}
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-10 h-10 sm:w-12 sm:h-12 bg-white/10 border border-white/20 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:bg-white/20 transition-all'>
                  <Play className='w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5' />
                </div>
              </div>

              {/* Title */}
              <div className='absolute bottom-0 left-0 right-0 p-2.5 sm:p-3'>
                <h3 className='text-white text-[11px] sm:text-xs font-medium'>
                  {video.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Images — 3 columns */}
        <motion.div
          className='grid grid-cols-3 gap-1.5 sm:gap-2'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
        >
          {IMAGES.map((image) => (
            <motion.div
              key={image.id}
              className='relative aspect-[4/3] overflow-hidden group'
              variants={fadeIn}
            >
              <Image
                src={image.src}
                alt={image.title}
                fill
                className='object-cover transition-transform duration-700 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500' />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoPlayerModal
            src={activeVideo.src}
            thumbnail={activeVideo.thumbnail!}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default YachtVideoGallery;
