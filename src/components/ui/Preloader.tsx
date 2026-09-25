import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const duration = 1600; // ms
    const startTime = performance.now();

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const ratio = Math.min(elapsed / duration, 1);
      // Smooth cubic ease out
      const eased = Math.floor((1 - Math.pow(1 - ratio, 3)) * 100);
      setProgress(eased);

      if (ratio < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(onComplete, 600);
        }, 200);
      }
    };

    const animId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#07070c] text-white select-none pointer-events-auto"
        >
          {/* Ambient background glow */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-primary/15 blur-[120px] pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-secondary/15 blur-[100px] translate-x-20 -translate-y-10 pointer-events-none" />

          {/* Animated 3D geometric wireframe SVG */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 360 }}
            transition={{
              scale: { duration: 0.8, ease: 'easeOut' },
              rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
            }}
            className="relative w-28 h-28 mb-8"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(124,92,255,0.6)]">
              <polygon
                points="50,10 88,32 88,78 50,98 12,78 12,32"
                fill="none"
                stroke="url(#preloaderGrad)"
                strokeWidth="2.5"
                strokeDasharray="300"
                strokeDashoffset={300 - (300 * progress) / 100}
                className="transition-all duration-150"
              />
              <circle cx="50" cy="50" r="16" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.7" />
              <circle cx="50" cy="50" r="6" fill="#7c5cff" />
              <defs>
                <linearGradient id="preloaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c5cff" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Progress Percent Text */}
          <div className="font-display font-bold text-4xl sm:text-5xl tracking-tight flex items-baseline gap-1 text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-white to-secondary">
            <span>{progress}</span>
            <span className="text-xl text-primary font-normal">%</span>
          </div>

          {/* Subtitle status */}
          <div className="mt-3 text-xs tracking-widest uppercase text-text-secondary font-mono">
            {progress < 40 ? 'Initializing 3D Core...' : progress < 80 ? 'Mounting Shaders...' : 'Welcome'}
          </div>

          {/* Bottom Progress Bar */}
          <div className="w-48 sm:w-64 h-[2px] bg-white/10 rounded-full mt-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-150 ease-out shadow-[0_0_10px_#7c5cff]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
