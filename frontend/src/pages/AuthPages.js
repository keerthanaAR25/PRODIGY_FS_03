import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// ===== LOGIN PAGE =====
export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      navigate(user?.role === 'admin' ? '/admin' : redirect);
    } catch {}
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
        className="w-full max-w-md">
        <div className="glass-card p-8 rounded-3xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4">L</div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Welcome Back!</h1>
            <p className="text-gray-400 mt-1">Sign in to your LocalMart account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-gray-400" size={16} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-400" size={16} />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-700">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            <p>Admin: admin@localmart.com / Admin@123</p>
            <p>Customer: customer@localmart.com / Customer@123</p>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            Don't have an account? <Link to="/register" className="text-sky-500 font-semibold hover:text-sky-600">Sign Up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// ===== REGISTER PAGE =====
export const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { alert('Passwords do not match'); return; }
    try { await register(form.name, form.email, form.password); navigate('/'); } catch {}
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
        className="w-full max-w-md">
        <div className="glass-card p-8 rounded-3xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4">L</div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-400 mt-1">Join LocalMart and start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[['name', 'Full Name', 'John Doe', FiUser], ['email', 'Email', 'you@example.com', FiMail]].map(([k, l, p, Icon]) => (
              <div key={k}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-3.5 text-gray-400" size={16} />
                  <input type={k === 'email' ? 'email' : 'text'} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required placeholder={p}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm" />
                </div>
              </div>
            ))}
            {[['password', 'Password'], ['confirm', 'Confirm Password']].map(([k, l]) => (
              <div key={k}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{l}</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-3.5 text-gray-400" size={16} />
                  <input type={showPass ? 'text' : 'password'} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required placeholder="••••••••" minLength={6}
                    className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm" />
                  {k === 'confirm' && <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3.5 text-gray-400">{showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}</button>}
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account? <Link to="/login" className="text-sky-500 font-semibold hover:text-sky-600">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};