import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '@/axios.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import {
    FaCar,
    FaTachometerAlt,
    FaPalette,
    FaCog,
    FaGasPump,
    FaCalendarAlt,
    FaUser,
    FaPhone,
    FaMapMarkerAlt,
    FaMotorcycle,
    FaHeart,
    FaShare,
    FaEye,
    FaStar,
    FaCheckCircle,
    FaExclamationTriangle,
    FaCalculator,
    FaFileAlt,
    FaShieldAlt,
    FaClock,
    FaEnvelope,
    FaWhatsapp,
    FaFacebook,
    FaTwitter,
    FaCopy,
    FaPrint,
    FaDownload,
    FaBookmark,
    FaFlag,
    FaHistory,
    FaTools,
    FaOilCan,
    FaCarBattery,
    // FaTire,
    FaKey
} from 'react-icons/fa';

const VehicleDetails = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [similarVehicles, setSimilarVehicles] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showFinancing, setShowFinancing] = useState(false);
    const [financingData, setFinancingData] = useState({
        downPayment: 20,
        term: 60,
        interestRate: 8.5
    });
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            try {
                const response = await axios.get(`/vehicles/${id}`);

                if (response.data.success && response.data.data) {
                    setVehicle(response.data.data);
                    // Fetch similar vehicles
                    fetchSimilarVehicles(response.data.data);
                } else {
                    throw new Error(response.data.message || 'Vehicle not found');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to load vehicle details');
                setLoading(false);
                console.error('API Error:', err.response?.data || err.message);
            }
        };

        fetchVehicleDetails();
    }, [id]);

    const fetchSimilarVehicles = async (currentVehicle) => {
        try {
            const response = await axios.get('/vehicles', {
                params: {
                    make_id: currentVehicle.make_id,
                    category_id: currentVehicle.category_id,
                    per_page: 4,
                    exclude: currentVehicle.id
                }
            });
            if (response.data.success) {
                setSimilarVehicles(response.data.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching similar vehicles:', error);
        }
    };

    const calculateMonthlyPayment = () => {
        const principal = vehicle.price * (1 - financingData.downPayment / 100);
        const monthlyRate = financingData.interestRate / 100 / 12;
        const numberOfPayments = financingData.term;
        
        if (monthlyRate === 0) return principal / numberOfPayments;
        
        const monthlyPayment = principal * 
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        return monthlyPayment;
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const title = `${vehicle.make?.name} ${vehicle.model?.name} ${vehicle.year}`;
        const text = `Check out this ${vehicle.year} ${vehicle.make?.name} ${vehicle.model?.name} for sale!`;

        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
                break;
            default:
                break;
        }
        setShowShareMenu(false);
    };

    const toggleFavorite = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/vehicle/${vehicle.id}` } });
            return;
        }

        try {
            const response = await axios.post('favorites/toggle', { post_id: vehicle.id });
            const { is_favorited } = response.data.data;
            setIsFavorite(is_favorited);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    // Record view and fetch favorite status
    useEffect(() => {
        const recordViewAndFetchFavorite = async () => {
            if (vehicle && user) {
                try {
                    // Record view
                    await axios.post('recently-viewed/add', { post_id: vehicle.id });
                    
                    // Check if vehicle is favorited
                    const response = await axios.get('favorites/check', { 
                        params: { post_id: vehicle.id } 
                    });
                    setIsFavorite(response.data.data.is_favorited);
                } catch (error) {
                    console.error('Error recording view or fetching favorite status:', error);
                }
            }
        };

        if (vehicle) {
            recordViewAndFetchFavorite();
        }
    }, [vehicle, user]);

    const getVehicleAge = () => {
        const currentYear = new Date().getFullYear();
        return currentYear - vehicle.year;
    };

    const getConditionColor = (condition) => {
        switch (condition) {
            case 'new': return 'bg-green-100 text-green-800';
            case 'used': return 'bg-blue-100 text-blue-800';
            case 'certified-pre-owned': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-red-500">
                    <h2 className="text-2xl font-bold">{error}</h2>
                    <Link
                        to="/vehicles"
                        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Vehicles
                    </Link>
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700">Vehicle not found</h2>
                    <Link
                        to="/vehicles"
                        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Vehicles
                    </Link>
                </div>
            </div>
        );
    }

    // Determine icon based on category
    const CategoryIcon = vehicle.category?.name === 'Bikes' ? FaMotorcycle : FaCar;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            <Link to="/vehicles" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                                Vehicles
                            </Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                {vehicle.title}
                            </span>
                        </div>
                    </li>
                </ol>
            </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Vehicle Header */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {vehicle.make?.name} {vehicle.model?.name} {vehicle.year}
                                    </h1>
                                    <p className="text-gray-600 mt-1">{vehicle.title}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {vehicle.is_featured && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            Featured
                                        </span>
                                    )}
                                    {vehicle.certified === 1 && (
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                                            <FaCheckCircle className="w-3 h-3 mr-1" />
                                            Certified
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-3xl font-bold text-blue-600">
                                    Rs. {parseFloat(vehicle.price).toLocaleString()}
                                </span>
                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getConditionColor(vehicle.condition)}`}>
                                    {vehicle.condition === 'used' ? 'Used' : vehicle.condition}
                                </span>
                            </div>
                        </div>
                        {/* Image Gallery */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                                        {vehicle.certified === 1 && (
                                            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                                                Certified
                                            </div>
                                        )}
                                        <img
                                            className="w-full h-full object-contain"
                                            src={vehicle.images?.length ? `/storage/${vehicle.images[activeImageIndex]}` : '/images/hero-car.jpg'}
                                            alt={vehicle.title}
                                            onError={(e) => {
                                                e.target.src = '/images/hero-car.jpg';
                                            }}
                                        />
                                    </div>
                                    {vehicle.images?.length > 1 && (
                                        <div className="mt-4 grid grid-cols-4 gap-2">
                                            {vehicle.images.map((image, index) => (
                                                <button
                                                    key={index}
                                                    className={`h-20 rounded-md overflow-hidden ${activeImageIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                                                    onClick={() => setActiveImageIndex(index)}
                                                >
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={`/storage/${image}`}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        onError={(e) => {
                                                            e.target.src = '/images/hero-car.jpg';
                                                        }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Quick Specs */}
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-600">
                                        <FaTachometerAlt className="w-5 h-5 mr-2 text-gray-400" />
                                        <span className="font-medium">{vehicle.mileage?.toLocaleString()} km</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FaGasPump className="w-5 h-5 mr-2 text-gray-400" />
                                        <span className="capitalize font-medium">{vehicle.fuel_type}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FaPalette className="w-5 h-5 mr-2 text-gray-400" />
                                        <span className="capitalize font-medium">{vehicle.color}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FaCog className="w-5 h-5 mr-2 text-gray-400" />
                                        <span className="capitalize font-medium">{vehicle.transmission_type}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FaCalendarAlt className="w-5 h-5 mr-2 text-gray-400" />
                                        <span className="font-medium">{vehicle.year}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FaMapMarkerAlt className="w-5 h-5 mr-2 text-gray-400" />
                                        <span className="capitalize font-medium">{vehicle.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Description */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-3">Description</h2>
                            <p className="text-gray-700 whitespace-pre-line">
                                {vehicle.description || 'No description provided.'}
                            </p>
                        </div>
                        {/* Features */}
                        {vehicle.features?.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-3">Features</h2>
                                <div className="flex flex-wrap gap-2">
                                    {vehicle.features.map((feature, index) => (
                                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Vehicle History */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Vehicle History</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Vehicle Age</span>
                                    <span className="font-medium">{getVehicleAge()} years</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Average Annual Mileage</span>
                                    <span className="font-medium">{Math.round(vehicle.mileage / getVehicleAge()).toLocaleString()} km/year</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Market Value</span>
                                    <span className="font-medium text-green-600">Good Price</span>
                                </div>
                            </div>
                            <button className="w-full mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300">
                                <FaHistory className="inline w-4 h-4 mr-2" />
                                Get Full History Report
                            </button>
                        </div>
                        {/* Safety & Inspection */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Safety & Inspection</h2>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <FaShieldAlt className="text-green-500 mr-2" />
                                    <span className="text-sm">Vehicle Verified</span>
                                </div>
                                <div className="flex items-center">
                                    <FaCheckCircle className="text-green-500 mr-2" />
                                    <span className="text-sm">No Accidents Reported</span>
                                </div>
                                <div className="flex items-center">
                                    <FaClock className="text-yellow-500 mr-2" />
                                    <span className="text-sm">Inspection Due Soon</span>
                                </div>
                            </div>
                            <button className="w-full mt-4 text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300">
                                <FaTools className="inline w-4 h-4 mr-2" />
                                Schedule Inspection
                            </button>
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        {/* Dealer Information */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Dealer Information</h2>
                            <div className="flex items-center mb-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-2xl font-bold text-blue-600">A</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">AutoMax Motors</h3>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaStar className="text-yellow-400 mr-1" />
                                        <span>4.8 (156 reviews)</span>
                                        <FaCheckCircle className="text-green-500 ml-2" />
                                        <span className="ml-1">Verified Dealer</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaMapMarkerAlt className="mr-2" />
                                    <span>Karachi, Pakistan</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaPhone className="mr-2" />
                                    <span>+92 300 1234567</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaEnvelope className="mr-2" />
                                    <span>info@automax.com</span>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
                                    <FaPhone className="inline w-4 h-4 mr-2" />
                                    Call Dealer
                                </button>
                                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
                                    <FaWhatsapp className="inline w-4 h-4 mr-2" />
                                    WhatsApp
                                </button>
                            </div>
                        </div>
                        {/* Customer Reviews */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Customer Reviews</h2>
                                <div className="flex items-center">
                                    <FaStar className="text-yellow-400 mr-1" />
                                    <span className="font-semibold">4.8</span>
                                    <span className="text-gray-600 ml-1">(24 reviews)</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="border-b border-gray-200 pb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                                            <span className="font-medium">Ahmed Khan</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaStar className="text-yellow-400 w-4 h-4" />
                                            <FaStar className="text-yellow-400 w-4 h-4" />
                                            <FaStar className="text-yellow-400 w-4 h-4" />
                                            <FaStar className="text-yellow-400 w-4 h-4" />
                                            <FaStar className="text-yellow-400 w-4 h-4" />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">"Excellent condition, smooth transaction. Highly recommended!"</p>
                                    <span className="text-xs text-gray-500">2 days ago</span>
                                </div>
                                <div className="border-b border-gray-200 pb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                                            <span className="font-medium">Sara Ahmed</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaStar className="text-yellow-400 w-4 h-4" />
                                            <FaStar className="text-yellow-400 w-4 h-4" />
                                            <FaStar className="text-yellow-400 w-4 h-4" />
                                            <FaStar className="text-yellow-400 w-4 h-4" />
                                            <FaStar className="text-gray-300 w-4 h-4" />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">"Good car, fair price. Dealer was professional and helpful."</p>
                                    <span className="text-xs text-gray-500">1 week ago</span>
                                </div>
                            </div>
                            <button className="w-full mt-4 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition duration-300">
                                View All Reviews
                            </button>
                        </div>
                        {/* Market Analysis */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Market Analysis</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Average Market Price</span>
                                    <span className="font-semibold">Rs. 2,650,000</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Price vs Market</span>
                                    <span className="text-green-600 font-semibold">-7.5% (Good Deal)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Days on Market</span>
                                    <span className="font-semibold">12 days</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Price Trend</span>
                                    <span className="text-blue-600 font-semibold">Stable</span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <FaExclamationTriangle className="inline w-4 h-4 mr-1" />
                                    This vehicle is priced below market average, making it a good value for money.
                                </p>
                            </div>
                        </div>
                        {/* Vehicle Comparison */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Compare This Vehicle</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <input type="checkbox" className="mr-3" />
                                        <div>
                                            <p className="font-medium">Toyota Corolla 2020</p>
                                            <p className="text-sm text-gray-600">Rs. 2,450,000</p>
                                        </div>
                                    </div>
                                    <FaCar className="text-blue-600" />
                                </div>
                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <input type="checkbox" className="mr-3" />
                                        <div>
                                            <p className="font-medium">Honda Civic 2021</p>
                                            <p className="text-sm text-gray-600">Rs. 3,200,000</p>
                                        </div>
                                    </div>
                                    <FaCar className="text-blue-600" />
                                </div>
                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <input type="checkbox" className="mr-3" />
                                        <div>
                                            <p className="font-medium">Suzuki Swift 2019</p>
                                            <p className="text-sm text-gray-600">Rs. 1,850,000</p>
                                        </div>
                                    </div>
                                    <FaCar className="text-blue-600" />
                                </div>
                            </div>
                            <button className="w-full mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300">
                                Compare Selected Vehicles
                            </button>
                        </div>
                        {/* Vehicle Documents */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Vehicle Documents</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <FaFileAlt className="text-blue-600 mr-3" />
                                        <div>
                                            <p className="font-medium">Registration Book</p>
                                            <p className="text-sm text-gray-600">Original document available</p>
                                        </div>
                                    </div>
                                    <FaCheckCircle className="text-green-500" />
                                </div>
                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <FaFileAlt className="text-blue-600 mr-3" />
                                        <div>
                                            <p className="font-medium">Insurance</p>
                                            <p className="text-sm text-gray-600">Valid until Dec 2024</p>
                                        </div>
                                    </div>
                                    <FaCheckCircle className="text-green-500" />
                                </div>
                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <FaFileAlt className="text-blue-600 mr-3" />
                                        <div>
                                            <p className="font-medium">Service History</p>
                                            <p className="text-sm text-gray-600">Complete service records</p>
                                        </div>
                                    </div>
                                    <FaCheckCircle className="text-green-500" />
                                </div>
                            </div>
                            <button className="w-full mt-4 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition duration-300">
                                <FaDownload className="inline w-4 h-4 mr-2" />
                                Download Documents
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back button */}
            <div className="mt-8 text-center">
                <Link
                    to="/vehicles"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
                >
                    Back to Vehicles
                </Link>
            </div>
        </div>
    );
};

export default VehicleDetails;
