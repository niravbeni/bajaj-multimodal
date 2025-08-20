'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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

  return (
    <div className="safe-area-bottom">

      
      <div className="px-3 py-2 bg-transparent">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full max-w-none">
          {/* Input Container */}
          <div className="flex-1 relative min-w-0">
            <div className="relative flex items-center bg-white rounded-3xl border border-gray-200 shadow-sm">
              <Textarea
                value={message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                placeholder="Type a message"
                disabled={disabled}
                rows={1}
                className={cn(
                  "flex-1 border-0 bg-transparent text-black text-lg py-3 px-4 rounded-3xl",
                  "placeholder:text-gray-500",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  "resize-none min-h-[52px] max-h-24 overflow-hidden"
                )}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (message.trim() && !disabled) {
                      const syntheticEvent = {
                        preventDefault: () => {},
                      } as React.FormEvent<HTMLFormElement>;
                      handleSubmit(syntheticEvent);
                    }
                  }
                }}
                style={{
                  height: 'auto',
                  minHeight: '52px',
                  maxHeight: '96px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 96) + 'px';
                }}
              />
              

            </div>
          </div>

          {/* Send Button */}
          <Button 
            type="submit" 
            disabled={disabled || !message.trim()}
            className={cn(
              "w-12 h-12 rounded-full flex-shrink-0 transition-all duration-200",
              "bg-[#075e54] hover:bg-[#064e44] border-0",
              "disabled:opacity-30 disabled:cursor-not-allowed",
              "flex items-center justify-center"
            )}
          >
            <Send className="h-5 w-5 text-white fill-current" />
          </Button>
        </form>
      </div>
    </div>
  );
} 