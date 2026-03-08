import React, { useState } from 'react';
import { motion } from 'framer-motion';

const steps = [
  { icon: '🛍️', step: '01', title: 'Browse Products', desc: 'Explore thousands of products across all categories with smart filters and search.' },
  { icon: '🛒', step: '02', title: 'Add to Cart', desc: 'Add your favorites to cart. Items saved automatically for your convenience.' },
  { icon: '💳', step: '03', title: 'Secure Checkout', desc: 'Multiple payment options: UPI, Card, Net Banking or Cash on Delivery.' },
  { icon: '📦', step: '04', title: 'Track Orders', desc: 'Real-time order tracking from dispatch to delivery at your doorstep.' }
];

const StepCards = () => {
  const [active, setActive] = useState(0);

  return (
    <div className="w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2">How It Works</h2>
        <p className="text-gray-500">Your shopping journey in 4 simple steps</p>
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5, type: 'spring', stiffness: 150 }}
            onClick={() => setActive(i)}
            className={`step-card rounded-2xl p-5 text-center border-2 transition-all select-none ${active === i ? 'border-sky-400 bg-gradient-to-br from-sky-50 to-blue-50 shadow-xl shadow-sky-100' : 'border-white bg-white/70 hover:border-sky-200 shadow-md'}`}>
            <div className={`text-4xl mb-3 transition-transform duration-300 ${active === i ? 'scale-125' : ''}`}>{s.icon}</div>
            <div className={`text-xs font-bold mb-1 ${active === i ? 'text-sky-500' : 'text-gray-400'}`}>STEP {s.step}</div>
            <h3 className="font-bold text-gray-800 text-sm mb-2">{s.title}</h3>
            <motion.p initial={false} animate={{ height: active === i ? 'auto' : 0, opacity: active === i ? 1 : 0 }}
              className="text-xs text-gray-500 leading-relaxed overflow-hidden">{s.desc}</motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StepCards;