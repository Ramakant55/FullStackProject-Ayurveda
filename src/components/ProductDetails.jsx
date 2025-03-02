import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext'; // Assuming you have auth context
import StarRating from './StarRating'; // Adjust the path as needed
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
  const [reviewError, setReviewError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [id]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://expressjs-zpto.onrender.com/api/home_Products');
      const data = await response.json();
      setProducts(data.products);
      const currentProduct = data.products.find(p => p._id === id);
      setProduct(currentProduct);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load products');
      setLoading(false);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch(`https://expressjs-zpto.onrender.com/api/reviews/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      console.log('Fetched reviews:', data);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleAddToCart = (productId) => {
    const productToAdd = products.find(p => p._id === productId);
    if (!productToAdd) return;

    const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingProductIndex = existingCartItems.findIndex(item => item._id === productId);
    
    let updatedCartItems;
    if (existingProductIndex >= 0) {
      updatedCartItems = existingCartItems.map((item, index) => {
        if (index === existingProductIndex) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    } else {
      updatedCartItems = [...existingCartItems, {
        _id: productToAdd._id,
        name: productToAdd.name,
        price: productToAdd.price,
        quantity: 1,
        imageurl: productToAdd.imageurl,
      }];
    }

    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    
    if (!token || !userProfile) {
        toast.error('Please login to add a review');
        navigate('/login');
        return;
    }

    if (userRating === 0) {
        toast.error('Please select a rating');
        return;
    }

    setIsSubmitting(true);
    try {
        const reviewData = {
            productId: id,        // Changed back to productId
            userId: userProfile.id,  // Changed back to userId
            rating: parseInt(userRating),
            comment: userReview
        };

        console.log('Sending review data:', reviewData); // Debug log

        const response = await fetch(`https://expressjs-zpto.onrender.com/api/reviews/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reviewData)
        });

        const data = await response.json();
        console.log('Server response:', data); // Debug log

        if (!response.ok) {
            throw new Error(data.message || 'Failed to add review');
        }

        toast.success('Review added successfully!');
        setUserRating(0);
        setUserReview('');
        fetchReviews(); // Refresh reviews

    } catch (error) {
        console.error('Error adding review:', error);
        if (error.message.includes('token')) {
            localStorage.removeItem('token');
            localStorage.removeItem('userProfile');
            toast.error('Session expired. Please login again.');
            navigate('/login');
        } else {
            toast.error(error.message || 'Failed to add review');
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  const ReviewForm = () => (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Add Your Review</h3>
        <form onSubmit={handleReviewSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                </label>
                <StarRating 
                    rating={userRating} 
                    setRating={setUserRating}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                </label>
                <textarea
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows="4"
                    placeholder="Write your review here..."
                    required
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
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
  );

  const ratingsAndReviewsSection = (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>
      
      {/* Overall Rating Summary */}
      <div className="flex items-center mb-8">
        <div className="text-center mr-8">
          <div className="text-5xl font-bold text-emerald-600">{averageRating}</div>
          <StarRating rating={Number(averageRating)} size="w-6 h-6" />
          <div className="text-sm text-gray-500 mt-1">{reviews.length} reviews</div>
        </div>
      </div>

      {/* Write a Review Section */}
      <ReviewForm />

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="font-semibold">{review.userId.name}</div>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );

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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <img
                src={product.imageurl}
                alt={product.name}
                className="w-full h-auto rounded-lg"
              />
            </div>
            
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-emerald-600">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="text-green-500">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </span>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Product Details</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-600">Category: {product.category}</p>
                  <p className="text-gray-600">
                    Stock: {product.inStock ? (
                      <span className="text-green-600">{product.quantity} units available</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(product._id)}
                  disabled={!product.inStock}
                  className={`w-full px-6 py-4 rounded-lg text-lg transition-colors
                    ${product.inStock 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {ratingsAndReviewsSection}

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
                        handleAddToCart(similarProduct._id);
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