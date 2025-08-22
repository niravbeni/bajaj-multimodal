'use client';
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CameraView from "./CameraView";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { motion, PanInfo, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useFlowStore } from "../../../hooks/useFlowStore";
import { useRouter } from 'next/navigation';

interface BottomSheetScanProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHeightChange?: (height: number) => void;
}

export default function BottomSheetScan({ open, onOpenChange, onHeightChange }: BottomSheetScanProps) {
  const { setSelectedProduct, setComparison } = useFlowStore();
  const router = useRouter();
  const [dragState, setDragState] = useState<'default' | 'fullscreen' | 'borderless' | 'minimized'>('default');
  const [productDetected, setProductDetected] = useState<{
    name: string;
    available: boolean;
    confidence?: number;
  } | null>(null);

  const constraintsRef = useRef<HTMLDivElement>(null);

  // Simulate product detection when entering borderless mode
  React.useEffect(() => {
    if (dragState === 'borderless') {
      // Simulate detection after a short delay
      const timer = setTimeout(() => {
        setProductDetected({
          name: 'Samsung Family Hub RF23A9771SR',
          available: true,
          confidence: 89
        });
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setProductDetected(null);
    }
  }, [dragState]);
  
  // Motion values for smooth dragging
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0.8]);
  
  // Height values for different states
  const heights = {
    default: 380, // Reduced height to prevent overlapping messages
    fullscreen: typeof window !== 'undefined' ? window.innerHeight : 800,
    borderless: typeof window !== 'undefined' ? window.innerHeight : 800,
    minimized: 80
  };

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;
    
    // Determine new state based on drag distance and velocity with better thresholds
    if (offset > 100 || velocity > 300) {
      // Drag down - minimize or close
      if (dragState === 'default') {
        onOpenChange(false); // Close completely
      } else if (dragState === 'fullscreen') {
        setDragState('default'); // Back to default
        onHeightChange?.(heights.default);
      } else if (dragState === 'borderless') {
        setDragState('default'); // Back to default from borderless
        onHeightChange?.(heights.default);
      }
    } else if (offset < -100 || velocity < -300) {
      // Drag up - expand to borderless fullscreen
      if (dragState === 'default') {
        setDragState('borderless');
        onHeightChange?.(heights.borderless);
      }
    }
    
    // Smooth reset to position
    y.set(0);
  }, [dragState, onOpenChange, onHeightChange, y, heights]);



  // Calculate current height based on state
  const currentHeight = heights[dragState];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onOpenChange(false)}
      />
      
      {/* Draggable Sheet */}
      <motion.div
        ref={constraintsRef}
        className={`pointer-events-auto flex flex-col ${
          dragState === 'borderless' 
            ? 'fixed inset-0' 
            : 'absolute bottom-0 left-0 right-0'
        }`}
        style={{
          backgroundColor: dragState === 'borderless' ? 'transparent' : '#012953',
          borderTopLeftRadius: dragState === 'fullscreen' || dragState === 'borderless' ? 0 : 32,
          borderTopRightRadius: dragState === 'fullscreen' || dragState === 'borderless' ? 0 : 32,
          y: dragState === 'borderless' ? 0 : y,
          opacity
        }}
        layout
        initial={{ y: dragState === 'borderless' ? 0 : currentHeight }}
        animate={{ 
          y: 0,
          backgroundColor: dragState === 'borderless' ? 'transparent' : '#012953',
          borderTopLeftRadius: dragState === 'fullscreen' || dragState === 'borderless' ? 0 : 32,
          borderTopRightRadius: dragState === 'fullscreen' || dragState === 'borderless' ? 0 : 32
        }}
        exit={{ y: dragState === 'borderless' ? 0 : currentHeight }}
        transition={{ 
          duration: 0.2,
          ease: "easeOut"
        }}
        drag="y"
        dragConstraints={{ top: -20, bottom: 30 }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
      >
        {/* Hidden title and description for accessibility */}
        <VisuallyHidden>
          <div role="dialog" aria-labelledby="sheet-title" aria-describedby="sheet-description">
            <h2 id="sheet-title">Scan Product</h2>
            <p id="sheet-description">Use your camera to scan and identify products for EMI information</p>
          </div>
        </VisuallyHidden>
        
        {/* Header with drag handle and close button - hide in borderless mode */}
        {dragState !== 'borderless' && (
          <div className="pt-8 pb-6 flex justify-center items-center relative cursor-grab active:cursor-grabbing">
          <motion.div 
            className="w-[52px] h-[5px] rounded-full"
            style={{ backgroundColor: 'white' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: 1,
              y: 0
            }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1],
              delay: 0.2
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Pulsing overlay */}
            <motion.div
              className="w-full h-full rounded-full"
              animate={{
                backgroundColor: ['white', '#f0f0f0', 'white'],
                scale: [1, 1.08, 1],
                boxShadow: [
                  '0 0 0 rgba(255, 255, 255, 0)',
                  '0 0 8px rgba(255, 255, 255, 0.6)',
                  '0 0 0 rgba(255, 255, 255, 0)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          

        </div>
        )}
        
        {/* Camera area - proper height calculation */}
        <motion.div 
          className={`relative overflow-hidden bg-black ${
            dragState === 'borderless' 
              ? 'flex-1 w-full rounded-none' 
              : dragState === 'fullscreen' 
                ? 'h-[calc(100vh-120px)] mx-0 rounded-none' 
                : 'mx-4 mb-4 h-[320px] rounded-[23px]'
          }`}
          initial={{ 
            scale: 0.98,
            opacity: 0
          }}
          animate={{ 
            scale: 1,
            opacity: 1
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0.0, 0.2, 1],
            delay: 0.05
          }}
        >
          <CameraView cornerOverlay />
          
          {/* Top drag handle - only show in borderless mode */}
          {dragState === 'borderless' && (
            <motion.div 
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1],
                delay: 0.3
              }}
            >
              <div 
                className="w-[52px] h-[5px] rounded-full bg-white/80 shadow-md cursor-grab active:cursor-grabbing"
              />
            </motion.div>
          )}
          



        </motion.div>

        {/* Product Detection Results - only show in borderless mode */}
        {dragState === 'borderless' && productDetected && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              ease: [0.4, 0.0, 0.2, 1],
              delay: 0.2
            }}
          >
            {/* Product Status Card */}
            <motion.div 
              className="mb-4 p-4 rounded-2xl backdrop-blur-md border"
              style={{
                backgroundColor: productDetected.available 
                  ? 'rgba(1, 41, 83, 0.15)' 
                  : 'rgba(239, 68, 68, 0.15)',
                borderColor: productDetected.available 
                  ? 'rgba(1, 41, 83, 0.3)' 
                  : 'rgba(239, 68, 68, 0.3)'
              }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1],
                delay: 0.4
              }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    productDetected.available ? 'bg-blue-400' : 'bg-red-400'
                  }`}
                ></div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-base mb-1">
                    This is a {productDetected.name}
                  </h3>
                  <p className={`text-sm ${
                    productDetected.available ? 'text-blue-300' : 'text-red-300'
                  }`}>
                    {productDetected.available 
                      ? 'Available for purchase with EMI options'
                      : 'Not available for purchase, please try again'
                    }
                  </p>
                  {productDetected.confidence && (
                    <p className="text-white/60 text-xs mt-1">
                      {productDetected.confidence}% confidence
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1],
                delay: 0.6
              }}
            >
{productDetected.available ? (
                <div className="w-full flex gap-2">
                  {/* Purchase Product Button */}
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Dummy action - just show alert for now
                      alert('Purchase feature coming soon!');
                    }}
                    className="flex-1 h-12 text-xs font-semibold rounded-2xl cursor-pointer hover:cursor-pointer text-white p-4"
                    style={{ backgroundColor: '#012953' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#013e75'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#012953'}
                  >
                    Purchase
                  </Button>
                  
                  {/* Find Best EMI Button */}
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      // Set the required data in flow store
                      const product = {
                        name: productDetected.name,
                        confidence: (productDetected.confidence || 89) / 100,
                        description: `${productDetected.name} available for EMI purchase`
                      };
                      
                      const comparisonData = {
                        productName: productDetected.name,
                        items: [
                          { provider: 'Bajaj Finserv', apr: 14.2 },
                          { provider: 'HDFC Bank', apr: 16.8 },
                          { provider: 'ICICI Bank', apr: 18.5 }
                        ]
                      };
                      
                      setSelectedProduct(product);
                      setComparison(comparisonData);
                      
                      // Close the bottom sheet first, then navigate
                      onOpenChange(false);
                      setTimeout(() => {
                        router.push('/loading-compare');
                      }, 200);
                    }}
                    className="flex-1 h-12 text-xs font-semibold rounded-2xl cursor-pointer hover:cursor-pointer text-white p-4"
                    style={{ backgroundColor: '#012953' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#013e75'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#012953'}
                  >
                    Find Best EMI
                  </Button>
                  
                  {/* More Info Button */}
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Dummy action - just show alert for now
                      alert('More info feature coming soon!');
                    }}
                    className="flex-1 h-12 text-xs font-semibold rounded-2xl cursor-pointer hover:cursor-pointer text-white p-4"
                    style={{ backgroundColor: '#012953' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#013e75'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#012953'}
                  >
                    More Info
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenChange(false);
                  }}
                  className="w-full h-14 text-base font-semibold rounded-2xl cursor-pointer hover:cursor-pointer bg-red-500 text-white hover:bg-red-600"
                >
                  Try Again
                </Button>
              )}
            </motion.div>
          </motion.div>
        )}

        
       </motion.div>
        </div>
      )}
    </AnimatePresence>
   );
 } 