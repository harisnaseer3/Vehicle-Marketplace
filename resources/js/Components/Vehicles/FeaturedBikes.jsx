import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '@/axios.js';
import {
    FaMotorcycle,
    FaStar,
    FaHeart,
    FaEye,
    FaCheckCircle,
    FaShieldAlt,
    FaClock,
    FaMapMarkerAlt,
    FaTachometerAlt,
    FaCalendarAlt,
    FaGasPump,
    FaCog,
    FaPalette,
    FaCar,
    FaTruck,
    FaTools,
    FaBolt,
    FaRoad
} from 'react-icons/fa';

const FeaturedBikes = ({ isHomePage = false }) => {
    const [bikeGroups, setBikeGroups] = useState({
        new: [],
        used: [],
        'certified-pre-owned': [],
        salvage: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndices, setCurrentIndices] = useState({
        new: 0,
        used: 0,
        'certified-pre-owned': 0,
        salvage: 0
    });
    const [hoveredBike, setHoveredBike] = useState(null);

    useEffect(() => {
        const fetchFeaturedBikes = async () => {
            try {
                const response = await axios.get('/featured-bikes');

                if (response.data.success && response.data.data) {
                    setBikeGroups(response.data.data);
                } else {
                    throw new Error(response.data.message || 'Invalid data format received');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to load featured bikes');
                setLoading(false);
                console.error('API Error:', err.response?.data || err.message);
            }
        };

        fetchFeaturedBikes();
    }, []);

    const handlePrev = (condition) => {
        setCurrentIndices(prev => ({
            ...prev,
            [condition]: prev[condition] === 0 ?
                bikeGroups[condition].length - Math.min(4, bikeGroups[condition].length) :
                prev[condition] - 4
        }));
    };

    const handleNext = (condition) => {
        setCurrentIndices(prev => ({
            ...prev,
            [condition]: prev[condition] + 4 >= bikeGroups[condition].length ?
                0 :
                prev[condition] + 4
        }));
    };

    const getCategoryIcon = (categoryName) => {
        switch (categoryName?.toLowerCase()) {
            case 'bikes':
            case 'motorcycles':
                return FaMotorcycle;
            case 'scooters':
                return FaBolt;
            case 'sports bikes':
                return FaRoad;
            default:
                return FaMotorcycle;
        }
    };

    const getConditionColor = (condition) => {
        switch (condition) {
            case 'new':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'used':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'certified-pre-owned':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
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

    const getEngineSize = (bike) => {
        // Extract engine size from features or use a default
        if (bike.features) {
            const engineFeature = bike.features.find(f => f.toLowerCase().includes('cc') || f.toLowerCase().includes('engine'));
            if (engineFeature) {
                const match = engineFeature.match(/(\d+)\s*cc/i);
                if (match) return `${match[1]}cc`;
            }
        }
        return bike.engine_size || 'N/A';
    };

    if (loading) {
        return (
            <div className="mt-12 flex justify-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-red-600"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 animate-ping"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-12 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <div className="text-red-600 text-lg font-semibold mb-2">Oops! Something went wrong</div>
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const renderBikeGroup = (condition, title) => {
        const bikes = bikeGroups[condition] || [];
        const currentIndex = currentIndices[condition] || 0;

        const displayedBikes = isHomePage
            ? bikes.slice(currentIndex, currentIndex + 4)
            : bikes;

        if (displayedBikes.length === 0) return null;

        return (
            <div key={condition} className="mb-20">
                {/* Enhanced Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-4 shadow-lg">
                        <FaMotorcycle className="text-white text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-3">
                        {title}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-4 rounded-full"></div>
                    <p className="max-w-2xl text-lg text-gray-600 mx-auto leading-relaxed">
                        {condition === 'new' 
                            ? 'Discover our latest collection of brand new motorcycles with cutting-edge technology and performance' 
                            : 'Explore quality pre-owned motorcycles that have been thoroughly inspected and verified for your safety'
                        }
                    </p>
                </div>

                <div className="relative">
                    {/* Navigation Arrows */}
                    {isHomePage && bikes.length > 4 && (
                        <>
                            <button
                                onClick={() => handlePrev(condition)}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
                                aria-label={`Previous ${condition} bikes`}
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleNext(condition)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
                                aria-label={`Next ${condition} bikes`}
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Bike Grid */}
                    <div className={`grid gap-8 ${
                        isHomePage ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    }`}>
                        {displayedBikes.map((bike, index) => {
                            const CategoryIcon = getCategoryIcon(bike.category?.name);
                            return (
                                <div
                                    key={bike.id}
                                    className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative"
                                    onMouseEnter={() => setHoveredBike(bike.id)}
                                    onMouseLeave={() => setHoveredBike(null)}
                                >
                                    {/* Image Container */}
                                    <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                            {bike.sold?.status === 'sold' && (
                                                <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                                                    <FaCheckCircle className="w-3 h-3 mr-1" />
                                                    Sold
                                                </div>
                                            )}
                                            {bike.certified === 1 && (
                                                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                                                    <FaShieldAlt className="w-3 h-3 mr-1" />
                                                    Certified
                                                </div>
                                            )}
                                            {bike.is_featured && (
                                                <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                                                    <FaStar className="w-3 h-3 mr-1" />
                                                    Featured
                                                </div>
                                            )}
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <div className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow-lg flex items-center">
                                                <CategoryIcon className="w-3 h-3 mr-1" />
                                                {bike.category?.name}
                                            </div>
                                        </div>

                                        {/* Condition Badge */}
                                        <div className="absolute bottom-3 left-3 z-10">
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getConditionColor(bike.condition)}`}>
                                                {bike.condition === 'used' ? 'Used' : bike.condition}
                                            </span>
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
                                            hoveredBike === bike.id ? 'opacity-100' : 'opacity-0'
                                        }`}>
                                            <div className="flex space-x-4">
                                                <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition duration-300">
                                                    <FaHeart className="w-5 h-5" />
                                                </button>
                                                <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition duration-300">
                                                    <FaEye className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Main Image */}
                                        <img
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            src={bike.images?.length ?
                                                `/storage/${bike.images[0]}` :
                                                '/images/bike-placeholder.jpg'
                                            }
                                            alt={`${bike.make?.name || 'Bike'} ${bike.model?.name || ''}`}
                                            onError={(e) => {
                                                e.target.src = '/images/bike-placeholder.jpg';
                                            }}
                                        />
                                    </div>

                                    {/* Bike Details */}
                                    <div className="p-6">
                                        {/* Title and Rating */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                                                    {bike.make?.name} {bike.model?.name}
                                                </h3>
                                                <p className="text-gray-600 font-medium">{bike.year}</p>
                                            </div>
                                            <div className="flex items-center text-yellow-400">
                                                <FaStar className="w-4 h-4" />
                                                <span className="text-sm text-gray-600 ml-1">4.8</span>
                                            </div>
                                        </div>

                                        {/* Quick Specs */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaTachometerAlt className="w-4 h-4 mr-2 text-gray-400" />
                                                <span>{bike.mileage?.toLocaleString()} km</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaBolt className="w-4 h-4 mr-2 text-gray-400" />
                                                <span>{getEngineSize(bike)}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaGasPump className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="capitalize">{bike.fuel_type}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaPalette className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="capitalize">{bike.color}</span>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                            <span className="capitalize">{bike.location?.replace('-', ' ')}</span>
                                        </div>

                                        {/* Price and Action */}
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                            <div>
                                                <span className={`text-2xl font-bold ${
                                                    bike.sold?.status === 'sold' ? 'text-gray-500 line-through' : 'text-red-600'
                                                }`}>
                                                    {formatPrice(bike.price)}
                                                </span>
                                                {bike.sold?.status === 'sold' && (
                                                    <div className="text-red-600 text-sm font-medium">Sold Out</div>
                                                )}
                                            </div>
                                            {bike.sold?.status === 'sold' ? (
                                                <span className="text-gray-400 text-sm italic">Sold Out</span>
                                            ) : (
                                                <Link
                                                    to={`/bike/${bike.id}`}
                                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                                >
                                                    View Details
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Enhanced View All Button */}
                    <div className="mt-12 text-center">
                        <Link
                            to={`/bikes?condition=${condition}&category=bikes`}
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <span>View All {title}</span>
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    const hasBikes = Object.values(bikeGroups).some(group => group.length > 0);

    return (
        <>
            {hasBikes ? (
                <>
                    {renderBikeGroup('new', 'New Featured Motorcycles')}
                    {renderBikeGroup('used', 'Used Featured Motorcycles')}
                </>
            ) : (
                <div className="mt-16 text-center">
                    <div className="bg-gray-50 rounded-2xl p-12 max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaMotorcycle className="text-gray-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Featured Motorcycles</h3>
                        <p className="text-gray-600 text-sm mb-6">
                            We're currently updating our featured motorcycles. Check back soon for amazing deals!
                        </p>
                        <Link
                            to="/bikes"
                            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-300"
                        >
                            Browse All Motorcycles
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default FeaturedBikes;
