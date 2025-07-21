import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '@/axios.js';
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
    FaMotorcycle
} from 'react-icons/fa';


const VehicleDetails = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            try {
                const response = await axios.get(`/post/${id}`);

                if (response.data.success && response.data.data) {
                    setVehicle(response.data.data);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb Navigation */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
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

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Vehicle Title */}
                <div className="px-6 py-4 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {vehicle.make?.name} {vehicle.model?.name} {vehicle.year}
                            </h1>
                            <p className="text-gray-600">{vehicle.title}</p>
                        </div>
                        {vehicle.is_featured && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                Featured
                            </span>
                        )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-2xl font-bold text-blue-600">
                            Rs. {parseFloat(vehicle.price).toLocaleString()}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                            vehicle.condition === 'used' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                            {vehicle.condition === 'used' ? 'Used' : 'New'}
                        </span>
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    <div>
                        <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                className="w-full h-full object-contain"
                                src={vehicle.images?.length ? `/storage/${vehicle.images[activeImageIndex]}` : '/images/vehicle-placeholder.jpg'}
                                alt={vehicle.title}
                                onError={(e) => {
                                    e.target.src = '/images/vehicle-placeholder.jpg';
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
                                                e.target.src = '/images/vehicle-placeholder.jpg';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Vehicle Details */}
                    <div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Vehicle Overview</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <CategoryIcon className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Category</p>
                                        <p className="font-medium">{vehicle.category?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaCar className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Make & Model</p>
                                        <p className="font-medium">{vehicle.make?.name} {vehicle.model?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaCalendarAlt className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Year</p>
                                        <p className="font-medium">{vehicle.year}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaTachometerAlt className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Mileage</p>
                                        <p className="font-medium">{vehicle.mileage?.toLocaleString()} km</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaPalette className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Color</p>
                                        <p className="font-medium capitalize">{vehicle.color}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaCog className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Transmission</p>
                                        <p className="font-medium capitalize">{vehicle.transmission_type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaGasPump className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Fuel Type</p>
                                        <p className="font-medium capitalize">{vehicle.fuel_type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-500">Body Type</p>
                                        <p className="font-medium capitalize">{vehicle.body_type}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Seller */}
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Contact Seller</h2>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <FaUser className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Posted by</p>
                                        <p className="font-medium">{vehicle.user?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaPhone className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{vehicle.user?.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaMapMarkerAlt className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium capitalize">{vehicle.location.replace('-', ' ')}</p>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <a
                                        href={`tel:${vehicle.user?.phone}`}
                                        className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                                    >
                                        Call Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="p-6 border-t">
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">
                        {vehicle.description || 'No description provided.'}
                    </p>
                </div>

                {/* Features */}
                {vehicle.features?.length > 0 && (
                    <div className="p-6 border-t">
                        <h2 className="text-xl font-semibold mb-4">Features</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {vehicle.features.map((feature, index) => (
                                <div key={index} className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-700 capitalize">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Registration Details */}
                <div className="p-6 border-t">
                    <h2 className="text-xl font-semibold mb-4">Registration Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Registration Status</p>
                            <p className="font-medium capitalize">{vehicle.vehicle_register?.status || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Province</p>
                            <p className="font-medium capitalize">{vehicle.vehicle_register?.province || 'Not specified'}</p>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="p-6 border-t text-sm text-gray-500">
                    <p>Vehicle ID: {vehicle.id}</p>
                    <p className="mt-1">Posted on: {new Date(vehicle.created_at).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Back button */}
            <div className="mt-8 text-center">
                <Link
                    to="/vehicles"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                    Back to Vehicles
                </Link>
            </div>
        </div>
    );
};

export default VehicleDetails;
