'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingDown } from 'lucide-react';
import RateBars from '@/components/viz/RateBars';
import { useFlowStore } from '../../../hooks/useFlowStore';

export default function ComparePage() {
  const router = useRouter();
  const { comparison, selectedProduct } = useFlowStore();
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    // Show CTA after animation completes
    const timer = setTimeout(() => {
      setShowCTA(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for development when accessing directly
  const mockProduct = {
    name: "Samsung Family Hub RF23A9771SR",
    confidence: 0.95,
    description: "Samsung smart refrigerator with Family Hub display"
  };

  const mockComparison = {
    productName: "Samsung Family Hub RF23A9771SR",
    items: [
      { provider: "Bajaj Finserv", apr: 12.5 },
      { provider: "HDFC Bank", apr: 14.8 },
      { provider: "ICICI Bank", apr: 16.2 }
    ]
  };

  useEffect(() => {
    if (!comparison || !selectedProduct) {
      // For development, don't redirect - use mock data instead
      // router.push('/');
    }
  }, [comparison, selectedProduct, router]);

  // Use actual data if available, otherwise use mock data for development
  const currentProduct = selectedProduct || mockProduct;
  const currentComparison = comparison || mockComparison;

  const bajajRate = currentComparison.items.find(item => 
    item.provider.toLowerCase().includes('bajaj')
  );

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      <header className="p-4 border-b flex items-center bg-background/95 backdrop-blur-sm sticky top-0 z-10 safe-area-top">
                <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="w-12 h-12 cursor-pointer hover:cursor-pointer"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="ml-4 text-xl font-semibold">Rate Comparison</h1>
      </header>

      <main className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">{currentComparison.productName}</h2>
          <p className="text-muted-foreground">
            Compare APR rates from leading providers
          </p>
        </motion.div>

        <div className="mb-8">
          <RateBars data={currentComparison.items} />
        </div>

        {bajajRate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-6 text-center"
          >
            <TrendingDown className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-primary mb-1">
              Lowest APR Rate!
            </h3>
            <p className="text-sm text-muted-foreground">
              Save more with Bajaj Finserv at just {bajajRate.apr}% APR
            </p>
          </motion.div>
        )}

        {showCTA && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-4 safe-area-bottom"
          >
                      <Button 
            size="lg" 
            className="w-full max-w-md h-12 text-base font-semibold rounded-2xl cursor-pointer hover:cursor-pointer" 
            onClick={() => router.push('/ekyc')}
          >
            Proceed with Bajaj Finserv
          </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
} 