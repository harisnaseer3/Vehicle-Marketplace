import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaPhone, FaCar, FaMotorcycle } from 'react-icons/fa';
import axios from '@/axios.js';

const DealerShowroom = () => {
    const { id } = useParams();
    const [dealer, setDealer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDealer = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`dealers/${id}`);
                setDealer(response.data.data);
            } catch (error) {
                console.error('Error fetching dealer:', error);
                setError('Failed to load dealer information');
            } finally {
                setLoading(false);
            }
        };

        fetchDealer();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !dealer) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">{error || 'Dealer not found'}</h2>
                    <Link
                        to="/dealers"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Dealers
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/dealers"
                                className="flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <FaArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dealers
                            </Link>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center mr-6">
                            <span className="text-3xl font-bold text-blue-600">
                                {dealer.name.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mr-4">{dealer.name}</h1>
                            {dealer.is_verified && (
                                <div className="flex items-center mt-2">
                                    <FaStar className="text-green-500 w-4 h-4" />
                                    <span className="text-green-600 text-sm ml-1">Verified Dealer</span>
                                </div>
                            )}
                            {dealer.is_featured && (
                                <div className="flex items-center mt-1">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                                        Featured Dealer
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="flex items-center">
                                <FaStar className="text-yellow-400 w-5 h-5" />
                                <span className="font-medium ml-1">{dealer.rating}</span>
                                <span className="text-gray-600 ml-1">({dealer.reviews_count} reviews)</span>
                            </div>
                            <div className="flex items-center mt-1 text-gray-600">
                                <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                                <span>{dealer.city}</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-gray-600 max-w-2xl">{dealer.description}</p>

                    <div className="mt-6 flex space-x-4">
                        {dealer.phone && (
                            <a
                                href={`tel:${dealer.phone}`}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                <FaPhone className="w-4 h-4 mr-2" />
                                Call Dealer
                            </a>
                        )}
                        {dealer.email && (
                            <a
                                href={`mailto:${dealer.email}`}
                                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                                <FaCar className="w-4 h-4 mr-2" />
                                Email Dealer
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content (Dealer Information, Available Vehicles) */}
                    <div className="lg:col-span-2">
                        {/* Dealer Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Dealer Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                                    <div className="space-y-2">
                                        {dealer.phone && (
                                            <div className="flex items-center text-gray-600">
                                                <FaPhone className="w-4 h-4 mr-2" />
                                                <span>{dealer.phone}</span>
                                            </div>
                                        )}
                                        {dealer.email && (
                                            <div className="flex items-center text-gray-600">
                                                <FaCar className="w-4 h-4 mr-2" />
                                                <span>{dealer.email}</span>
                                            </div>
                                        )}
                                        {dealer.website && (
                                            <div className="flex items-center text-gray-600">
                                                <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                                <a href={dealer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                    {dealer.website}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-gray-600">
                                            <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                            <span>{dealer.address}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                            <span>{dealer.city}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Available Vehicles */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Vehicles</h2>
                            {dealer.posts && dealer.posts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {dealer.posts.map((vehicle) => (
                                        <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                                            <img
                                                src={vehicle.images?.length ? `/storage/${vehicle.images[0]}` : '/images/vehicle-placeholder.jpg'}
                                                alt={vehicle.title}
                                                className="w-full h-32 object-cover rounded-lg mb-3"
                                            />
                                            <h3 className="font-semibold text-gray-900 mb-2">{vehicle.title}</h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-blue-600">
                                                    Rs. {vehicle.price?.toLocaleString()}
                                                </span>
                                                <Link
                                                    to={`/vehicle/${vehicle.id}`}
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">This dealer currently has no vehicles listed.</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar (Quick Stats) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Total Vehicles</span>
                                    <span className="font-semibold">{dealer.stats?.total_vehicles || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Featured Vehicles</span>
                                    <span className="font-semibold">{dealer.stats?.featured_vehicles || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Certified Vehicles</span>
                                    <span className="font-semibold">{dealer.stats?.certified_vehicles || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Average Rating</span>
                                    <span className="font-semibold">{dealer.stats?.average_rating || 0}/5</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Reviews</span>
                                    <span className="font-semibold">{dealer.stats?.total_reviews || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealerShowroom; 