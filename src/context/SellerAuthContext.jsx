import React, { createContext, useContext, useState, useEffect } from 'react';

const SellerAuthContext = createContext();

export const useSellerAuth = () => {
  return useContext(SellerAuthContext);
};

export const SellerAuthProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for seller data and token on initial load
    const sellerInfo = localStorage.getItem('sellerInfo');
    const sellerToken = localStorage.getItem('sellerToken');
    
    if (sellerInfo && sellerToken) {
      try {
        setSeller(JSON.parse(sellerInfo));
      } catch (error) {
        console.error('Failed to parse seller data:', error);
        // If there's an error parsing seller data, clear it
        localStorage.removeItem('sellerInfo');
        localStorage.removeItem('sellerToken');
        localStorage.removeItem('sellerId');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, sellerData) => {
    // Format seller data consistently
    const formattedSellerData = {
      _id: sellerData._id,
      name: sellerData.storeName || sellerData.name,
      email: sellerData.email,
      storeName: sellerData.storeName,
      // Any other fields needed
    };
    
    setSeller(formattedSellerData);
    
    // Store both seller data and token in localStorage
    localStorage.setItem('sellerInfo', JSON.stringify(formattedSellerData));
    localStorage.setItem('sellerToken', token);
    localStorage.setItem('sellerId', formattedSellerData._id);
  };

  const logout = () => {
    setSeller(null);
    // Clear seller data and token from localStorage
    localStorage.removeItem('sellerInfo');
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerId');
  };

  const value = {
    seller,
    login,
    logout,
    loading,
    getToken: () => localStorage.getItem('sellerToken')
  };

  return (
    <SellerAuthContext.Provider value={value}>
      {!loading && children}
    </SellerAuthContext.Provider>
  );
};

export { SellerAuthContext };
