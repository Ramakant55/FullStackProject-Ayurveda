import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { TrashIcon, PencilIcon, UserCircleIcon, ArrowRightOnRectangleIcon, UsersIcon, PlusIcon } from '@heroicons/react/24/outline';

// Product form modal as a class component to prevent re-rendering issues
class StableProductFormModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                name: '',
                description: '',
                price: '',
                originalPrice: '',
                category: '',
                subCategory: '',
                quantity: 0,
                sizes: [],
                tags: [],
                isBestSeller: false,
                image: null
            },
            dataLoaded: false
        };
    }

    componentDidUpdate(prevProps) {
        // Only update form data when initialData changes and it hasn't been loaded yet
        if (this.props.isOpen && 
            this.props.initialData && 
            !this.state.dataLoaded) {
            this.setState({
                formData: {
                    name: this.props.initialData.name || '',
                    description: this.props.initialData.description || '',
                    price: this.props.initialData.price || '',
                    originalPrice: this.props.initialData.originalPrice || '',
                    category: this.props.initialData.category || '',
                    subCategory: this.props.initialData.subCategory || '',
                    quantity: this.props.initialData.quantity || 0,
                    sizes: this.props.initialData.sizes || [],
                    tags: this.props.initialData.tags || [],
                    isBestSeller: this.props.initialData.isBestSeller || false,
                    image: null
                },
                dataLoaded: true
            });
        }

        // Reset the state when modal closes
        if (prevProps.isOpen && !this.props.isOpen) {
            this.setState({ dataLoaded: false });
        }
    }

    handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file') {
            this.setState(prevState => ({
                formData: { 
                    ...prevState.formData, 
                    image: files[0] 
                }
            }));
        } else if (type === 'checkbox') {
            this.setState(prevState => ({
                formData: { 
                    ...prevState.formData, 
                    [name]: checked 
                }
            }));
        } else if (name === 'sizes' || name === 'tags') {
            this.setState(prevState => ({
                formData: { 
                    ...prevState.formData, 
                    [name]: value.split(',').map(item => item.trim()) 
                }
            }));
        } else {
            this.setState(prevState => ({
                formData: { 
                    ...prevState.formData, 
                    [name]: value 
                }
            }));
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        Object.keys(this.state.formData).forEach(key => {
            if (key === 'sizes' || key === 'tags') {
                formDataToSend.append(key, JSON.stringify(this.state.formData[key]));
            } else if (key === 'image' && this.state.formData[key]) {
                formDataToSend.append('image', this.state.formData[key]);
            } else {
                formDataToSend.append(key, this.state.formData[key]);
            }
        });
        
        this.props.onSubmit(formDataToSend);
    }

    render() {
        const { isOpen, onClose, mode, isLoading } = this.props;
        const { formData } = this.state;
        
        if (!isOpen) return null;
        
        return (
            <div className="fixed inset-0 z-[100] overflow-y-auto">
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                ></div>
                <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6 bg-emerald-50">
                            <h2 className="text-2xl font-bold text-emerald-800">
                                {mode === 'add' ? 'Add New Product' : 'Edit Product'}
                            </h2>
                        </div>

                        <form onSubmit={this.handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Basic Info */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={this.handleInputChange}
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
                                        onChange={this.handleInputChange}
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
                                        onChange={this.handleInputChange}
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
                                        onChange={this.handleInputChange}
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
                                        onChange={this.handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                {/* Inventory */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={this.handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        required
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={this.handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        accept="image/*"
                                    />
                                </div>

                                {/* Description */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={this.handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                        required
                                    ></textarea>
                                </div>

                                {/* Optional Fields */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
                                    <input
                                        type="text"
                                        name="sizes"
                                        value={formData.sizes.join(', ')}
                                        onChange={this.handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">e.g. S, M, L, XL</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags.join(', ')}
                                        onChange={this.handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">e.g. new, organic, premium</p>
                                </div>

                                <div className="col-span-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="isBestSeller"
                                            checked={formData.isBestSeller}
                                            onChange={this.handleInputChange}
                                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Mark as Best Seller</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        mode === 'add' ? 'Add Product' : 'Update Product'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

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
        setIsEditing(false);
        setEditingProduct(null);
        setNewProduct({
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
        setShowAddProduct(true);
    };

    const handleCreateProduct = async (formData) => {
        setIsLoading(true);
        try {
            // Try to get the token from local storage
            let token = localStorage.getItem('sellerToken');
            
            // If sellerToken isn't available, try to use the regular user token
            if (!token) {
                token = localStorage.getItem('token');
                console.log('Using user token instead of seller token');
            }
            
            if (!token) {
                toast.error('Authentication required. Please log in again.');
                navigate('/seller/login');
                return;
            }

            // Get seller information from local storage
            const sellerInfo = JSON.parse(localStorage.getItem('sellerInfo')) || {};
            const user = JSON.parse(localStorage.getItem('userProfile')) || {};
            const sellerId = sellerInfo._id || sellerInfo.userId || user._id;
            
            if (!sellerId) {
                toast.error('Seller information is missing. Please log in again as a seller.');
                navigate('/seller/login');
                return;
            }
            
            // Add seller ID to form data
            formData.append('seller', sellerId);
            
            // console.log('Using token (first 10 chars):', token.substring(0, 10));
            // console.log('Using seller ID:', sellerId);
            
            // Log the form data contents for debugging
            const formDataEntries = [];
            for (let pair of formData.entries()) {
                // Don't log the full image data
                if (pair[0] === 'image') {
                    formDataEntries.push([pair[0], 'Image file present']);
                } else {
                    formDataEntries.push(pair);
                }
            }
            // console.log('Form data being sent:', formDataEntries);
            
            // Try using the local server first (make sure it's running locally)
            const serverUrl = 'https://expressjs-zpto.onrender.com/api/products';
            console.log('Sending request to:', serverUrl);
            
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            console.log('Response status:', response.status);
            
            let responseData;
            try {
                responseData = await response.json();
                console.log('Response data:', responseData);
            } catch (e) {
                console.log('Failed to parse response as JSON:', e);
            }
            
            if (response.ok) {
                toast.success('Product added successfully');
                setShowAddProduct(false);
                setNewProduct({
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
                fetchProducts(); // Refresh product list
            } else {
                let errorMessage = 'Failed to add product';
                try {
                    errorMessage = responseData?.message || errorMessage;
                } catch (e) {
                    console.error('Error extracting error message:', e);
                }
                
                if (response.status === 401) {
                    toast.error('Your session has expired. Please log in again.');
                    localStorage.removeItem('sellerToken');
                    navigate('/seller/login');
                } else {
                    toast.error(errorMessage);
                }
            }
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice || '',
            category: product.category,
            subCategory: product.subCategory || '',
            quantity: product.quantity || 0,
            imageurl: product.imageurl,
            sizes: product.sizes || [],
            tags: product.tags || [],
            isBestSeller: product.isBestSeller || false,
            inStock: product.inStock || true
        });
        setIsEditing(true);
        setShowAddProduct(true);
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

    const handleUpdateProduct = async (formData) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('sellerToken');
            
            // Convert FormData to regular JSON data
            const jsonData = {};
            for (let [key, value] of formData.entries()) {
                // Try to parse JSON strings (like arrays)
                if (key === 'sizes' || key === 'tags') {
                    try {
                        jsonData[key] = JSON.parse(value);
                    } catch (e) {
                        jsonData[key] = value;
                    }
                } else {
                    jsonData[key] = value;
                }
            }
            
            // Skip the image if it's empty or not changed
            if (formData.get('image') instanceof File && formData.get('image').size > 0) {
                // If there's a new image, we'd need multipart/form-data handling
                // For now, we'll proceed without image updates
                console.log("Image updates are not supported in this edit");
            }
            
            const response = await fetch(`https://expressjs-zpto.onrender.com/api/products/${editingProduct._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            });
            
            if (response.ok) {
                toast.success('Product updated successfully');
                setIsEditing(false);
                setEditingProduct(null);
                setShowAddProduct(false);
                setNewProduct({
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map(product => (
                                        <div key={product._id} className="bg-white rounded-xl shadow-md shadow-black overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out">
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
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <StableProductFormModal
                isOpen={showAddProduct}
                onClose={() => {
                    setShowAddProduct(false);
                    // Allow animations to complete before resetting state
                    setTimeout(() => {
                        if (isEditing) {
                            setIsEditing(false);
                            setEditingProduct(null);
                        }
                    }, 300);
                }}
                mode={isEditing ? 'edit' : 'add'}
                initialData={isEditing ? newProduct : null}
                onSubmit={isEditing ? handleUpdateProduct : handleCreateProduct}
                isLoading={isLoading}
            />
        </div>
    );
};

export default SellerDashboard; 