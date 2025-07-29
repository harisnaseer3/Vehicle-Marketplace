import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '@/axios.js';
import { FaArrowLeft, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const BikeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [sellerInfo, setSellerInfo] = useState(null);

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

        switch(method) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
                <FaArrowLeft className="mr-2" /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                        <img
                            src={bike.images?.length ?
                                `/storage/${bike.images[activeImageIndex]}` :
                                '/images/bike-placeholder.jpg'}
                            alt={`${bike.make?.name} ${bike.model?.name}`}
                            className="w-full h-96 object-contain"
                            onError={(e) => {
                                e.target.src = '/images/bike-placeholder.jpg';
                            }}
                        />
                    </div>

                    {bike.images?.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {bike.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImageIndex(index)}
                                    className={`border-2 rounded-md overflow-hidden ${activeImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                                >
                                    <img
                                        src={`/storage/${image}`}
                                        alt={`${bike.make?.name} ${bike.model?.name} - ${index + 1}`}
                                        className="w-full h-20 object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bike Details */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {bike.make?.name} {bike.model?.name} ({bike.year})
                    </h1>

                    <div className="flex items-center mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                            Rs. {bike.price?.toLocaleString()}
                        </span>
                        <span className="ml-4 px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                            {bike.condition === 'new' ? 'New' : 'Used'}
                        </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Key Specifications</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500">Make</p>
                                <p className="font-medium">{bike.make?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Model</p>
                                <p className="font-medium">{bike.model?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Year</p>
                                <p className="font-medium">{bike.year || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Mileage</p>
                                <p className="font-medium">{bike.mileage?.toLocaleString() || '0'} km</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Engine Size</p>
                                <p className="font-medium">{bike.engine_size || 'N/A'} cc</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Color</p>
                                <p className="font-medium">{bike.color || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Fuel Type</p>
                                <p className="font-medium">{bike.fuel_type || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Transmission</p>
                                <p className="font-medium">{bike.transmission_type || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    {bike.features?.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Features</h2>
                            <div className="flex flex-wrap gap-2">
                                {bike.features.map((feature, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-3">Description</h2>
                        <p className="text-gray-700 whitespace-pre-line">
                            {bike.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Seller Info */}
                    {sellerInfo && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
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
                                    <FaPhone className="mr-2" /> Call Seller
                                </button>
                                <button
                                    onClick={() => handleContactSeller('whatsapp')}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    <FaWhatsapp className="mr-2" /> WhatsApp
                                </button>
                                <button
                                    onClick={() => handleContactSeller('email')}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                >
                                    <FaEnvelope className="mr-2" /> Email Seller
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BikeDetails;
