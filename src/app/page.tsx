'use client';
import { useState, useEffect } from 'react';
import { useFlowStore } from '../../hooks/useFlowStore';
import { getIntent } from '../../hooks/useIntent';
import ChatWindow from '@/components/chat/ChatWindow';
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
      <div className="ios-safe-height flex flex-col h-screen w-full">
      
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
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <ChatWindow 
          messages={messages} 
          isTyping={isTyping}
          bottomSheetHeight={bottomSheetHeight}
        />
        
        {/* Sticky Composer at Bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-4" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const message = formData.get('message') as string;
            if (message.trim()) {
              handleSendMessage(message.trim());
              (e.target as HTMLFormElement).reset();
            }
          }} className="flex items-center gap-3 w-full max-w-none">        
            {/* Input Container */}
            <div className="flex-1 relative">
              <input
                type="text"
                name="message"
                placeholder={isTyping ? "AI is typing..." : "Type your message..."}
                disabled={isTyping}
                className="h-10 w-full resize-none border border-gray-300 rounded-2xl px-4 py-0 placeholder:text-gray-500 text-gray-900 text-sm focus:border-[#012953] focus:ring-[#012953] focus:ring-1 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const form = e.currentTarget.form;
                    if (form) {
                      const formData = new FormData(form);
                      const message = formData.get('message') as string;
                      if (message.trim()) {
                        handleSendMessage(message.trim());
                        form.reset();
                      }
                    }
                  }
                }}
              />
            </div>
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={isTyping}
              className="flex-shrink-0 w-10 h-10 rounded-full p-0 disabled:bg-gray-300 transition-all duration-200 flex items-center justify-center"
              style={{ backgroundColor: '#012953' }}
              onMouseEnter={(e) => {
                if (!isTyping) {
                  e.currentTarget.style.backgroundColor = '#013e75';
                }
              }}
              onMouseLeave={(e) => {
                if (!isTyping) {
                  e.currentTarget.style.backgroundColor = '#012953';
                }
              }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </main>

      <BottomSheetScan 
        open={isBottomSheetOpen} 
        onOpenChange={setBottomSheetOpen}
        onHeightChange={setBottomSheetHeight}
      />
      </div>
    </div>
  );
}
