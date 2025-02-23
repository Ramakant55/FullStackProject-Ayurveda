import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { TrashIcon, PencilIcon, UserCircleIcon, ArrowRightOnRectangleIcon, UsersIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { AnimatePresence, motion } from 'framer-motion';

const SellerDashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        subCategory: '',
        imageurl: '',
        quantity: '',
        seller: '',
        sizes: [],
        tags: [],
        isBestSeller: false,
        inStock: true
    });
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [sellers, setSellers] = useState([]);
    const [showSellersList, setShowSellersList] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const sellerInfo = JSON.parse(localStorage.getItem('sellerInfo')) || {};

    useEffect(() => {
        const token = localStorage.getItem('sellerToken');
        if (!token) {
            navigate('/seller/login');
        }
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('sellerToken');
            const response = await fetch('https://expressjs-zpto.onrender.com/api/home_Products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log('Fetched products:', data);
            if (response.ok) {
                setProducts(data.products || data);
            } else {
                toast.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error loading products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddProduct = () => {
        navigate('/add-product');
    };

    const handleEditProduct = (product) => {
        navigate(`/edit-product/${product._id}`, { state: { product } });
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = localStorage.getItem('sellerToken');
                const response = await fetch(`https://expressjs-zpto.onrender.com/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    toast.success('Product deleted successfully');
                    fetchProducts();
                } else {
                    toast.error('Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Error deleting product');
            }
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            image: product.image,
        });
        setIsEditing(true);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('sellerToken');
            const response = await fetch(`https://expressjs-zpto.onrender.com/api/products/${editingProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
            
            if (response.ok) {
                toast.success('Product updated successfully');
                setIsEditing(false);
                setEditingProduct(null);
                setNewProduct({
                    name: '',
                    description: '',
                    price: '',
                    category: '',
                    stock: '',
                    image: '',
                });
                fetchProducts(); // Refresh product list
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Error updating product');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingProduct(null);
        setNewProduct({
            name: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            imageurl: '',
        });
    };

    const swiperStyles = {
        padding: '20px 10px 40px',
    };

    const navigationStyles = {
        '--swiper-navigation-color': '#059669',
        '--swiper-pagination-color': '#059669',
    };

    const handleLogout = () => {
        localStorage.removeItem('sellerToken');
        localStorage.removeItem('sellerInfo');
        toast.success('Logged out successfully');
        navigate('/seller/login');
    };

    const fetchSellers = async () => {
        try {
            const token = localStorage.getItem('sellerToken');
            const response = await fetch('https://expressjs-zpto.onrender.com/api/allseller', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setSellers(data.sellers || []);
            } else {
                toast.error('Failed to fetch sellers');
            }
        } catch (error) {
            console.error('Error fetching sellers:', error);
            toast.error('Error loading sellers');
        }
    };

    useEffect(() => {
        if (sellerInfo?.name) {
            fetchSellers();
        }
    }, [sellerInfo]);

    const ProductFormModal = ({ isOpen, onClose, mode, initialData, onSubmit, isLoading }) => {
        const [formData, setFormData] = useState({
            name: initialData?.name || '',
            description: initialData?.description || '',
            price: initialData?.price || '',
            originalPrice: initialData?.originalPrice || '',
            category: initialData?.category || '',
            subCategory: initialData?.subCategory || '',
            quantity: initialData?.quantity || 0,
            sizes: initialData?.sizes || [],
            tags: initialData?.tags || [],
            isBestSeller: initialData?.isBestSeller || false,
            image: null
        });

        const handleInputChange = (e) => {
            const { name, value, type, checked, files } = e.target;
            if (type === 'file') {
                setFormData(prev => ({ ...prev, image: files[0] }));
            } else if (type === 'checkbox') {
                setFormData(prev => ({ ...prev, [name]: checked }));
            } else if (name === 'sizes' || name === 'tags') {
                setFormData(prev => ({ ...prev, [name]: value.split(',').map(item => item.trim()) }));
            } else {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const formDataToSend = new FormData();
            
            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (key === 'sizes' || key === 'tags') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else if (key === 'image' && formData[key]) {
                    formDataToSend.append('image', formData[key]);
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            onSubmit(formDataToSend);
        };

        return (
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={onClose}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl"
                        >
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-6 bg-emerald-50">
                                    <h2 className="text-2xl font-bold text-emerald-800">
                                        {mode === 'add' ? 'Add New Product' : 'Edit Product'}
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Basic Info */}
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                required
                                            />
                                        </div>

                                        {/* Prices */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                                            <input
                                                type="number"
                                                name="originalPrice"
                                                value={formData.originalPrice}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                required
                                            />
                                        </div>

                                        {/* Categories */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <input
                                                type="text"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                                            <input
                                                type="text"
                                                name="subCategory"
                                                value={formData.subCategory}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                required
                                            />
                                        </div>

                                        {/* Quantity and Image */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                                            <input
                                                type="file"
                                                name="image"
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                accept="image/*"
                                                required={mode === 'add'}
                                            />
                                        </div>

                                        {/* Sizes and Tags */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma-separated)</label>
                                            <input
                                                type="text"
                                                name="sizes"
                                                value={formData.sizes.join(', ')}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                placeholder="S, M, L, XL"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                                            <input
                                                type="text"
                                                name="tags"
                                                value={formData.tags.join(', ')}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                placeholder="casual, summer, trendy"
                                            />
                                        </div>

                                        {/* Best Seller Checkbox */}
                                        <div className="col-span-2">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    name="isBestSeller"
                                                    checked={formData.isBestSeller}
                                                    onChange={handleInputChange}
                                                    className="rounded text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Mark as Best Seller</span>
                                            </label>
                                        </div>

                                        {/* Description */}
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows="4"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex justify-end space-x-3 pt-4 border-t">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : mode === 'add' ? 'Add Product' : 'Update Product'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
            {/* Main Navigation */}
            <nav className="bg-white shadow-md border-b border-emerald-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-emerald-600">Seller Dashboard</h1>
                        </div>
                        
                        {/* Profile Section */}
                        <div className="flex items-center">
                            {sellerInfo?.name ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center space-x-3 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-all duration-300"
                                    >
                                        <UserCircleIcon className="h-8 w-8" />
                                        <span>{sellerInfo.name}</span>
                                    </button>
                                    
                                    {/* Enhanced Dropdown Menu */}
                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl py-2 border border-emerald-100 z-50">
                                            {/* Profile Summary */}
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-xs text-gray-500">Logged in as</p>
                                                <p className="text-sm font-medium text-gray-800">{sellerInfo.email}</p>
                                            </div>

                                            {/* Add Product Button */}
                                            <button
                                                onClick={handleAddProduct}
                                                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                            >
                                                <PlusIcon className="h-5 w-5 text-emerald-600" />
                                                <span>Add New Product</span>
                                            </button>

                                            {/* Sellers List Button */}
                                            <button
                                                onClick={() => setShowSellersList(!showSellersList)}
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 w-full transition-colors duration-150"
                                            >
                                                <UsersIcon className="h-5 w-5 mr-3 text-emerald-600" />
                                                <span>View All Sellers</span>
                                            </button>
                                            
                                            {/* Sellers List Dropdown */}
                                            {showSellersList && (
                                                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                        Registered Sellers
                                                    </h3>
                                                    <div className="max-h-48 overflow-y-auto">
                                                        {sellers.map((seller, index) => (
                                                            <div
                                                                key={seller._id || index}
                                                                className="flex items-center py-2 text-sm text-gray-700"
                                                            >
                                                                <UserCircleIcon className="h-5 w-5 mr-2 text-emerald-500" />
                                                                <div>
                                                                    <p className="font-medium">{seller.name}</p>
                                                                    <p className="text-xs text-gray-500">{seller.storename}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Logout Button */}
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full border-t border-gray-100 transition-colors duration-150"
                                            >
                                                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/seller/login"
                                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/seller/register"
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Seller Dashboard</h1>
                
                {/* Products List with Slider */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            Your Product Collection
                        </h2>
                        <p className="text-emerald-100 mt-2">Swipe to explore your products</p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : (
                        <div className="p-6">
                            {products.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
                                </div>
                            ) : (
                                <div style={navigationStyles}>
                                    <Swiper
                                        style={swiperStyles}
                                        modules={[Navigation, Pagination, Autoplay]}
                                        spaceBetween={20}
                                        slidesPerView={3}
                                        navigation
                                        pagination={{ clickable: true }}
                                        autoplay={{
                                            delay: 3000,
                                            disableOnInteraction: false,
                                        }}
                                        breakpoints={{
                                            640: {
                                                slidesPerView: 1,
                                            },
                                            768: {
                                                slidesPerView: 2,
                                            },
                                            1024: {
                                                slidesPerView: 3,
                                            },
                                        }}
                                    >
                                        {products.map(product => (
                                            <SwiperSlide key={product._id}>
                                                <div className="bg-white rounded-xl shadow-md shadow-black overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out h-full">
                                                    <div className="relative h-48">
                                                        <img
                                                            className="w-full h-full object-cover"
                                                            src={product.imageurl}
                                                            alt={product.name}
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/150';
                                                            }}
                                                        />
                                                        <div className="absolute top-2 right-2 flex space-x-2">
                                                            <button
                                                                onClick={() => handleDeleteProduct(product._id)}
                                                                className="p-1 bg-white rounded-full text-red-600 hover:text-red-800 transition-colors duration-200"
                                                            >
                                                                <TrashIcon className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditProduct(product)}
                                                                className="p-1 bg-white rounded-full text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="p-6">
                                                        <div className="uppercase tracking-wide text-sm text-emerald-500 font-semibold">
                                                            {product.category}
                                                        </div>
                                                        <h3 className="mt-2 text-xl font-semibold text-gray-900">
                                                            {product.name}
                                                        </h3>
                                                        <p className="mt-3 text-gray-500 line-clamp-2">
                                                            {product.description}
                                                        </p>
                                                        <div className="mt-4 flex justify-between items-center">
                                                            <div className="flex items-center">
                                                                <span className="text-2xl font-bold text-emerald-600">₹{product.price}</span>
                                                                <span className="ml-2 text-sm text-gray-500">per unit</span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-sm text-gray-600">Stock Level</span>
                                                                <span className="text-sm font-medium text-emerald-600">{product.quantity} units</span>
                                                            </div>
                                                            <div className="relative w-full h-2 bg-gray-200 rounded">
                                                                <div 
                                                                    className="absolute h-2 bg-emerald-500 rounded"
                                                                    style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard; 