import { Anchor, Crown } from 'lucide-react';

const ServicePackagesCTA: React.FC = () => {
  return (
    <section className='py-16 md:py-24 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='text-center mb-12 md:mb-16'>
          <h2 className='text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent leading-tight animate-fade-in-up'>
            Paquetes de servicios
          </h2>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up-delayed'>
            Desde aventuras accesibles hasta lujo exclusivo en las aguas
            cristalinas del Caribe
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
          {/* Standard Packages */}
          <div className='relative h-64 md:h-100 rounded-3xl overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 hover:scale-[1.02] animate-slide-in-left'>
            <img
              src='https://images.pexels.com/photos/9207198/pexels-photo-9207198.jpeg?_gl=1*1qg0m6r*_ga*MTQzOTE0OTkxMS4xNzUzMjcxMDk0*_ga_8JE65Q40S6*czE3NTQ3MjkzMzQkbzIwJGcxJHQxNzU0NzI5NDgxJGoyNyRsMCRoMA..'
              alt='Paquetes estándar de yates'
              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-600/40 to-transparent group-hover:from-blue-800/70 transition-all duration-500' />
            <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

            <div className='absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white'>
              <h3 className='text-2xl md:text-4xl font-bold mb-4 md:mb-6 group-hover:transform group-hover:-translate-y-2 transition-all duration-500'>
                Estándar
              </h3>
              <a
                href='/standard-package'
                className='bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-white hover:text-blue-900 transition-all duration-500 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 w-fit'
              >
                <Anchor className='w-4 h-4 md:w-5 md:h-5' />
                Ver paquetes
              </a>
            </div>
          </div>

          {/* Premium Packages */}
          <div className='relative h-64 md:h-100 rounded-3xl overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-700 hover:scale-[1.02] animate-slide-in-right'>
            <img
              src='https://res.cloudinary.com/ddg92xar5/image/upload/v1754600019/1_nyrndv.jpg'
              alt='Paquetes exclusivos de yates'
              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-600/40 to-transparent group-hover:from-blue-800/70 transition-all duration-500' />
            <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

            <div className='absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white'>
              <h3 className='text-2xl md:text-4xl font-bold mb-4 md:mb-6 group-hover:transform group-hover:-translate-y-2 transition-all duration-500'>
                Exclusivos
              </h3>
              <a
                href='/premium-package'
                className='bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-white hover:text-amber-900 transition-all duration-500 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 w-fit'
              >
                <Crown className='w-4 h-4 md:w-5 md:h-5' />
                Ver paquetes
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-up-delayed {
          animation: fade-in-up 0.8s ease-out 0.5s both;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out 0.8s both;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out 1.1s both;
        }
      `}</style>
    </section>
  );
};
export default ServicePackagesCTA;
