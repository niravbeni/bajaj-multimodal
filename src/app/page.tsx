'use client';
import { useState, useEffect } from 'react';
import { useFlowStore } from '../../hooks/useFlowStore';
import { getIntent } from '../../hooks/useIntent';
import ChatWindow from '@/components/chat/ChatWindow';
import Composer from '@/components/chat/Composer';
import BottomSheetScan from '@/components/scan/BottomSheetScan';
import { Sparkles, Settings } from 'lucide-react';

export default function Home() {
  const { 
    messages, 
    isBottomSheetOpen, 
    addMessage, 
    setBottomSheetOpen 
  } = useFlowStore();
  
  const [isTyping, setIsTyping] = useState(false);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);

  // Set theme color for chat page to blue
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#012953');
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    // Add user message
    addMessage({ role: 'user', text });

    // Check intent
    const intent = getIntent(text);

    // Get AI response from API
    setIsTyping(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          latest: text
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);
      
      // Add AI response
      addMessage({ 
        role: 'assistant', 
        text: data.content || data.message || 'I understand you want to explore EMI options. Let me help you scan and compare products!'
      });

             // Check if should open product scan
       if (intent === 'open_scan' || 
           text.toLowerCase().includes('scan') || 
           text.toLowerCase().includes('product') ||
           text.toLowerCase().includes('camera')) {
         setTimeout(() => {
           setBottomSheetOpen(true);
         }, 300);
       }
    } catch (error) {
      console.error('Chat API Error:', error);
      
      // Fallback response
      addMessage({
        role: 'assistant',
        text: "I'd love to help you find the best EMI options! Try scanning a product with your camera to get started."
      });
      
             if (intent === 'open_scan') {
        setTimeout(() => {
          setBottomSheetOpen(true);
        }, 300);
      }
    }
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="ios-safe-height flex flex-col h-screen max-w-4xl mx-auto">
      
      {/* Modern AI Assistant Header */}
      <header className="px-6 py-4 flex items-center gap-4" style={{ backgroundColor: '#012953' }}>
        <Sparkles className="w-6 h-6 text-white" />
        <div className="flex-1">
          <h1 className="text-white font-semibold text-xl">AI Assistant</h1>
        </div>
        <button className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
          <Settings className="w-5 h-5 text-white" />
        </button>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <ChatWindow 
          messages={messages} 
          isTyping={isTyping}
          bottomSheetHeight={bottomSheetHeight}
        />
      </main>

      {/* Fixed Message Input at Bottom */}
      <div className="flex-shrink-0">
        <Composer 
          onSendMessage={handleSendMessage} 
          disabled={false} 
          isTyping={isTyping}
        />
      </div>

      <BottomSheetScan 
        open={isBottomSheetOpen} 
        onOpenChange={setBottomSheetOpen}
        onHeightChange={setBottomSheetHeight}
      />
      </div>
    </div>
  );
}
