'use client';
import { Message } from '../../../types';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-3 px-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      {/* Message Bubble */}
      <div className={cn(
        "px-4 py-3 text-base leading-6 max-w-[320px] relative",
        isUser 
          ? "bg-[#dcf8c6] text-black rounded-tl-lg rounded-tr-lg rounded-bl-lg" 
          : "bg-white text-black rounded-tl-lg rounded-tr-lg rounded-br-lg"
      )}>
        
        
        <p className="whitespace-pre-wrap">{message.text}</p>
        
        {/* WhatsApp-style timestamp */}
        <div className={cn(
          "text-sm mt-2 opacity-70",
          isUser ? "text-gray-600" : "text-gray-500"
        )}>
          {(() => {
            const date = new Date(message.createdAt);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
          })()}
        </div>
        
        {/* WhatsApp-style tail */}
        <div className={cn(
          "absolute bottom-0 w-0 h-0",
          isUser 
            ? "right-[-10px] border-l-[10px] border-l-[#dcf8c6] border-t-[10px] border-t-transparent"
            : "left-[-10px] border-r-[10px] border-r-white border-t-[10px] border-t-transparent"
        )} />
      </div>
    </div>
  );
} 