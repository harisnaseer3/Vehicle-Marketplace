import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '@/axios.js';

const FeaturedVehicles = ({ isHomePage = false }) => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchFeaturedVehicles = async () => {
            try {
                const response = await axios.get('/featured-vehicles');

                if (response.data.success && response.data.data?.data) {
                    setVehicles(response.data.data.data);
                } else {
                    throw new Error(response.data.message || 'Invalid data format received');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to load featured vehicles');
                setVehicles([]);
                setLoading(false);
                console.error('API Error:', err.response?.data || err.message);
            }
        };

        fetchFeaturedVehicles();
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? vehicles.length - Math.min(4, vehicles.length) : prevIndex - 4
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + 4 >= vehicles.length ? 0 : prevIndex + 4
        );
    };

    if (loading) {
        return (
            <div className="mt-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-12 text-center text-red-500">
                {error}
                <p className="mt-2 text-sm text-gray-600">
                    Please try again later or contact support.
                </p>
            </div>
        );
    }

    // For home page, show 4 vehicles at a time with navigation
    const displayedVehicles = isHomePage
        ? vehicles.slice(currentIndex, currentIndex + 4)
        : vehicles;

    return (
        <>
            {displayedVehicles.length > 0 ? (
                <>
                    <div className="relative">
                        {isHomePage && vehicles.length > 4 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                                    aria-label="Previous vehicles"
                                >
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                                    aria-label="Next vehicles"
                                >
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        <div className={`mt-12 grid gap-8 ${isHomePage ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
                            {displayedVehicles.map((vehicle) => (
                                <div key={vehicle.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="h-48 bg-gray-200 overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={vehicle.images?.length ?
                                                `/storage/${vehicle.images[0]}` :
                                                '/images/vehicle-placeholder.jpg'
                                            }
                                            alt={`${vehicle.make?.name || 'Car'} ${vehicle.model?.name || ''}`}
                                            onError={(e) => {
                                                e.target.src = '/images/vehicle-placeholder.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {vehicle.make?.name} {vehicle.model?.name}
                                        </h3>
                                        <p className="text-gray-600">{vehicle.year}</p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {vehicle.mileage?.toLocaleString()} km • {vehicle.color}
                                        </p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <span className="text-xl font-bold text-blue-600">
                                                Rs. {vehicle.price ? parseFloat(vehicle.price).toLocaleString() : 'N/A'}
                                            </span>
                                            <Link
                                                to={`/vehicles/${vehicle.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isHomePage && (
                        <div className="mt-8 text-center space-y-4">
                            <Link
                                to="/vehicles"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                                View All Vehicles
                            </Link>
                        </div>
                    )}
                </>
            ) : (
                <div className="mt-12 text-center text-gray-500">
                    No featured vehicles available at this time
                    <p className="mt-2 text-sm">
                        Check back later for new arrivals.
                    </p>
                </div>
            )}
        </>
    );
};

export default FeaturedVehicles;
