import { Leaf, Sparkles, Zap } from 'lucide-react';

// Intensity Badge Component
const IntensityBadge = ({ intensity }) => {
  const styles = {
    gentle: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    strong: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const icons = {
    gentle: <Leaf className='w-3 h-3' />,
    medium: <Zap className='w-3 h-3' />,
    strong: <Sparkles className='w-3 h-3' />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[intensity]}`}
    >
      {icons[intensity]}
      {intensity}
    </span>
  );
};

export default IntensityBadge;
