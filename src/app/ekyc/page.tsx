'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Shield, Camera, CheckCircle2 } from 'lucide-react';
import { useCamera } from '../../../hooks/useCamera';

export default function EKYCPage() {
  const router = useRouter();
  const { videoRef, ready } = useCamera();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress animation
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 70) {
          clearInterval(timer);
          return 70; // Stop at 70% to show this is a mock
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen bg-black flex flex-col safe-area-top safe-area-bottom">
      <header className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between safe-area-top">
                <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="text-white hover:bg-white/20 w-12 h-12 cursor-pointer hover:cursor-pointer"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-white font-medium text-lg">eKYC Verification</h1>
        <div className="w-12" />
      </header>

      {/* Camera with face overlay */}
      <div className="flex-1 relative">
        <video 
          ref={videoRef} 
          playsInline 
          className="absolute inset-0 h-full w-full object-cover" 
        />
        
        {/* Face outline mask */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            {/* Circular face outline */}
            <div className="w-64 h-80 border-4 border-white/90 rounded-[50%] relative">
              {/* Progress ring */}
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 3.02} 302`}
                  initial={{ strokeDasharray: "0 302" }}
                  animate={{ strokeDasharray: `${progress * 3.02} 302` }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              
              {/* Face guide dots */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full" />
              <div className="absolute top-32 left-16 w-1.5 h-1.5 bg-white/60 rounded-full" />
              <div className="absolute top-32 right-16 w-1.5 h-1.5 bg-white/60 rounded-full" />
              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-white/60 rounded-full" />
            </div>
          </motion.div>
        </div>

        {!ready && (
          <div className="absolute inset-0 grid place-items-center text-white">
            <div className="text-center">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-60" />
              <p>Grant camera access for eKYC verification</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom panel */}
      <div className="bg-black/95 backdrop-blur-md p-6 space-y-6 safe-area-bottom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white space-y-3"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-base font-medium">Secure Verification</span>
          </div>
          
          <h3 className="text-xl font-semibold">
            Position your face within the frame
          </h3>
          <p className="text-base text-white/80 leading-relaxed">
            Hold still while we verify your identity
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              currentStep >= 1 ? 'bg-primary text-white' : 'bg-white/20'
            }`}>
              {currentStep > 1 ? <CheckCircle2 className="h-3 w-3" /> : '1'}
            </div>
            Face Scan
          </div>
          <div className="w-8 h-px bg-white/20" />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              currentStep >= 2 ? 'bg-primary text-white' : 'bg-white/20'
            }`}>
              2
            </div>
            Document
          </div>
          <div className="w-8 h-px bg-white/20" />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              currentStep >= 3 ? 'bg-primary text-white' : 'bg-white/20'
            }`}>
              3
            </div>
            Complete
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/60">
            <span>Verification Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Continue button (disabled for mock) */}
        <Button 
          size="lg" 
          className="w-full h-14 text-base font-semibold rounded-2xl cursor-pointer hover:cursor-pointer disabled:cursor-not-allowed" 
          disabled
        >
          Verifying Identity...
        </Button>
        
        <p className="text-sm text-center text-white/60">
          🔒 Your data is encrypted and secure
        </p>
      </div>
    </div>
  );
} 