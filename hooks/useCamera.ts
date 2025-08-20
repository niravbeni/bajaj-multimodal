'use client';
import { useEffect, useRef, useState } from 'react';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const [ready, setReady] = useState(false);
  const [shouldMirror, setShouldMirror] = useState(false);

  useEffect(() => {
    let stream: MediaStream;
    (async () => {
      try {
        // Detect if mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Try back camera first on mobile, front camera on desktop
        const preferredFacingMode = isMobile ? 'environment' : 'user';
        
        try {
          // Try preferred camera first
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: preferredFacingMode }, 
            audio: false 
          });
          
          // Mirror front-facing cameras for face verification
          setShouldMirror(preferredFacingMode === 'user');
        } catch (error) {
          try {
            // Try front camera specifically if back camera failed
            stream = await navigator.mediaDevices.getUserMedia({ 
              video: { facingMode: 'user' }, 
              audio: false 
            });
            
            // Front camera should always be mirrored for face verification
            setShouldMirror(true);
          } catch (frontCameraError) {
            // Final fallback to any available camera
            stream = await navigator.mediaDevices.getUserMedia({ 
              video: true, 
              audio: false 
            });
            
            // Default to mirroring for face verification (most cameras are front-facing)
            setShouldMirror(true);
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
      } catch {
        setReady(false);
      }
    })();
    return () => { 
      stream?.getTracks().forEach(t => t.stop()); 
    };
  }, []);

  return { videoRef, ready, shouldMirror };
} 