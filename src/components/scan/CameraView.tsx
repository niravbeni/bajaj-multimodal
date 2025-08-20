'use client';
import React from 'react';
import { useProductCamera } from '../../../hooks/useProductCamera';

interface CameraViewProps {
  cornerOverlay?: boolean;
}

export default function CameraView({ cornerOverlay = false }: CameraViewProps) {
  const { videoRef, ready, shouldMirror } = useProductCamera();
  
  return (
    <div className="relative h-full w-full bg-black overflow-hidden">
      <video 
        ref={videoRef} 
        playsInline 
        className={`absolute inset-0 h-full w-full object-cover ${shouldMirror ? 'scale-x-[-1]' : ''}`}
      />
      {cornerOverlay && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner overlays - simple white frames */}
          <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-white rounded-tl-lg"></div>
          <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-white rounded-tr-lg"></div>
          <div className="absolute bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-white rounded-bl-lg"></div>
          <div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-white rounded-br-lg"></div>
          
          {/* Center Instructions */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {!ready && (
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-6 py-3">
                <p className="text-white text-base text-center font-medium">Initializing camera...</p>
              </div>
            )}
            
            {ready && (
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-6 py-3">
                <p className="text-white text-base text-center font-medium">Point camera at product</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 