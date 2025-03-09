import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ProductFormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const mode = id ? 'edit' : 'add';
    const initialProduct = location.state?.product || null;
    
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialProduct?.name || '',
        description: initialProduct?.description || '',
        price: initialProduct?.price || '',
        originalPrice: initialProduct?.originalPrice || '',
        category: initialProduct?.category || '',
        subCategory: initialProduct?.subCategory || '',
        quantity: initialProduct?.quantity || 0,
        sizes: initialProduct?.sizes || [],
        tags: initialProduct?.tags || [],
        isBestSeller: initialProduct?.isBestSeller || false,
        image: initialProduct?.imageurl || null
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
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            
            // Try to get seller ID directly first
            let sellerId = localStorage.getItem('sellerId');
            
            // If not found, try to get it from sellerInfo
            if (!sellerId) {
                const sellerInfo = localStorage.getItem('sellerInfo');
                if (sellerInfo) {
                    const parsedSellerInfo = JSON.parse(sellerInfo);
                    sellerId = parsedSellerInfo._id;
                    // Store it separately for future use
                    localStorage.setItem('sellerId', sellerId);
                }
            }

            console.log('Seller ID being used:', sellerId);

            if (!sellerId) {
                throw new Error('Seller ID not found. Please login again.');
            }

            // Append seller ID
            formDataToSend.append('seller', sellerId);
            
            // Rest of your form data appending
            Object.keys(formData).forEach(key => {
                if (key === 'sizes' || key === 'tags') {
                    formDataToSend.append(key, JSON.stringify(formData[key]));
                } else if (key === 'image') {
                    if (formData[key] instanceof File) {
                        formDataToSend.append('image', formData[key]);
                    }
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const url = mode === 'add' 
                ? 'https://expressjs-zpto.onrender.com/api/products'
                : `https://expressjs-zpto.onrender.com/api/products/${id}`;

            const response = await fetch(url, {
                method: mode === 'add' ? 'POST' : 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('sellerToken')}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server Error Response:', errorData);
                throw new Error(errorData.message || 'Failed to save product');
            }

            const responseData = await response.json();
            console.log('Success Response:', responseData);

            toast.success(mode === 'add' ? 'Product added successfully!' : 'Product updated successfully!');
            navigate('/seller-dashboard');
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            toast.error(error.message || 'Failed to save product. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-500 via-emerald-500 to-teal-500 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white">
                        {mode === 'add' ? 'Add New Product' : 'Edit Product'}
                    </h1>
                    <button
                        onClick={() => navigate('/seller-dashboard')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Side - Image Upload */}
                        <div className="lg:w-1/3 p-8 bg-emerald-50 border-r border-emerald-100">
                            <div className="aspect-square rounded-lg border-2 border-dashed border-emerald-200 flex items-center justify-center overflow-hidden">
                                {formData.image ? (
                                    <img 
                                        src={formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center p-4">
                                        <PhotoIcon className="h-12 w-12 text-emerald-300 mx-auto mb-2" />
                                        <p className="text-sm text-emerald-600">Upload Product Image</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                name="image"
                                onChange={handleInputChange}
                                className="mt-4 w-full px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                accept="image/*"
                                required={mode === 'add'}
                            />
                        </div>

                        {/* Right Side - Form Fields */}
                        <div className="lg:w-2/3 p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Product Name */}
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
                                            className="md:w-full w-28 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>

                                    <div className='md:ml-0 ml-22'>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 md:ml-0 ml-6">Original Price</label>
                                        <input
                                            type="number"
                                            name="originalPrice"
                                            value={formData.originalPrice}
                                            onChange={handleInputChange}
                                            className="md:w-full w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 md:ml-0 ml-6"
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
                                            className="md:w-full w-28 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>

                                    <div className='md:ml-0 ml-28'>
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

                                    {/* Quantity */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            className="md:w-full w-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>

                                    {/* Sizes */}
                                    <div className='md:ml-0 ml-20'>
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

                                    {/* Tags */}
                                    <div className="col-span-2">
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

                                    {/* Form Actions */}
                                    <div className="col-span-2 flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/seller-dashboard')}
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
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFormPage; 