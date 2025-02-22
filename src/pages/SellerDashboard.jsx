import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('sellerToken');
            const sellerInfo = JSON.parse(localStorage.getItem('sellerInfo'));
            
            // Prepare the product data
            const productData = {
                ...newProduct,
                seller: sellerInfo?.name || 'Unknown Seller', // Get seller name from stored info
                price: Number(newProduct.price),
                originalPrice: Number(newProduct.originalPrice),
                quantity: Number(newProduct.quantity),
                sizes: newProduct.sizes.length ? newProduct.sizes : ['Standard'],
                tags: newProduct.tags.length ? newProduct.tags : [newProduct.category]
            };

            const response = await fetch('https://expressjs-zpto.onrender.com/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Product added successfully');
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
                fetchProducts();
            } else {
                toast.error(data.message || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Error adding product');
        } finally {
            setIsLoading(false);
        }
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

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Seller Dashboard</h1>
                
                {/* Form Section - Conditionally render Add/Edit form */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <form onSubmit={isEditing ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputChange}
                                placeholder="Product Name"
                                className="border rounded-lg px-3 py-2"
                                required
                            />
                            <input
                                type="number"
                                name="price"
                                value={newProduct.price}
                                onChange={handleInputChange}
                                placeholder="Price"
                                className="border rounded-lg px-3 py-2"
                                required
                            />
                            <input
                                type="number"
                                name="originalPrice"
                                value={newProduct.originalPrice}
                                onChange={handleInputChange}
                                placeholder="Original Price"
                                className="border rounded-lg px-3 py-2"
                                required
                            />
                            <input
                                type="text"
                                name="category"
                                value={newProduct.category}
                                onChange={handleInputChange}
                                placeholder="Category"
                                className="border rounded-lg px-3 py-2"
                                required
                            />
                            <input
                                type="text"
                                name="subCategory"
                                value={newProduct.subCategory}
                                onChange={handleInputChange}
                                placeholder="Sub Category"
                                className="border rounded-lg px-3 py-2"
                                required
                            />
                            <input
                                type="number"
                                name="quantity"
                                value={newProduct.quantity}
                                onChange={handleInputChange}
                                placeholder="Quantity"
                                className="border rounded-lg px-3 py-2"
                                required
                            />
                            <input
                                type="text"
                                name="imageurl"
                                value={newProduct.imageurl}
                                onChange={handleInputChange}
                                placeholder="Image URL"
                                className="border rounded-lg px-3 py-2"
                                required
                            />
                            <input
                                type="text"
                                name="sizes"
                                value={newProduct.sizes.join(',')}
                                onChange={(e) => setNewProduct({
                                    ...newProduct,
                                    sizes: e.target.value.split(',').map(size => size.trim())
                                })}
                                placeholder="Sizes (comma separated)"
                                className="border rounded-lg px-3 py-2"
                            />
                            <input
                                type="text"
                                name="tags"
                                value={newProduct.tags.join(',')}
                                onChange={(e) => setNewProduct({
                                    ...newProduct,
                                    tags: e.target.value.split(',').map(tag => tag.trim())
                                })}
                                placeholder="Tags (comma separated)"
                                className="border rounded-lg px-3 py-2"
                            />
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="isBestSeller"
                                    checked={newProduct.isBestSeller}
                                    onChange={(e) => setNewProduct({
                                        ...newProduct,
                                        isBestSeller: e.target.checked
                                    })}
                                    className="rounded"
                                />
                                <label>Best Seller</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="inStock"
                                    checked={newProduct.inStock}
                                    onChange={(e) => setNewProduct({
                                        ...newProduct,
                                        inStock: e.target.checked
                                    })}
                                    className="rounded"
                                />
                                <label>In Stock</label>
                            </div>
                            <textarea
                                name="description"
                                value={newProduct.description}
                                onChange={handleInputChange}
                                placeholder="Description"
                                className="border rounded-lg px-3 py-2 col-span-2"
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex-1"
                            >
                                {isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Product' : 'Add Product')}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

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
                                                                onClick={() => handleEditClick(product)}
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