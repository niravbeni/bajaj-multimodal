'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, Star, TrendingUp, Clock, Shield } from 'lucide-react';
import { useFlowStore } from '../../../hooks/useFlowStore';

export default function RankingPage() {
  const router = useRouter();
  const { comparison, selectedProduct, setSelectedEMI } = useFlowStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);

  // Mock data for development when accessing directly
  const mockProduct = {
    name: "iPhone 15 Pro",
    confidence: 0.95,
    description: "Latest iPhone model"
  };

  const mockComparison = {
    productName: "iPhone 15 Pro",
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

  // Sort by APR (lowest is best) - Bajaj should be first
  const sorted = [...currentComparison.items].sort((a, b) => a.apr - b.apr);
  const activeItem = sorted[activeIndex];

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % sorted.length);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + sorted.length) % sorted.length);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const swipeThreshold = 50;
    
    if (info.offset.x > swipeThreshold) {
      prevCard();
    } else if (info.offset.x < -swipeThreshold) {
      nextCard();
    }
  };

  const getBorderColor = (index: number) => {
    if (index === 0) return 'border-yellow-500'; // Gold for #1
    if (index === 1) return 'border-gray-400'; // Silver for #2
    return 'border-amber-600'; // Bronze for #3
  };

  const getBadgeColor = (index: number) => {
    if (index === 0) return 'bg-yellow-500 text-white'; // Gold for #1
    if (index === 1) return 'bg-gray-400 text-white'; // Silver for #2
    return 'bg-amber-600 text-white'; // Bronze for #3
  };

  const getFeatures = (index: number) => {
    if (index === 0) {
      return [
        { icon: Star, text: 'Lowest Interest Rate', highlight: true },
        { icon: Shield, text: 'Zero Processing Fee', highlight: true },
        { icon: Clock, text: 'Instant Approval', highlight: true },
        { icon: TrendingUp, text: 'Best Overall Value', highlight: true }
      ];
    } else if (index === 1) {
      return [
        { icon: Star, text: 'Competitive Rate', highlight: false },
        { icon: Shield, text: '₹999 Processing Fee', highlight: false },
        { icon: Clock, text: '24 Hour Approval', highlight: false },
        { icon: TrendingUp, text: 'Good Value', highlight: false }
      ];
    } else {
      return [
        { icon: Star, text: 'Standard Rate', highlight: false },
        { icon: Shield, text: '₹1499 Processing Fee', highlight: false },
        { icon: Clock, text: '48 Hour Approval', highlight: false },
        { icon: TrendingUp, text: 'Fair Value', highlight: false }
      ];
    }
  };

  return (
    <div className="ios-safe-height flex flex-col safe-area-top safe-area-bottom overflow-hidden" style={{ backgroundColor: '#012953' }}>
      {/* Header */}
      <header className="p-4 flex items-center justify-center safe-area-top z-20 relative">
        <h1 className="text-xl font-semibold text-white">Choose Your EMI</h1>
      </header>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4 mb-4"
      >
                 <p className="text-blue-200 text-base">
           Top 3 providers for {currentProduct.name}
         </p>
        <p className="text-blue-300 text-sm mt-1">
          Swipe to explore options
        </p>
      </motion.div>

      {/* Carousel Container */}
      <div className="flex-1 relative overflow-hidden" ref={constraintsRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            className="absolute inset-4 cursor-grab active:cursor-grabbing"
            style={{ 
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'pan-y pinch-zoom'
            }}
                     >
             {/* Full Screen EMI Card */}
             <div className={`h-full bg-white rounded-3xl shadow-2xl relative overflow-hidden border-8 ${getBorderColor(activeIndex)}`}>
               {/* Corner Badge */}
               <div className="absolute top-6 right-6 z-10">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getBadgeColor(activeIndex)} shadow-lg`}>
                   {activeIndex === 0 ? (
                     <Crown className="h-6 w-6" />
                   ) : (
                     <span className="font-bold text-lg">{activeIndex + 1}</span>
                   )}
                 </div>
               </div>

               {/* Card Content */}
               <div className="h-full flex flex-col p-4 pb-6 text-center">
                 {/* EMI Provider Name at Top */}
                 <motion.div
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 }}
                   className="pt-2 pb-4"
                 >
                   <h2 className="text-2xl font-bold text-gray-900">
                     {activeItem.provider}
                   </h2>
                 </motion.div>

                 {/* Recommended Badge (only for #1) */}
                 {activeIndex === 0 && (
                   <motion.div
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: 0.2 }}
                     className="pb-3"
                   >
                     <div className="bg-yellow-100 text-yellow-800 text-xs px-4 py-2 rounded-full border-2 border-yellow-300 font-semibold inline-block">
                       🏆&nbsp;&nbsp;RECOMMENDED
                     </div>
                   </motion.div>
                 )}

                 {/* Interest Rate - Main Feature */}
                 <motion.div
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ delay: 0.3 }}
                   className={activeIndex === 0 ? "pb-4" : "pb-6"}
                 >
                   <div className={`font-bold text-gray-900 mb-2 ${activeIndex === 0 ? "text-4xl" : "text-5xl"}`}>
                     {activeItem.apr}%
                   </div>
                   <p className="text-gray-600 text-base font-medium">Annual Interest Rate</p>
                 </motion.div>

                 {/* Features Grid */}
                 <motion.div
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.4 }}
                   className={`grid grid-cols-2 gap-3 flex-1 ${activeIndex === 0 ? "pb-4" : "pb-6"}`}
                 >
                   {getFeatures(activeIndex).map((feature, idx) => (
                     <div
                       key={idx}
                       className={`rounded-xl border-2 ${activeIndex === 0 ? "p-2" : "p-3"} ${
                         feature.highlight 
                           ? `bg-gray-50 ${getBorderColor(activeIndex).replace('border-', 'border-')}` 
                           : 'bg-gray-50 border-gray-200'
                       }`}
                     >
                       <feature.icon className={`mx-auto ${activeIndex === 0 ? "h-5 w-5 mb-1" : "h-6 w-6 mb-2"} ${
                         feature.highlight ? 'text-gray-700' : 'text-gray-500'
                       }`} />
                       <p className={`text-xs font-medium text-center ${
                         feature.highlight ? 'text-gray-800' : 'text-gray-600'
                       }`}>
                         {feature.text}
                       </p>
                     </div>
                   ))}
                 </motion.div>

                 {/* EMI Amount - Fixed at Bottom */}
                 <motion.div
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.5 }}
                   className={`rounded-2xl p-4 mt-auto ${
                     activeIndex === 0 
                       ? "bg-yellow-50 border-2 border-yellow-500" 
                       : "bg-gray-100 border-2 border-gray-300"
                   }`}
                 >
                   <p className="text-gray-600 text-sm mb-1 font-medium">Monthly EMI</p>
                   <p className="text-2xl font-bold text-gray-900">
                     ₹{Math.round((50000 * (1 + activeItem.apr/100)) / 12).toLocaleString()}
                   </p>
                   <p className="text-gray-500 text-xs">for 12 months</p>
                 </motion.div>
               </div>
             </div>
          </motion.div>
        </AnimatePresence>

               </div>

       {/* Carousel Dots - Moved below cards */}
       <div className="flex justify-center gap-3 py-4">
         {sorted.map((_, index) => (
           <button
             key={index}
             onClick={() => setActiveIndex(index)}
             className={`transition-all duration-300 rounded-full ${
               index === activeIndex 
                 ? 'w-8 h-3 bg-white' 
                 : 'w-3 h-3 bg-white/40 hover:bg-white/60'
             }`}
           />
         ))}
       </div>

      {/* Fixed Bottom CTA */}
      <div className="p-4 pb-8 safe-area-bottom">
        <motion.div
          key={`cta-${activeIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
                     <Button 
             size="lg" 
             className="w-full h-14 text-lg font-semibold rounded-2xl cursor-pointer hover:cursor-pointer transition-all bg-white text-blue-900 hover:bg-gray-100 border-2 border-gray-300"
             onClick={() => {
               setSelectedEMI(activeItem);
               router.push('/verification');
             }}
           >
             Go with {activeItem.provider}
           </Button>
        </motion.div>
      </div>
    </div>
  );
} 