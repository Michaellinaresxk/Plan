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
    ],
  },
};

export default nextConfig;
