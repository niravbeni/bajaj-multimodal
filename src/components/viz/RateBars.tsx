'use client';
import { motion } from 'framer-motion';
import { RateItem } from '../../../types';

interface RateBarsProps {
  data: RateItem[];
}

export default function RateBars({ data }: RateBarsProps) {
  const max = Math.max(...data.map(d => d.apr));
  
  return (
    <div className="flex items-end justify-center gap-6 h-80 px-6">
      {data.map((item, i) => {
        const height = (item.apr / max) * 100;
        const isBajaj = item.provider.toLowerCase().includes('bajaj');
        
        return (
          <div key={item.provider} className="flex flex-col items-center min-w-0">
            <div className="flex flex-col items-center mb-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.5, duration: 0.3 }}
                className={`text-lg font-bold ${isBajaj ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {item.apr}%
              </motion.div>
              {isBajaj && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.8, duration: 0.4 }}
                  className="text-yellow-500 text-xs font-medium"
                >
                  ⭐ Best Rate
                </motion.div>
              )}
            </div>
            
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ 
                delay: i * 0.1, 
                type: 'spring',
                stiffness: 100,
                damping: 15
              }}
              className={`w-16 rounded-t-2xl ${
                isBajaj 
                  ? 'bg-gradient-to-t from-primary to-primary/80 shadow-lg' 
                  : 'bg-muted-foreground/30'
              }`}
              title={`${item.provider}: ${item.apr}%`}
            />
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className={`mt-3 text-sm text-center ${
                isBajaj ? 'font-semibold text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.provider}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
} 