'use client';
import { Message } from '../../../types';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex w-full gap-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      {/* Avatar for assistant */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#012953' }}>
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      {/* Message Content */}
      <div 
        className={cn(
          "max-w-[280px] rounded-2xl px-4 py-3 shadow-sm border",
          isUser 
            ? "text-white border-gray-200" 
            : "bg-white text-gray-900 border-gray-200"
        )}
        style={isUser ? { backgroundColor: '#012953' } : {}}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        
        {/* Timestamp */}
        <div className={cn(
          "text-xs mt-2 opacity-70",
          isUser ? "text-blue-200" : "text-gray-500"
        )}>
          {(() => {
            const date = new Date(message.createdAt);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
          })()}
        </div>
      </div>
      
      {/* Avatar for user */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </div>
  );
} 