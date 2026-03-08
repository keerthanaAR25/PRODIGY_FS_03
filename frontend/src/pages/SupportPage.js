import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiMail, FiPhone, FiChevronDown, FiSend } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FAQS = [
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3-7 business days. Express delivery (same-day or next-day) is available for select locations.' },
  { q: 'What is the return policy?', a: 'We offer a 7-day hassle-free return policy for all products. Items must be unused and in original packaging.' },
  { q: 'How can I track my order?', a: 'Go to "My Orders" in your profile and click on any order to view real-time tracking information.' },
  { q: 'Are my payment details safe?', a: 'Yes! We use 256-bit SSL encryption. We never store your card details on our servers.' },
  { q: 'Can I change or cancel my order?', a: 'You can cancel or modify your order within 1 hour of placing it. After that, please contact our support team.' },
  { q: 'Do you offer cash on delivery?', a: 'Yes! Cash on Delivery is available for orders up to ₹10,000 in most pin codes across India.' }
];

const SupportPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState([{ from: 'bot', text: 'Hi! 👋 How can I help you today?' }]);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/support', { ...form, ...(user && { user: user._id }) });
      toast.success('Ticket submitted! We\'ll respond within 24 hours. 📧');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch { toast.error('Failed to send. Try again.'); }
    finally { setSending(false); }
  };

  const sendChatMsg = () => {
    if (!chatMsg.trim()) return;
    const responses = [
      'Thanks for reaching out! Our team will get back to you shortly.',
      'I understand your concern. Let me connect you with a specialist.',
      'Great question! You can find more info in our FAQ section above.',
      'Please allow 24-48 hours for a detailed response.'
    ];
    setChatHistory(h => [...h, { from: 'user', text: chatMsg }, { from: 'bot', text: responses[Math.floor(Math.random() * responses.length)] }]);
    setChatMsg('');
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="text-center py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-4">🤝</div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3">How can we help?</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Our support team is here 24/7 to assist with any questions or issues.</p>
        </motion.div>
      </div>

      {/* Contact Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-16">
        {[
          { icon: '📧', title: 'Email Support', desc: 'support@localmart.com', sub: 'Response within 24 hours' },
          { icon: '📞', title: 'Phone Support', desc: '+91 98765 43210', sub: 'Mon-Sat 9AM-6PM IST' },
          { icon: '💬', title: 'Live Chat', desc: 'Chat with us', sub: 'Average wait: 2 minutes' }
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl text-center hover:-translate-y-1 transition-transform cursor-pointer" onClick={i === 2 ? () => setChatOpen(true) : undefined}>
            <div className="text-4xl mb-3">{c.icon}</div>
            <h3 className="font-bold text-gray-800 mb-1">{c.title}</h3>
            <p className="text-sky-500 font-medium text-sm">{c.desc}</p>
            <p className="text-gray-400 text-xs mt-1">{c.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Send us a Message</h2>
          <div className="glass-card p-6 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {[['name', 'Full Name', 'Your name'], ['email', 'Email', 'your@email.com']].map(([k, l, p]) => (
                  <div key={k}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{l} *</label>
                    <input type={k === 'email' ? 'email' : 'text'} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={p} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} placeholder="Describe your issue..." required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50">
                <FiSend size={16} /> {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-semibold text-gray-800 text-sm pr-4">{faq.q}</span>
                  <FiChevronDown className={`text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <p className="px-5 pb-5 text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">💬</div>
                <div><p className="font-semibold text-sm">Support Chat</p><p className="text-xs text-white/70">Online</p></div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white text-lg">×</button>
            </div>
            <div className="h-48 overflow-y-auto p-3 space-y-2 bg-gray-50">
              {chatHistory.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs ${m.from === 'user' ? 'bg-sky-500 text-white' : 'bg-white text-gray-700 shadow-sm'}`}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="p-3 flex gap-2 border-t">
              <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChatMsg()} placeholder="Type a message..." className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-400" />
              <button onClick={sendChatMsg} className="w-9 h-9 bg-sky-500 text-white rounded-xl flex items-center justify-center hover:bg-sky-600 transition-colors"><FiSend size={14} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-2xl shadow-xl flex items-center justify-center hover:shadow-2xl transition-all hover:-translate-y-1 z-50">
          <FiMessageSquare size={22} />
        </button>
      )}
    </div>
  );
};

export default SupportPage;