import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://expressjs-zpto.onrender.com/api/home_Products');
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const handleAddToCart = (productId) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingProductIndex = existingCartItems.findIndex(item => item._id === productId);
    
    let updatedCartItems;
    if (existingProductIndex >= 0) {
        updatedCartItems = existingCartItems.map((item, index) => {
            if (index === existingProductIndex) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                };
            }
            return item;
        });
    } else {
        const productToAdd = {
            _id: product._id,
            name: product.name,
            price: product.price,
            quantity: 1,
            imageurl: product.imageurl,
        };
        updatedCartItems = [...existingCartItems, productToAdd];
    }

    // Update localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

    // Dispatch event
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const removeFromCart = (productId) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCartItems = cartItems.filter(item => item._id !== productId);
    
    // Update localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    
    // Dispatch both events to ensure update
    window.dispatchEvent(new Event('cartItemRemoved'));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Get unique categories
  const categories = [...new Set(products.map(product => product.category))];

  // Filter and search products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = priceFilter === 'all' ? true :
      priceFilter === 'under500' ? product.price < 500 :
      priceFilter === '500-1000' ? product.price >= 500 && product.price <= 1000 :
      product.price > 1000;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    return matchesSearch && matchesPrice && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-emerald-600 mb-8 text-center">Our Products</h2>
        
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              value={priceFilter} 
              onChange={(e) => setPriceFilter(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            >
              <option value="all">All Prices</option>
              <option value="under500">Under ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="over1000">Over ₹1000</option>
            </select>

            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid - Update to use filteredProducts instead of products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No products found matching your criteria
            </div>
          ) : (
            filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-lg shadow-sm shadow-black flex flex-col cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              >
                <div className="relative">
                  <img 
                    src={product.imageurl}
                    alt={product.name}
                    className="w-full h-56 object-cover rounded-lg mb-3"
                  />
                  {product.originalPrice > product.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                  {product.isBestSeller && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-sm">
                      Best Seller
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-600 mb-1 text-sm">{product.category}</p>
                <p className="text-gray-600 mb-3 text-sm">{product.description}</p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {product.originalPrice > product.price ? (
                        <>
                          <span className="text-emerald-600 font-bold text-xl">
                            ₹{product.price}
                          </span>
                          <span className="text-gray-400 line-through ml-2">
                            ₹{product.originalPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-emerald-600 font-bold text-xl">
                          ₹{product.price}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-500 text-sm">
                      {product.inStock ? `${product.quantity} in stock` : 'Out of Stock'}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product._id);
                    }}
                    disabled={!product.inStock}
                    className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2
                      ${product.inStock 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Products;