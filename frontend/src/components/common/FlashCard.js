import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const FlashCard = ({ title, value, icon, gradient, suffix = '', prefix = '', delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const numVal = typeof value === 'number' ? value : parseFloat(value) || 0;
    if (numVal === 0) return;
    let start = 0;
    const duration = 1500;
    const step = duration / 60;
    const increment = numVal / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numVal) { setCount(numVal); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [visible, value]);

  const displayVal = typeof value === 'number'
    ? (value > 1000 ? (count / 1000).toFixed(1) + 'K' : count.toString())
    : value;

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay, duration: 0.5, type: 'spring', stiffness: 200 }}
      className="flash-card rounded-2xl p-5 text-white cursor-pointer relative overflow-hidden"
      style={{ background: gradient }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/30" />
        <div className="absolute -left-2 -bottom-4 w-16 h-16 rounded-full bg-white/20" />
      </div>
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">{icon}</div>
        </div>
        <p className="text-3xl font-bold font-display tracking-tight">
          {prefix}{visible ? displayVal : '0'}{suffix}
        </p>
      </div>
    </motion.div>
  );
};

export default FlashCard;