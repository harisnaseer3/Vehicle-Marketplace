import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaStar, FaMapMarkerAlt, FaPhone, FaCar, FaMotorcycle, FaCheckCircle } from 'react-icons/fa';
import axios from '@/axios.js';

const DealerShowrooms = ({ category = 'vehicles' }) => {
    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDealers = async () => {
            try {
                setLoading(true);
                const response = await axios.get('dealers/featured');
                setDealers(response.data.data || []);
            } catch (error) {
                console.error('Error fetching dealers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDealers();
    }, []);

    if (loading) {
        return null;
    }

    if (dealers.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <FaStore className="text-purple-600 mr-3 text-xl" />
                    <h3 className="text-xl font-semibold text-gray-900">Featured Dealers</h3>
                </div>
                <Link
                    to="/dealers"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                    View All Dealers
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dealers.slice(0, 4).map((dealer) => (
                    <div key={dealer.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-xl font-bold text-purple-600">{dealer.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-lg">{dealer.name}</h4>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaStar className="text-yellow-400 mr-1" />
                                        <span>{dealer.rating}</span>
                                        <span className="text-gray-500 ml-1">({dealer.reviews_count} reviews)</span>
                                        {dealer.is_verified && (
                                            <>
                                                <FaCheckCircle className="text-green-500 ml-2" />
                                                <span className="text-green-600 ml-1 text-xs">Verified</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {dealer.is_featured && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                                    Featured
                                </span>
                            )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {dealer.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                <span>{dealer.city}</span>
                            </div>
                            {dealer.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaPhone className="w-4 h-4 mr-2" />
                                    <span>{dealer.phone}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                                {category === 'bikes' ? (
                                    <FaMotorcycle className="w-4 h-4 mr-1" />
                                ) : (
                                    <FaCar className="w-4 h-4 mr-1" />
                                )}
                                <span>{dealer.posts?.length || 0} vehicles</span>
                            </div>
                            <Link
                                to={`/dealer/${dealer.id}`}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                View Showroom
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DealerShowrooms; 