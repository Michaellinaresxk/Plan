import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'production-media-prisoner-of-payload.s3.amazonaws.com',
      'denomades.imgix.net', // Añade el dominio del error
      'images.unsplash.com', // Otros dominios comunes para imágenes
      'res.cloudinary.com', // Puedes añadir otros dominios que uses
    ],
  },
};

export default nextConfig;
