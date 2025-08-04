import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaStar, FaMapMarkerAlt, FaPhone, FaCar, FaMotorcycle, FaCheckCircle, FaSearch } from 'react-icons/fa';
import axios from '@/axios.js';

const AllDealers = () => {
    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFeatured, setFilterFeatured] = useState(false);

    useEffect(() => {
        const fetchDealers = async () => {
            try {
                setLoading(true);
                const params = {};
                if (searchTerm) params.search = searchTerm;
                if (filterFeatured) params.featured = true;
                
                const response = await axios.get('dealers', { params });
                setDealers(response.data.data || []);
            } catch (error) {
                console.error('Error fetching dealers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDealers();
    }, [searchTerm, filterFeatured]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Featured Dealers</h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Connect with trusted and verified vehicle dealers across Pakistan.
                            Find the perfect dealer for your next vehicle purchase.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search dealers by name or location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filterFeatured}
                                    onChange={(e) => setFilterFeatured(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Featured Only</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Dealers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dealers.map((dealer) => (
                        <div key={dealer.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                            <span className="text-2xl font-bold text-blue-600">
                                                {dealer.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{dealer.name}</h3>
                                            {dealer.is_verified && (
                                                <div className="flex items-center mt-1">
                                                    <FaCheckCircle className="text-green-500 w-4 h-4" />
                                                    <span className="text-green-600 text-sm ml-1">Verified Dealer</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {dealer.is_featured && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center mb-3">
                                    <FaStar className="text-yellow-400 w-4 h-4" />
                                    <span className="text-sm text-gray-600 ml-1">{dealer.rating}</span>
                                    <span className="text-sm text-gray-500 ml-1">({dealer.reviews_count} reviews)</span>
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

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaCar className="w-4 h-4 mr-1" />
                                        <span>{dealer.posts?.length || 0} vehicles</span>
                                    </div>
                                    <Link
                                        to={`/dealer/${dealer.id}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                    >
                                        View Showroom
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {dealers.length === 0 && (
                    <div className="text-center py-12">
                        <FaStore className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No dealers found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllDealers; 