// app/review/page.tsx

import Image from 'next/image';
import Navbar from '@/UI/components/shared/Navbar';
import Footer from '@/UI/components/shared/Footer';

export default function ReviewPage() {
  return (
    <>
      <Navbar />

      <main
        className='min-h-screen flex flex-col items-center justify-center px-6 py-32 text-center'
        style={{ background: '#0A0D12' }}
      >
        <Image
          src='/img/logo.png'
          alt='Lux Punta Cana logo'
          width={80}
          height={80}
          className='mb-8 object-contain'
        />

        <h1 className='text-2xl md:text-3xl font-bold text-amber-200 tracking-wide uppercase mb-6'>
          Share Your Experience
        </h1>

        <p className='max-w-xl text-gray-400 leading-relaxed mb-10'>
          We'd love to hear from you! Your review helps other travelers discover
          Lux Punta Cana and inspires us to keep creating unforgettable moments.
          Scan the QR code below to leave your feedback.
        </p>

        <div className='bg-white p-5 rounded-xl'>
          <Image
            src='/qr-review.svg'
            alt='QR code to leave a Google review'
            width={240}
            height={240}
            priority
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
