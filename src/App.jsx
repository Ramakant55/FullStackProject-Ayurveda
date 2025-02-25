import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import VerifyOtp from './components/VerifyOtp';
import Home from './components/Home';
import Products from './components/Products';
import Contact from './components/Contact';
import Profile from './components/Profile';
import Footer from './components/Footer';
import Scrolltop from './components/Scrolltop';
import Cart from './components/Cart';
import SellerLogin from './pages/SellerLogin';
import SellerRegister from './pages/SellerRegister';
import SellerDashboard from './pages/SellerDashboard';
import SellerVerifyOTP from './pages/SellerVerifyOTP';
import Checkout from './components/Checkout';
import ProductFormPage from './pages/ProductFormPage';
import { Toaster } from 'react-hot-toast';
import AboutUs from './components/AboutUs';
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <Router>
      <Scrolltop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } />
            <Route path="/seller/login" element={<SellerLogin />} />
            <Route path="/seller/register" element={<SellerRegister />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/verify-otp" element={<SellerVerifyOTP />} />
            <Route path="/add-product" element={<ProductFormPage mode="add" />} />
            <Route path="/edit-product/:id" element={<ProductFormPage mode="edit" />} />
            <Route path="/about" element={<AboutUs />} />
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;