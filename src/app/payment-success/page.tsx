'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Refrigerator, CreditCard, Calendar, User } from 'lucide-react';
import { useFlowStore } from '../../../hooks/useFlowStore';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { comparison, selectedProduct, selectedEMI, resetFlow } = useFlowStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [transactionId, setTransactionId] = useState(''); // Will be set in useEffect
  const [currentDate, setCurrentDate] = useState('');

  // Mock data fallback
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

  const currentProduct = selectedProduct || mockProduct;
  const currentComparison = comparison || mockComparison;
  const activeItem = selectedEMI || currentComparison.items[0]; // Use selected EMI or fallback to first

  useEffect(() => {
    // Set theme color for payment success page
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#012953');
    }

    // Show confetti animation
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    
    // Generate transaction ID and date on client side only
    setTransactionId(`TXN${Date.now().toString().slice(-8)}`);
    setCurrentDate(new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }));
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="screen-blue">
      <div className="ios-safe-height overflow-hidden">
      
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                y: -20, 
                x: Math.random() * window.innerWidth,
                rotate: 0,
                opacity: 1
              }}
              animate={{ 
                y: window.innerHeight + 20,
                rotate: 360,
                opacity: 0
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
              className={`absolute w-3 h-3 ${
                ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-pink-400'][Math.floor(Math.random() * 5)]
              } rounded-full`}
            />
          ))}
        </div>
      )}

      <div className="ios-safe-height flex flex-col items-center p-6 relative overflow-hidden safe-area-bottom">
        {/* Success Icon - Moved down */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 10,
            delay: 0.2
          }}
          className="mb-4 mt-6"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            
            {/* Success Ring Animation */}
            <motion.div
              initial={{ scale: 1, opacity: 0.2 }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 border-2 border-green-300 rounded-full"
            />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-blue-200 text-lg">
            Your EMI application has been approved
          </p>
        </motion.div>

        {/* Transaction Details Card - Made smaller */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl p-3 w-full max-w-xs shadow-2xl mb-6"
        >
          <div className="text-center mb-3">
            <h2 className="text-base font-bold text-gray-900 mb-1">Transaction Details</h2>
            <p className="text-gray-600 text-xs">Transaction ID: {transactionId}</p>
          </div>

          <div className="space-y-2">
            {/* Product Details */}
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <Refrigerator className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{currentProduct.name}</p>
                                  <p className="text-gray-600 text-xs">₹2,50,000</p>
              </div>
            </div>

            {/* EMI Provider */}
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{activeItem.provider}</p>
                <p className="text-gray-600 text-xs">{activeItem.apr}% APR</p>
              </div>
            </div>

            {/* EMI Amount */}
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
              <Calendar className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Monthly EMI</p>
                <p className="text-green-600 text-sm font-bold">
                  ₹{Math.round((250000 * (1 + activeItem.apr/100)) / 12).toLocaleString()}
                </p>
              </div>
            </div>


          </div>

          {/* Success Badge */}
          <div className="mt-4 text-center">
            <div className="bg-green-100 border border-green-300 rounded-full px-4 py-1 inline-block">
              <p className="text-green-800 font-semibold text-xs">✓ EMI Approved & Activated</p>
            </div>
          </div>
        </motion.div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Action Button - Fixed at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full max-w-sm mt-auto pb-4"
        >
          <Button
            onClick={() => {
              resetFlow();
              router.push('/');
            }}
            className="w-full h-12 text-lg font-semibold rounded-2xl bg-white text-blue-900 hover:bg-gray-100"
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
      </div>
    </div>
  );
} 