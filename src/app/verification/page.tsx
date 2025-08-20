'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Shield, CreditCard } from 'lucide-react';
import { useFlowStore } from '../../../hooks/useFlowStore';
import Image from 'next/image';

export default function VerificationPage() {
  const router = useRouter();
  const { comparison, selectedProduct, selectedEMI } = useFlowStore();
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpComplete, setIsOtpComplete] = useState(false);

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
    // Set pre-filled Aadhaar (masked)
    setAadhaarNumber('xxxx xxxx xxxx 1234');
  }, []);

  useEffect(() => {
    // Check if OTP is complete
    const isComplete = otp.every(digit => digit !== '') && otp.length === 6;
    setIsOtpComplete(isComplete);
  }, [otp]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyNow = () => {
    router.push('/face-verification');
  };

  return (
    <div className="ios-safe-height flex flex-col safe-area-top safe-area-bottom overflow-hidden" style={{ backgroundColor: '#012953' }}>
      {/* Header */}
      <header className="p-4 flex items-center safe-area-top z-20 relative">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="w-12 h-12 cursor-pointer hover:cursor-pointer text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </header>

      {/* Product Name */}
      <div className="text-center mb-4 px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white"
        >
          {currentProduct.name}
        </motion.h2>
      </div>

      {/* Phone Mockup Area - Overlapped by Card */}
      <div className="relative w-full h-96 -mt-4">
        {/* S24 Phone Image - Extended View */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute inset-0 flex justify-center items-start pt-4"
        >
          <div className="relative w-48 h-80">
            <Image
              src="/S24.png"
              alt="Samsung Galaxy S24"
              fill
              className="object-contain object-top"
              priority
              style={{
                objectPosition: 'center top'
              }}
            />
          </div>
        </motion.div>

        {/* Cost Chip - Left, Staggered Higher */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/2 -translate-x-32 bg-yellow-500/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-yellow-400/40 z-20"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-yellow-900" />
            <div className="text-xs text-yellow-900">
              <p className="font-medium">Cost</p>
              <p className="font-bold">₹50,000</p>
            </div>
          </div>
        </motion.div>

        {/* EMI Rate Chip - Right, Staggered Lower */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute right-1/2 top-1/3 transform translate-x-1/2 -translate-y-1/2 translate-x-32 bg-yellow-500/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-yellow-400/40 z-20"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-yellow-900" />
            <div className="text-xs text-yellow-900">
              <p className="font-medium">EMI Rate</p>
              <p className="font-bold">{activeItem.apr}%</p>
            </div>
          </div>
        </motion.div>

        {/* eKYC Verification Card - Anchored to Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", damping: 20 }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] shadow-2xl z-30"
          style={{ height: '60vh' }}
        >
                    <div className="bg-white h-full w-full pt-8 px-6 pb-6 flex flex-col rounded-t-[2rem]">
            <div className="text-center mb-6">
              <Shield className="h-10 w-10 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">eKYC Verification</h3>
              <p className="text-gray-600 text-sm">Secure verification for your EMI application</p>
            </div>

            {/* Aadhaar Card Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aadhaar Card Number (16 digits)
              </label>
              <Input
                type="text"
                value={aadhaarNumber}
                readOnly
                className="w-full text-center text-base tracking-wider bg-white border-gray-300"
                placeholder="xxxx xxxx xxxx xxxx"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                ✓ Verified from your documents
              </p>
            </div>

            {/* OTP Section */}
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter Your OTP
              </label>
              <div className="flex justify-center gap-2 mb-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold border-2 focus:border-blue-500 bg-white"
                    style={{ fontSize: '16px' }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mb-4">
                OTP sent to your registered mobile number
              </p>

              {/* Spacer to push button to bottom */}
              <div className="flex-1"></div>

              {/* Verify Button */}
              <div className="pb-4">
                <Button
                  onClick={handleVerifyNow}
                  disabled={!isOtpComplete}
                  className={`w-full h-12 text-lg font-semibold rounded-2xl transition-all ${
                    isOtpComplete
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isOtpComplete ? 'Verify Now' : 'Enter OTP to Continue'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 