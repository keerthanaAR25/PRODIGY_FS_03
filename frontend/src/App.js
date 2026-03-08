import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AnimatedBackground from './components/common/AnimatedBackground';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import { OrdersPage, OrderDetailPage } from './pages/OrdersPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import WishlistPage from './pages/WishlistPage';
import SupportPage from './pages/SupportPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AnimatedBackground />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#1e293b',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '14px',
                padding: '12px 16px'
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
            }}
          />
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              <Route path="/"            element={<HomePage />} />
              <Route path="/products"    element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart"        element={<CartPage />} />
              <Route path="/login"       element={<LoginPage />} />
              <Route path="/register"    element={<RegisterPage />} />
              <Route path="/support"     element={<SupportPage />} />

              <Route path="/checkout"    element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/orders"      element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/orders/:id"  element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
              <Route path="/wishlist"    element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
              <Route path="/profile"     element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/admin"       element={<AdminRoute><AdminDashboard /></AdminRoute>} />

              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center text-center px-4">
                  <div>
                    <div className="text-8xl mb-4">🔍</div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
                    <p className="text-gray-400 mb-6">Page not found</p>
                    <a href="/" className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors">Go Home</a>
                  </div>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;