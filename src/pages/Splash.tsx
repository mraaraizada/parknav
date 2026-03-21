import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Car } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => navigate('/home'), 300);
      return () => clearTimeout(timer);
    }
  }, [progress, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white relative overflow-hidden">
      {/* Background floating icons */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-200 opacity-40"
          style={{
            left: `${10 + i * 12}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          <MapPin size={20 + (i % 3) * 8} />
        </motion.div>
      ))}

      <motion.div
        className="flex flex-col items-center gap-6 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Logo */}
        <motion.div
          className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-300 overflow-hidden"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img src="/logo.png" alt="ParkNav Logo" className="w-full h-full object-cover" />
        </motion.div>

        {/* Brand name */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-blue-600 tracking-tight">ParkNav</h1>
          <p className="text-blue-400 text-lg mt-2 font-medium">Park Smarter, Not Harder</p>
        </div>

        {/* Animated car */}
        <motion.div
          className="flex items-center gap-2 text-blue-400"
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Car size={28} />
        </motion.div>

        {/* Status text */}
        <motion.p
          className="text-slate-500 text-base"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Finding parking near you...
        </motion.p>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-blue-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <p className="text-blue-400 text-sm font-medium">{progress}%</p>
      </motion.div>
    </div>
  );
}
