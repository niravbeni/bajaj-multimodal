'use client';
import { useState } from 'react';
import { useFlowStore } from '../../hooks/useFlowStore';
import { getIntent } from '../../hooks/useIntent';
import ChatWindow from '@/components/chat/ChatWindow';
import BottomSheetScan from '@/components/scan/BottomSheetScan';

export default function Home() {
  const { 
    messages, 
    isBottomSheetOpen, 
    addMessage, 
    setBottomSheetOpen 
  } = useFlowStore();
  
  const [isTyping, setIsTyping] = useState(false);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);

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
      
      // Add a small delay for better UX
      setTimeout(() => {
        addMessage({ role: 'assistant', text: data.response });
        setIsTyping(false);
        
        // Open camera AFTER bot response is shown
        if (intent === 'open_scan') {
          setTimeout(() => {
            setBottomSheetOpen(true);
          }, 300); // Small delay to ensure message is rendered
        }
      }, 500);
    } catch (error) {
      console.error('Chat API Error:', error);
      addMessage({ 
        role: 'assistant', 
        text: 'Sorry, I encountered an error. Please try again.' 
      });
      setIsTyping(false);
      
      // Open camera even on error if intent was to scan
      if (intent === 'open_scan') {
        setTimeout(() => {
          setBottomSheetOpen(true);
        }, 300);
      }
    }
  };

  return (
    <div className="ios-safe-height flex flex-col overflow-hidden" style={{ backgroundColor: '#e5ddd5' }}>
      {/* Status Bar Area - Green */}
      <div className="w-full safe-area-top" style={{ backgroundColor: '#075e54' }}></div>
      
      {/* WhatsApp-style Header */}
      <header className="px-4 py-3 pt-6 flex items-center gap-3" style={{ backgroundColor: '#075e54' }}>
        <div className="w-10 h-10 rounded-full bg-[#075e54] flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
            <path d="M19 15L20.09 18.26L23 19L20.09 19.74L19 23L17.91 19.74L15 19L17.91 18.26L19 15Z" />
            <path d="M5 15L6.09 18.26L9 19L6.09 19.74L5 23L3.91 19.74L1 19L3.91 18.26L5 15Z" />
          </svg>
        </div>
        <div className="flex-1">
          <h1 className="text-white font-medium text-lg">AI Assistant</h1>
          <p className="text-gray-400 text-sm">Online</p>
        </div>
        <button className="w-6 h-6 text-gray-400">
          <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </header>
      
      <main className="flex-1 overflow-hidden safe-area-bottom">
        <ChatWindow 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          isTyping={isTyping}
          bottomSheetHeight={bottomSheetHeight}
        />
      </main>

      <BottomSheetScan 
        open={isBottomSheetOpen} 
        onOpenChange={setBottomSheetOpen}
        onHeightChange={setBottomSheetHeight}
      />
    </div>
  );
}
