import { Anchor, Crown } from 'lucide-react';

const ServicePackagesCTA: React.FC = () => {
  return (
    <section className='py-16 md:py-24 bg-white'>
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
