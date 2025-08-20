'use client';
import { useEffect, useRef } from 'react';
import { Message } from '../../../types';
import MessageBubble from './MessageBubble';
import Composer from './Composer';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isTyping?: boolean;
  bottomSheetHeight?: number;
}

export default function ChatWindow({ messages, onSendMessage, disabled, isTyping, bottomSheetHeight = 0 }: ChatWindowProps) {
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
    <div className="flex flex-col h-full relative overflow-hidden" style={{ backgroundColor: '#e5ddd5' }}>
      {/* Background Image - Mobile Only */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 md:hidden"
        style={{ backgroundImage: 'url(/bg.png)' }}
      />
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 -webkit-overflow-scrolling-touch relative z-10"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          paddingBottom: `max(16px, env(safe-area-inset-bottom))`
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {/* Extra bottom padding for iOS */}
        <div className="h-20" />
      </div>
      <div className="relative z-10 safe-area-bottom bg-inherit">
        <Composer onSendMessage={onSendMessage} disabled={disabled} isTyping={isTyping} />
      </div>
    </div>
  );
} 