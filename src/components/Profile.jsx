import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, CameraIcon } from '@heroicons/react/24/outline';
import { toast, Toaster } from 'react-hot-toast';

const Profile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: null
    });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (savedProfile) {
            setProfile(savedProfile);
            setPreviewImage(savedProfile.avatar);
        }
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setProfile(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('userProfile', JSON.stringify(profile));
        toast.success('Profile updated successfully!');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8"
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500">
                                {previewImage ? (
                                    <img 
                                        src={previewImage} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-emerald-200 flex items-center justify-center">
                                        <UserIcon className="h-16 w-16 text-emerald-600" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-emerald-600 p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors">
                                <CameraIcon className="h-5 w-5 text-white" />
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                        Save Changes
                    </motion.button>
                </form>
            </motion.div>
            <Toaster position="top-right" />
        </div>
    );
};

export default Profile;