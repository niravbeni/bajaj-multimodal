'use client';
import { useEffect, useRef } from 'react';
import { Message } from '../../../types';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
  isTyping?: boolean;
  bottomSheetHeight?: number;
}

export default function ChatWindow({ messages, isTyping, bottomSheetHeight = 0 }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      const targetScroll = scrollElement.scrollHeight - scrollElement.clientHeight;
      
      // Smooth scroll to show last message above bottom sheet
      scrollElement.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, bottomSheetHeight]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 space-y-4"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          paddingBottom: `max(24px, env(safe-area-inset-bottom))`
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* Welcome message if no messages */}
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#012953' }}>
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to EMI Assistant</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              I&apos;ll help you find the best EMI deals for your products. Start by telling me what you&apos;re looking for!
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex justify-start px-4">
            <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#012953' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#012953', animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#012953', animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 