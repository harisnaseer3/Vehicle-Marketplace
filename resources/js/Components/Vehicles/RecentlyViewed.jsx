import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaHeart, FaStar, FaMapMarkerAlt, FaTachometerAlt, FaCalendarAlt, FaCar, FaMotorcycle } from 'react-icons/fa';
import axios from '@/axios.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const RecentlyViewed = ({ category = 'vehicles' }) => {
    const { user } = useAuth();
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const response = await axios.get('recently-viewed', {
                        params: { category, limit: 4 }
                    });
                    setRecentlyViewed(response.data.data || []);
                } catch (error) {
                    console.error('Error fetching recently viewed:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchRecentlyViewed();
    }, [user, category]);

    if (!user || loading) {
        return null;
    }

    if (recentlyViewed.length === 0) {
        return null;
    }

    const getCategoryIcon = (categoryName) => {
        switch (categoryName?.toLowerCase()) {
            case 'cars':
                return <FaCar className="w-3 h-3 mr-1" />;
            case 'bikes':
                return <FaMotorcycle className="w-3 h-3 mr-1" />;
            default:
                return <FaCar className="w-3 h-3 mr-1" />;
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        const numPrice = parseFloat(price);
        if (numPrice >= 1000000) {
            return `Rs. ${(numPrice / 1000000).toFixed(1)}M`;
        } else if (numPrice >= 1000) {
            return `Rs. ${(numPrice / 1000).toFixed(0)}K`;
        }
        return `Rs. ${numPrice.toLocaleString()}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <FaEye className="text-green-600 mr-3 text-xl" />
                    <h3 className="text-xl font-semibold text-gray-900">Recently Viewed</h3>
                </div>
                <Link
                    to={`/${category}/recently-viewed`}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                    View All History
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentlyViewed.map((item) => (
                    <div key={item.id} className="group bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                        <div className="relative mb-3">
                            <img
                                src={item.images?.length ? `/storage/${item.images[0]}` : '/images/vehicle-placeholder.jpg'}
                                alt={item.title}
                                className="w-full h-32 object-cover rounded-lg"
                                onError={(e) => {
                                    e.target.src = '/images/vehicle-placeholder.jpg';
                                }}
                            />
                            <div className="absolute top-2 right-2">
                                <div className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow-lg flex items-center">
                                    {getCategoryIcon(item.category?.name)}
                                    {item.category?.name}
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                {item.make?.name} {item.model?.name}
                            </h4>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-blue-600">
                                    {formatPrice(item.price)}
                                </span>
                                <div className="flex items-center text-yellow-400">
                                    <FaStar className="w-3 h-3" />
                                    <span className="text-xs text-gray-600 ml-1">4.8</span>
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <FaTachometerAlt className="w-3 h-3 mr-1" />
                                <span>{item.mileage?.toLocaleString()} km</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <FaCalendarAlt className="w-3 h-3 mr-1" />
                                <span>{item.year}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                                <span className="capitalize">{item.location?.replace('-', ' ')}</span>
                            </div>
                        </div>
                        
                        <Link
                            to={`/${category === 'bikes' ? 'bike' : 'vehicle'}/${item.id}`}
                            className="mt-3 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed; 