'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useFlowStore } from '../../../hooks/useFlowStore';

export default function LoadingComparePage() {
  const router = useRouter();
  const { selectedProduct } = useFlowStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Set theme color for loading page
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#000000');
    }

    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    setIsLoading(false);
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle video end event for navigation
  const handleVideoEnd = () => {
    router.push('/ranking');
  };

  // Fallback timer only for safety (longer than video duration)
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      router.push('/ranking');
    }, 17000); // 17 second fallback (longer than 15.48 sec video)

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [router]);

  // Desktop: Wait for same duration as video (15.5+ seconds) for consistency
  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => {
        router.push('/ranking');
      }, 16000); // 16 seconds to match video timing (15.48s + buffer)

      return () => {
        clearTimeout(timer);
      };
    }
  }, [router, isMobile]);

  // Show black background while loading to prevent flash
  if (isLoading) {
    return (
      <div className="screen-black h-screen w-screen" />
    );
  }

  if (isMobile) {
    // Mobile: Clean full-screen video only - wait for video to complete
    return (
      <div className="screen-black w-screen overflow-hidden" style={{ 
        height: '100dvh',
        minHeight: '-webkit-fill-available'
      }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ 
            backgroundColor: 'black'
          }}
          onEnded={handleVideoEnd}
        >
          <source src="/loader.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  // Desktop: Simple spinner with video-inspired colors
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center safe-area-top safe-area-bottom">
      <div className="text-center px-6">
        {/* Spinner inspired by video colors */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Large Spinning Ring */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-full rounded-full border-4 border-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 p-1"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
            </motion.div>
            
            {/* Inner pulsing dot */}
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            />
          </div>

          {/* Loading Text */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Analyzing EMI Options
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-purple-100 text-lg mb-8"
          >
            {selectedProduct?.name ? `Finding best rates for ${selectedProduct.name}` : 'Comparing rates from top providers'}
          </motion.p>

          {/* Progress Dots with video-inspired colors */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{ 
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
              />
            ))}
          </div>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-purple-200 text-sm"
        >
          Powered by Agentic EMIs AI
        </motion.div>
      </div>
    </div>
  );
} 