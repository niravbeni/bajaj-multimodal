'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Smartphone, CreditCard, Calendar, User } from 'lucide-react';
import { useFlowStore } from '../../../hooks/useFlowStore';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { comparison, selectedProduct, selectedEMI, resetFlow } = useFlowStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [transactionId, setTransactionId] = useState(''); // Will be set in useEffect
  const [currentDate, setCurrentDate] = useState('');

  // Mock data fallback
  const mockProduct = {
    name: "Samsung Galaxy S24",
    confidence: 0.95,
    description: "Latest Samsung Galaxy model"
  };

  const mockComparison = {
    productName: "Samsung Galaxy S24",
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
    <div className="min-h-screen" style={{ backgroundColor: '#012953' }}>
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

      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
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
          className="mb-6 mt-8"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
            
            {/* Success Ring Animation */}
            <motion.div
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute inset-0 border-4 border-green-400 rounded-full"
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
          className="bg-white rounded-3xl p-4 w-full max-w-sm shadow-2xl mb-6"
        >
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Transaction Details</h2>
            <p className="text-gray-600 text-xs">Transaction ID: {transactionId}</p>
          </div>

          <div className="space-y-3">
            {/* Product Details */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Smartphone className="h-6 w-6 text-blue-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{currentProduct.name}</p>
                <p className="text-gray-600 text-xs">₹50,000</p>
              </div>
            </div>

            {/* EMI Provider */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <CreditCard className="h-6 w-6 text-green-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{activeItem.provider}</p>
                <p className="text-gray-600 text-xs">{activeItem.apr}% APR</p>
              </div>
            </div>

            {/* EMI Amount */}
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
              <Calendar className="h-6 w-6 text-green-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Monthly EMI</p>
                <p className="text-green-600 text-base font-bold">
                  ₹{Math.round((50000 * (1 + activeItem.apr/100)) / 12).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <User className="h-6 w-6 text-purple-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Approved on</p>
                <p className="text-gray-600 text-xs">{currentDate}</p>
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

        {/* Action Button - Only Continue Shopping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full max-w-sm"
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
  );
} 