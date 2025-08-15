import {useState, useEffect} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import axios from '@/axios.js';
import {useAuth} from '@/contexts/AuthContext.jsx';
import {
    FaArrowLeft,
    FaPhone,
    FaEnvelope,
    FaWhatsapp,
    FaStar,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaMotorcycle,
    FaExclamationTriangle,
    FaFileAlt,
    FaDownload,
    FaHistory,
    FaTools,
    FaShieldAlt,
    FaClock,
    FaHeart,
    FaShare,
    FaCalculator,
    FaTachometerAlt,
    FaGasPump,
    FaPalette,
    FaCog,
    FaCalendarAlt
} from 'react-icons/fa';

const BikeDetails = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [sellerInfo, setSellerInfo] = useState(null);
    const {user} = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchBikeDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/bike/${id}`);

                if (response.data.success) {
                    setBike(response.data.data);
                    // Fetch seller info if not already included in bike data
                    if (response.data.data.user) {
                        setSellerInfo(response.data.data.user);
                    } else {
                        const sellerResponse = await axios.get(`/users/${response.data.data.user_id}`);
                        setSellerInfo(sellerResponse.data.data);
                    }
                } else {
                    throw new Error(response.data.message || 'Failed to load bike details');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching bike details:', err);
            }
        };

        fetchBikeDetails();
    }, [id]);

    const handleContactSeller = (method) => {
        if (!sellerInfo) return;

        switch (method) {
            case 'phone':
                window.open(`tel:${sellerInfo.phone}`);
                break;
            case 'email':
                window.open(`mailto:${sellerInfo.email}`);
                break;
            case 'whatsapp':
                window.open(`https://wa.me/${sellerInfo.phone}?text=Hi, I'm interested in your bike ${bike.make.name} ${bike.model.name} listed on your website`);
                break;
            default:
                break;
        }
    };

    const toggleFavorite = async () => {
        if (!user) {
            navigate('/login', {state: {from: `/bike/${bike.id}`}});
            return;
        }

        try {
            const response = await axios.post('favorites/toggle', {post_id: bike.id},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
            const {is_favorited} = response.data.data;
            setIsFavorite(is_favorited);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    // Record view and fetch favorite status
    useEffect(() => {
        const recordViewAndFetchFavorite = async () => {
            if (bike && user) {
                try {
                    // Record view
                    await axios.post('recently-viewed/add',
                        {post_id: bike.id},
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                            }
                        });

                    // Check if bike is favorited
                    const response = await axios.get('favorites/check', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                        },
                        params: {post_id: bike.id},
                    });
                    setIsFavorite(response.data.data.is_favorited);
                } catch (error) {
                    console.error('Error recording view or fetching favorite status:', error);
                }
            }
        };

        if (bike) {
            recordViewAndFetchFavorite();
        }
    }, [bike, user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <div className="text-red-500 text-lg mb-4">{error}</div>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!bike) {
        return (
            <div className="text-center p-8">
                <div className="text-gray-600 text-lg mb-4">Bike not found</div>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link to="/"
                                      className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-red-600">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                    <Link to="/bikes"
                                          className="ml-1 text-sm font-medium text-gray-700 hover:text-red-600 md:ml-2">
                                        Bikes
                                    </Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                        {bike.title}
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
                        {/* Bike Header */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {bike.make?.name} {bike.model?.name} {bike.year}
                                    </h1>
                                    <p className="text-gray-600 mt-1">{bike.title}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {bike.is_featured && (
                                        <span
                                            className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            Featured
                                        </span>
                                    )}
                                    {bike.certified === 1 && (
                                        <span
                                            className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                                            <FaCheckCircle className="w-3 h-3 mr-1"/>
                                            Certified
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-3xl font-bold text-red-600">
                                    Rs. {bike.price?.toLocaleString()}
                                </span>
                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                                    bike.condition === 'new' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {bike.condition === 'new' ? 'New' : 'Used'}
                                </span>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                                        {bike.certified === 1 && (
                                            <div
                                                className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                                                Certified
                                            </div>
                                        )}
                                        <img
                                            className="w-full h-full object-contain"
                                            src={bike.images?.length ?
                                                `/storage/${bike.images[activeImageIndex]}` :
                                                '/images/bike-placeholder.jpg'}
                                            alt={`${bike.make?.name} ${bike.model?.name}`}
                                            onError={(e) => {
                                                e.target.src = '/images/bike-placeholder.jpg';
                                            }}
                                        />
                                    </div>
                                    {bike.images?.length > 1 && (
                                        <div className="mt-4 grid grid-cols-4 gap-2">
                                            {bike.images.map((image, index) => (
                                                <button
                                                    key={index}
                                                    className={`h-20 rounded-md overflow-hidden ${activeImageIndex === index ? 'ring-2 ring-red-500' : ''}`}
                                                    onClick={() => setActiveImageIndex(index)}
                                                >
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={`/storage/${image}`}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        onError={(e) => {
                                                            e.target.src = '/images/bike-placeholder.jpg';
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
                                        <FaTachometerAlt className="w-5 h-5 mr-2 text-gray-400"/>
                                        <span className="font-medium">{bike.mileage?.toLocaleString() || '0'} km</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FaMotorcycle className="w-5 h-5 mr-2 text-gray-400"/>
                                        <span className="font-medium">{bike.engine_size || 'N/A'} cc</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FaGasPump className="w-5 h-5 mr-2 text-gray-400"/>
                                        <span className="capitalize font-medium">{bike.fuel_type || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FaPalette className="w-5 h-5 mr-2 text-gray-400"/>
                                        <span className="capitalize font-medium">{bike.color || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FaCog className="w-5 h-5 mr-2 text-gray-400"/>
                                        <span
                                            className="capitalize font-medium">{bike.transmission_type || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <FaCalendarAlt className="w-5 h-5 mr-2 text-gray-400"/>
                                        <span className="font-medium">{bike.year || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-3">Description</h2>
                            <p className="text-gray-700 whitespace-pre-line">
                                {bike.description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Features */}
                        {bike.features?.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-3">Features</h2>
                                <div className="flex flex-wrap gap-2">
                                    {bike.features.map((feature, index) => (
                                        <span key={index}
                                              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bike History */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Bike History</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Bike Age</span>
                                    <span className="font-medium">{new Date().getFullYear() - bike.year} years</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Average Annual Mileage</span>
                                    <span
                                        className="font-medium">{Math.round(bike.mileage / (new Date().getFullYear() - bike.year)).toLocaleString()} km/year</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Market Value</span>
                                    <span className="font-medium text-green-600">Fair Price</span>
                                </div>
                            </div>
                            <button
                                className="w-full mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300">
                                <FaHistory className="inline w-4 h-4 mr-2"/>
                                Get Full History Report
                            </button>
                        </div>

                        {/* Safety & Inspection */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Safety & Inspection</h2>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <FaShieldAlt className="text-green-500 mr-2"/>
                                    <span className="text-sm">Bike Verified</span>
                                </div>
                                <div className="flex items-center">
                                    <FaCheckCircle className="text-green-500 mr-2"/>
                                    <span className="text-sm">No Accidents Reported</span>
                                </div>
                                <div className="flex items-center">
                                    <FaClock className="text-yellow-500 mr-2"/>
                                    <span className="text-sm">Inspection Due Soon</span>
                                </div>
                            </div>
                            <button
                                className="w-full mt-4 text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300">
                                <FaTools className="inline w-4 h-4 mr-2"/>
                                Schedule Inspection
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        {/* Seller Info */}
                        {sellerInfo && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
                                <div className="flex items-start mb-4">
                                    <div className="flex-1">
                                        <p className="font-medium">{sellerInfo.name}</p>
                                        <p className="text-gray-600 text-sm">
                                            Member since {new Date(sellerInfo.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleContactSeller('phone')}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        <FaPhone className="mr-2"/> Call Seller
                                    </button>
                                    <button
                                        onClick={() => handleContactSeller('whatsapp')}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        <FaWhatsapp className="mr-2"/> WhatsApp
                                    </button>
                                    <button
                                        onClick={() => handleContactSeller('email')}
                                        className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                    >
                                        <FaEnvelope className="mr-2"/> Email Seller
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Dealer Information */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Dealer Information</h2>
                            <div className="flex items-center mb-4">
                                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-2xl font-bold text-red-600">M</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Motorcycle World</h3>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaStar className="text-yellow-400 mr-1"/>
                                        <span>4.9 (89 reviews)</span>
                                        <FaCheckCircle className="text-green-500 ml-2"/>
                                        <span className="ml-1">Verified Dealer</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaMapMarkerAlt className="mr-2"/>
                                    <span>Lahore, Pakistan</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaPhone className="mr-2"/>
                                    <span>+92 300 9876543</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaEnvelope className="mr-2"/>
                                    <span>info@motorcycleworld.com</span>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
                                    <FaPhone className="inline w-4 h-4 mr-2"/>
                                    Call Dealer
                                </button>
                                <button
                                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
                                    <FaWhatsapp className="inline w-4 h-4 mr-2"/>
                                    WhatsApp
                                </button>
                            </div>
                        </div>

                        {/* Customer Reviews */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Customer Reviews</h2>
                                <div className="flex items-center">
                                    <FaStar className="text-yellow-400 mr-1"/>
                                    <span className="font-semibold">4.7</span>
                                    <span className="text-gray-600 ml-1">(18 reviews)</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="border-b border-gray-200 pb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                                            <span className="font-medium">Ali Hassan</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaStar className="text-yellow-400 w-4 h-4"/>
                                            <FaStar className="text-yellow-400 w-4 h-4"/>
                                            <FaStar className="text-yellow-400 w-4 h-4"/>
                                            <FaStar className="text-yellow-400 w-4 h-4"/>
                                            <FaStar className="text-yellow-400 w-4 h-4"/>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">"Great bike in excellent condition. Smooth ride
                                        and good fuel efficiency!"</p>
                                    <span className="text-xs text-gray-500">3 days ago</span>
                                </div>
                                <div className="border-b border-gray-200 pb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                                            <span className="font-medium">Fatima Khan</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaStar className="text-yellow-400 w-4 h-4"/>
                                            <FaStar className="text-yellow-400 w-4 h-4"/>
                                            <FaStar className="text-yellow-400 w-4 h-4"/>
                                            <FaStar className="text-yellow-400 w-4 h-4"/>
                                            <FaStar className="text-gray-300 w-4 h-4"/>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">"Reliable motorcycle, perfect for daily
                                        commute. Dealer was very helpful."</p>
                                    <span className="text-xs text-gray-500">1 week ago</span>
                                </div>
                            </div>
                            <button
                                className="w-full mt-4 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition duration-300">
                                View All Reviews
                            </button>
                        </div>

                        {/* Market Analysis */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Market Analysis</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Average Market Price</span>
                                    <span className="font-semibold">Rs. 175,000</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Price vs Market</span>
                                    <span className="text-green-600 font-semibold">-5.7% (Good Deal)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Days on Market</span>
                                    <span className="font-semibold">8 days</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Price Trend</span>
                                    <span className="text-blue-600 font-semibold">Stable</span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <FaExclamationTriangle className="inline w-4 h-4 mr-1"/>
                                    This motorcycle is priced competitively in the current market.
                                </p>
                            </div>
                        </div>

                        {/* Bike Comparison */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Compare This Bike</h2>
                            <div className="space-y-3">
                                <div
                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <input type="checkbox" className="mr-3"/>
                                        <div>
                                            <p className="font-medium">Honda CG 125 2021</p>
                                            <p className="text-sm text-gray-600">Rs. 185,000</p>
                                        </div>
                                    </div>
                                    <FaMotorcycle className="text-red-600"/>
                                </div>
                                <div
                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <input type="checkbox" className="mr-3"/>
                                        <div>
                                            <p className="font-medium">Yamaha YBR 125 2020</p>
                                            <p className="text-sm text-gray-600">Rs. 165,000</p>
                                        </div>
                                    </div>
                                    <FaMotorcycle className="text-red-600"/>
                                </div>
                                <div
                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <input type="checkbox" className="mr-3"/>
                                        <div>
                                            <p className="font-medium">Suzuki GS 150 2019</p>
                                            <p className="text-sm text-gray-600">Rs. 145,000</p>
                                        </div>
                                    </div>
                                    <FaMotorcycle className="text-red-600"/>
                                </div>
                            </div>
                            <button
                                className="w-full mt-4 text-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-300">
                                Compare Selected Bikes
                            </button>
                        </div>

                        {/* Bike Documents */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Bike Documents</h2>
                            <div className="space-y-3">
                                <div
                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <FaFileAlt className="text-blue-600 mr-3"/>
                                        <div>
                                            <p className="font-medium">Registration Book</p>
                                            <p className="text-sm text-gray-600">Original document available</p>
                                        </div>
                                    </div>
                                    <FaCheckCircle className="text-green-500"/>
                                </div>
                                <div
                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <FaFileAlt className="text-blue-600 mr-3"/>
                                        <div>
                                            <p className="font-medium">Insurance</p>
                                            <p className="text-sm text-gray-600">Valid until Dec 2024</p>
                                        </div>
                                    </div>
                                    <FaCheckCircle className="text-green-500"/>
                                </div>
                                <div
                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <FaFileAlt className="text-blue-600 mr-3"/>
                                        <div>
                                            <p className="font-medium">Service History</p>
                                            <p className="text-sm text-gray-600">Complete service records</p>
                                        </div>
                                    </div>
                                    <FaCheckCircle className="text-green-500"/>
                                </div>
                            </div>
                            <button
                                className="w-full mt-4 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition duration-300">
                                <FaDownload className="inline w-4 h-4 mr-2"/>
                                Download Documents
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back button */}
            <div className="mt-8 text-center">
                <Link
                    to="/bikes"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition duration-300"
                >
                    Back to Bikes
                </Link>
            </div>
        </div>
    );
};

export default BikeDetails;
