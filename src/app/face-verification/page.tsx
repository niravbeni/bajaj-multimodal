'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function FaceVerificationPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const [ready, setReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Setup front-facing camera
  useEffect(() => {
    let stream: MediaStream;
    (async () => {
      try {
        // Always use front camera for face verification
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' }, 
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Handle play() with proper error handling
          try {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              await playPromise;
            }
            setReady(true);
          } catch (playError) {
            // Ignore play interruption errors - they're harmless
            if (playError instanceof Error && playError.name !== 'AbortError') {
              console.warn('Video play error:', playError);
            }
            // Still set ready to true as the stream is connected
            setReady(true);
          }
        }
      } catch (error) {
        console.error('Camera access failed:', error);
        setReady(false);
      }
    })();
    
    return () => { 
      stream?.getTracks().forEach(t => t.stop()); 
    };
  }, []);

  // Simulate face detection after camera is ready
  useEffect(() => {
    if (ready) {
      const timer = setTimeout(() => {
        setFaceDetected(true);
        // Auto start scanning
        setTimeout(() => {
          setIsScanning(true);
        }, 800);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [ready]);

  // Progress animation
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            // Navigate to next screen
            setTimeout(() => {
              router.push('/payment-success');
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 60);

      return () => clearInterval(interval);
    }
  }, [isScanning, router]);

  return (
    <div className="ios-safe-height w-full bg-black relative overflow-hidden safe-area-top safe-area-bottom">
      {/* Real Camera Background */}
      <div className="absolute inset-0">
        <video 
          ref={videoRef} 
          playsInline 
          className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
        />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center p-4 pt-12">
        <h1 className="text-white font-medium">Face Verification</h1>
      </div>

      {/* Face Detection Overlay */}
      <div className="absolute inset-0 flex items-center justify-center -mt-16">
        {/* Face-shaped Oval Frame */}
        <div className="relative">
          <motion.div
            className={`w-64 h-80 rounded-full border-4 transition-colors duration-500 ${
              faceDetected ? 'border-green-400 shadow-lg shadow-green-400/50' : 'border-white/70'
            }`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* Bottom Text and Progress Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pb-8 pt-12">
        {/* Instructions */}
        <div className="px-8 mb-6">
          <div className="text-center">
            {!ready && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/50 backdrop-blur-sm rounded-2xl p-4"
              >
                <h2 className="text-white text-lg font-medium mb-2">Initializing camera...</h2>
                <p className="text-white/70 text-sm">Please allow camera access</p>
              </motion.div>
            )}

            {ready && !faceDetected && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/50 backdrop-blur-sm rounded-2xl p-4"
              >
                <h2 className="text-white text-lg font-medium mb-2">Position your face in the oval</h2>
                <p className="text-white/70 text-sm">Look directly at the camera</p>
              </motion.div>
            )}

            {faceDetected && !isScanning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-400/30"
              >
                <h2 className="text-green-400 text-lg font-medium mb-2">Face detected</h2>
                <p className="text-green-300 text-sm">Starting verification...</p>
              </motion.div>
            )}

            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-green-400/30"
              >
                <h2 className="text-green-400 text-lg font-medium mb-2">Verifying...</h2>
                <p className="text-green-300 text-sm mb-4">Please hold still</p>
                
                {/* Progress Bar - Inline */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-green-300 text-xs font-medium">Progress</span>
                    <span className="text-green-400 text-xs font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-green-900/30 rounded-full h-2">
                    <motion.div 
                      className="bg-green-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>



        {/* Bottom Info */}
        <div className="px-8 mt-4">
          <div className="text-center text-white/60 text-xs">
            <p>Keep your face centered and well-lit</p>
          </div>
        </div>
      </div>
    </div>
  );
} 