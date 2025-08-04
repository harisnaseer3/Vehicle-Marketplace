import {Link, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from '@/axios.js';
import {
    FaCar,
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
    FaMotorcycle,
    FaTruck,
    FaTools
} from 'react-icons/fa';

const FeaturedVehicles = ({isHomePage = false}) => {
    const navigate = useNavigate();
    const [vehicleGroups, setVehicleGroups] = useState({
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
    const [hoveredVehicle, setHoveredVehicle] = useState(null);

    useEffect(() => {
        const fetchFeaturedVehicles = async () => {
            try {
                const response = await axios.get('/featured-vehicles');

                if (response.data.success && response.data.data) {
                    setVehicleGroups(response.data.data);
                } else {
                    throw new Error(response.data.message || 'Invalid data format received');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to load featured vehicles');
                setLoading(false);
                console.error('API Error:', err.response?.data || err.message);
            }
        };

        fetchFeaturedVehicles();
    }, []);

    const handlePrev = (condition) => {
        setCurrentIndices(prev => ({
            ...prev,
            [condition]: prev[condition] === 0 ?
                vehicleGroups[condition].length - Math.min(4, vehicleGroups[condition].length) :
                prev[condition] - 4
        }));
    };

    const handleNext = (condition) => {
        setCurrentIndices(prev => ({
            ...prev,
            [condition]: prev[condition] + 4 >= vehicleGroups[condition].length ?
                0 :
                prev[condition] + 4
        }));
    };

    const getCategoryIcon = (categoryName) => {
        switch (categoryName?.toLowerCase()) {
            case 'bikes':
            case 'motorcycles':
                return FaMotorcycle;
            case 'trucks':
            case 'commercial':
                return FaTruck;
            case 'auto parts':
                return FaTools;
            default:
                return FaCar;
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

    if (loading) {
        return (
            <div className="mt-12 flex justify-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-ping"></div>
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

    const renderVehicleGroup = (condition, title) => {
        const vehicles = vehicleGroups[condition] || [];
        const currentIndex = currentIndices[condition] || 0;

        const displayedVehicles = isHomePage
            ? vehicles.slice(currentIndex, currentIndex + 4)
            : vehicles;

        if (displayedVehicles.length === 0) return null;

        return (
            <div key={condition} className="mb-20">
                {/* Enhanced Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
                        <FaCar className="text-white text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-3">
                        {title}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4 rounded-full"></div>
                    <p className="max-w-2xl text-lg text-gray-600 mx-auto leading-relaxed">
                        {condition === 'new' 
                            ? 'Discover our latest collection of brand new vehicles with premium features and warranties' 
                            : 'Explore quality pre-owned vehicles that have been thoroughly inspected and verified'
                        }
                    </p>
                </div>

                <div className="relative">
                    {/* Navigation Arrows */}
                    {isHomePage && vehicles.length > 4 && (
                        <>
                            <button
                                onClick={() => handlePrev(condition)}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
                                aria-label={`Previous ${condition} vehicles`}
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => handleNext(condition)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
                                aria-label={`Next ${condition} vehicles`}
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Vehicle Grid */}
                    <div className={`grid gap-8 ${
                        isHomePage ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    }`}>
                        {displayedVehicles.map((vehicle, index) => {
                            const CategoryIcon = getCategoryIcon(vehicle.category?.name);
                            return (
                                <div
                                    key={vehicle.id}
                                    className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative"
                                    onMouseEnter={() => setHoveredVehicle(vehicle.id)}
                                    onMouseLeave={() => setHoveredVehicle(null)}
                                >
                                    {/* Image Container */}
                                    <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                            {vehicle.sold?.status === 'sold' && (
                                                <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                                                    <FaCheckCircle className="w-3 h-3 mr-1" />
                                                    Sold
                                                </div>
                                            )}
                                            {vehicle.certified === 1 && (
                                                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                                                    <FaShieldAlt className="w-3 h-3 mr-1" />
                                                    Certified
                                                </div>
                                            )}
                                            {vehicle.is_featured && (
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
                                                {vehicle.category?.name}
                                            </div>
                                        </div>

                                        {/* Condition Badge */}
                                        <div className="absolute bottom-3 left-3 z-10">
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getConditionColor(vehicle.condition)}`}>
                                                {vehicle.condition === 'used' ? 'Used' : vehicle.condition}
                                            </span>
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
                                            hoveredVehicle === vehicle.id ? 'opacity-100' : 'opacity-0'
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
                                            src={
                                                vehicle.images?.length
                                                    ? `/storage/${vehicle.images[0]}`
                                                    : '/images/vehicle-placeholder.jpg'
                                            }
                                            alt={`${vehicle.make?.name || 'Car'} ${vehicle.model?.name || ''}`}
                                            onError={(e) => {
                                                e.target.src = '/images/vehicle-placeholder.jpg';
                                            }}
                                        />
                                    </div>

                                    {/* Vehicle Details */}
                                    <div className="p-6">
                                        {/* Title and Rating */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                                    {vehicle.make?.name} {vehicle.model?.name}
                                                </h3>
                                                <p className="text-gray-600 font-medium">{vehicle.year}</p>
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
                                                <span>{vehicle.mileage?.toLocaleString()} km</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaGasPump className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="capitalize">{vehicle.fuel_type}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaCog className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="capitalize">{vehicle.transmission_type}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaPalette className="w-4 h-4 mr-2 text-gray-400" />
                                                <span className="capitalize">{vehicle.color}</span>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                            <span className="capitalize">{vehicle.location?.replace('-', ' ')}</span>
                                        </div>

                                        {/* Price and Action */}
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                            <div>
                                                <span className={`text-2xl font-bold ${
                                                    vehicle.sold?.status === 'sold' ? 'text-gray-500 line-through' : 'text-blue-600'
                                                }`}>
                                                    {formatPrice(vehicle.price)}
                                                </span>
                                                {vehicle.sold?.status === 'sold' && (
                                                    <div className="text-red-600 text-sm font-medium">Sold Out</div>
                                                )}
                                            </div>
                                            {vehicle.sold?.status === 'sold' ? (
                                                <span className="text-gray-400 text-sm italic">Sold Out</span>
                                            ) : (
                                                <Link
                                                    to={`/vehicle/${vehicle.id}`}
                                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
                            to={`/vehicles?condition=${condition}`}
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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

    const hasVehicles = Object.values(vehicleGroups).some(group => group.length > 0);

    return (
        <>
            {hasVehicles ? (
                <>
                    {renderVehicleGroup('new', 'New Featured Vehicles')}
                    {renderVehicleGroup('used', 'Used Featured Vehicles')}
                </>
            ) : (
                <div className="mt-16 text-center">
                    <div className="bg-gray-50 rounded-2xl p-12 max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCar className="text-gray-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Featured Vehicles</h3>
                        <p className="text-gray-600 text-sm mb-6">
                            We're currently updating our featured vehicles. Check back soon for amazing deals!
                        </p>
                        <Link
                            to="/vehicles"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
                        >
                            Browse All Vehicles
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default FeaturedVehicles;
