'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComposerProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isTyping?: boolean;
}

export default function Composer({ onSendMessage, disabled = false, isTyping = false }: ComposerProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-4xl mx-auto">        
        {/* Input Container */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTyping ? "AI is typing..." : "Type your message..."}
            disabled={disabled}
            className={cn(
              "h-10 w-full resize-none border border-gray-300 rounded-2xl px-4 py-0",
              "placeholder:text-gray-500 text-gray-900 text-sm",
              "focus:border-[#012953] focus:ring-[#012953] focus:ring-1 focus:outline-none",
              "disabled:bg-gray-50 disabled:text-gray-400"
            )}
          />

        </div>
        
        {/* Send Button */}
                <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full p-0",
            "disabled:bg-gray-300",
            "transition-all duration-200"
          )}
          style={!disabled && message.trim() ? { backgroundColor: '#012953' } : {}}
          onMouseEnter={(e) => {
            if (!disabled && message.trim()) {
              e.currentTarget.style.backgroundColor = '#013e75';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && message.trim()) {
              e.currentTarget.style.backgroundColor = '#012953';
            }
          }}
        >
          <Send className="w-4 h-4" />
                </Button>
      </form>
    </div>
  );
} 