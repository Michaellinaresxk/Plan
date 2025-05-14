import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'production-media-prisoner-of-payload.s3.amazonaws.com',
      'denomades.imgix.net',
      'images.unsplash.com',
      'res.cloudinary.com',
      'plus.unsplash.com',
      'www.ymcalouisville.org',
      'moonshadow-tqc.com.au',
      'www.guardian.in',
      'images.pexels.com',
      'www.bluewatercruising.org',
      'coastalmags.com',
      'image.cnbj1.fds.api.mi-img.com',
      'i0.wp.com',
    ],
  },
};

export default nextConfig;
