import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import { toast } from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product and similar products
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://expressjs-zpto.onrender.com/api/home_Products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      if (data.products) {
        setProducts(data.products);
        const currentProduct = data.products.find(p => p._id === id);
        setProduct(currentProduct);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to load products:', err);
      toast.error('Failed to load product details');
      setLoading(false);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch(`https://expressjs-zpto.onrender.com/api/products/${id}/reviews`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // If no reviews found, just set empty array
          setReviews([]);
          return;
        }
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Don't show error toast for 404
      if (!error.message.includes('404')) {
        toast.error('Failed to load reviews');
      }
      setReviews([]);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProducts();
      fetchReviews();
    }
  }, [id]);

  const handleAddToCart = async (product) => {
    try {
        // Get existing cart items from localStorage
        let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        // Check if product already exists in cart
        const existingItemIndex = cartItems.findIndex(item => item._id === product._id);
        
        if (existingItemIndex !== -1) {
            // If product exists, increase quantity
            cartItems[existingItemIndex].quantity += 1;
            toast.success('Item quantity updated in cart');
        } else {
            // If product doesn't exist, add new item
            cartItems.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                imageurl: product.imageurl,
                quantity: 1
            });
            toast.success('Added to cart');
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Trigger cart update event
        window.dispatchEvent(new Event('storage'));

    } catch (error) {
        console.error('Add to cart error:', error);
        toast.error('Error adding to cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to add a review');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add a review');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    if (userRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!userReview.trim()) {
      toast.error('Please add a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`https://expressjs-zpto.onrender.com/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: parseInt(userRating),
          comment: userReview.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          toast.error('Session expired. Please login again.');
          navigate('/login', { state: { from: `/product/${id}` } });
          return;
        }
        throw new Error(errorData.message || 'Failed to add review');
      }

      const data = await response.json();
      toast.success('Review added successfully!');
      setUserRating(0);
      setUserReview('');
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error(error.message || 'Failed to add review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!user) {
      toast.error('Please login to mark review as helpful');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to mark review as helpful');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    try {
      const response = await fetch(
        `https://expressjs-zpto.onrender.com/api/products/${id}/reviews/${reviewId}/helpful`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          toast.error('Session expired. Please login again.');
          navigate('/login', { state: { from: `/product/${id}` } });
          return;
        }
        throw new Error(errorData.message || 'Failed to mark review as helpful');
      }

      const data = await response.json();
      toast.success('Review marked as helpful');
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      toast.error(error.message || 'Failed to mark review as helpful');
    }
  };

  const handleBuyNow = () => {
    const token = localStorage.getItem('token');
    const userProfile = localStorage.getItem('userProfile');

    if (!token || !userProfile) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    try {
      const userData = JSON.parse(userProfile);
      
      // Create order object with product details
      const orderDetails = {
        productId: product._id,
        sellerId: product.seller,
        userId: userData._id,
        quantity: 1,
        price: product.price,
        name: product.name,
        imageurl: product.imageurl
      };

      // Store order details in localStorage
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

      // Navigate to checkout
      navigate('/checkout', { 
        state: { 
          orderDetails,
          from: `/product/${id}`
        }
      });
    } catch (error) {
      console.error('Error processing buy now:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const ReviewForm = () => (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Add Your Review</h3>
      <form onSubmit={handleReviewSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <StarRating 
            rating={userRating} 
            setRating={setUserRating}
            size="w-6 h-6"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows="4"
            placeholder="Write your review here..."
            required
            minLength="10"
            maxLength="500"
          />
          <p className="text-sm text-gray-500 mt-1">
            {userReview.length}/500 characters
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || userRating === 0 || !userReview.trim()}
          className={`w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors
            ${(isSubmitting || userRating === 0 || !userReview.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );

  const ReviewsList = () => (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="font-semibold">{review.name || 'Anonymous'}</div>
                  <StarRating rating={review.rating} size="w-4 h-4" />
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
            <p className="text-gray-700 mt-2">{review.comment}</p>
            <div className="mt-3 flex items-center">
              <button
                onClick={() => handleHelpful(review._id)}
                className="text-sm text-gray-500 hover:text-emerald-600 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                Helpful ({review.helpful?.count || 0})
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const similarProducts = products.filter(p => 
    p.category === product.category && p._id !== product._id
  ).slice(0, 4);

  const addToLocalCart = (product) => {
    try {
      // Get existing cart
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Check if product already exists
      const existingProduct = existingCart.find(item => item._id === product._id);
      
      if (existingProduct) {
        // If product exists, increase quantity
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
        localStorage.setItem('cart', JSON.stringify(existingCart));
      } else {
        // If product doesn't exist, add new product
        const newCart = [...existingCart, { ...product, quantity: 1 }];
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const SimilarProducts = ({ category, currentProductId }) => {
    const [similarProducts, setSimilarProducts] = useState([]);
    const navigate = useNavigate();

    const handleSimilarProductAddToCart = async (product) => {
      try {
        const success = addToLocalCart(product);
        
        if (success) {
          toast.success('Item added to cart successfully');
          // Optional: Trigger cart update if you're maintaining cart state
          // updateCartCount();
        } else {
          toast.error('Failed to add item to cart');
        }
      } catch (error) {
        toast.error('Error adding item to cart');
      }
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {similarProducts.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg">
            <img 
              src={product.imageurl} 
              alt={product.name} 
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="mt-2 font-semibold">{product.name}</h3>
            <p className="text-emerald-600 font-bold">₹{product.price}</p>
            <button
              onClick={() => handleSimilarProductAddToCart(product)}
              className="mt-2 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>

        {/* Main Product Details */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <img
                src={product.imageurl}
                alt={product.name}
                className="w-full h-[400px] object-contain rounded-lg"
              />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-emerald-600">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="text-green-500">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Product Details</h3>
                  <p className="text-gray-600 text-sm">{product.description}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-600 text-sm">Category: {product.category}</p>
                  <p className="text-gray-600 text-sm">
                    Stock: {product.inStock ? (
                      <span className="text-green-600">{product.quantity} units available</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={`flex-1 px-4 py-3 rounded-lg text-base transition-colors
                      ${product.inStock 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className={`flex-1 px-4 py-3 rounded-lg text-base transition-colors
                      ${product.inStock 
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>
          
          {/* Overall Rating Summary */}
          <div className="flex items-center mb-8">
            <div className="text-center mr-8">
              <div className="text-5xl font-bold text-emerald-600">
                {reviews && reviews.length > 0 
                  ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <StarRating 
                rating={
                  reviews && reviews.length > 0
                    ? Number((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1))
                    : 0
                } 
                readonly
              />
              <div className="text-sm text-gray-500 mt-1">
                {reviews ? reviews.length : 0} reviews
              </div>
            </div>
          </div>

          {/* Review Form */}
          <ReviewForm />

          {/* Reviews List */}
          <ReviewsList />
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <div
                  key={similarProduct._id}
                  className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/product/${similarProduct._id}`)}
                >
                  <img
                    src={similarProduct.imageurl}
                    alt={similarProduct.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h4 className="font-semibold mb-2">{similarProduct.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600 font-bold">₹{similarProduct.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(similarProduct);
                      }}
                      disabled={!similarProduct.inStock}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetails;