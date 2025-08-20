'use client';
import { useEffect, useRef, useState } from 'react';

export function useProductCamera() {
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const [ready, setReady] = useState(false);
  const [shouldMirror, setShouldMirror] = useState(false);

  useEffect(() => {
    let stream: MediaStream;
    (async () => {
      try {
        // Detect if mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          // Mobile: Try back camera first (not mirrored)
          try {
            stream = await navigator.mediaDevices.getUserMedia({ 
              video: { facingMode: 'environment' }, 
              audio: false 
            });
            setShouldMirror(false); // Back camera, don't mirror
          } catch (error) {
            // Fallback to front camera on mobile
            stream = await navigator.mediaDevices.getUserMedia({ 
              video: { facingMode: 'user' }, 
              audio: false 
            });
            setShouldMirror(false); // Even front camera on mobile, don't mirror for products
          }
        } else {
          // Desktop: Use front camera (NOT mirrored for product scanning)
          try {
            stream = await navigator.mediaDevices.getUserMedia({ 
              video: { facingMode: 'user' }, 
              audio: false 
            });
            setShouldMirror(false); // Desktop front camera, don't mirror for product scanning
          } catch (error) {
            // Final fallback to any camera
            stream = await navigator.mediaDevices.getUserMedia({ 
              video: true, 
              audio: false 
            });
            setShouldMirror(false); // Desktop, don't mirror for product scanning
          }
        }
        
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

  return { videoRef, ready, shouldMirror };
} 