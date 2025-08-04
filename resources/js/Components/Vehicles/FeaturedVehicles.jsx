import {Link, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from '@/axios.js';

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

    const renderVehicleGroup = (condition, title) => {
        const vehicles = vehicleGroups[condition] || [];
        const currentIndex = currentIndices[condition] || 0;

        // For home page, show 4 vehicles at a time with navigation
        const displayedVehicles = isHomePage
            ? vehicles.slice(currentIndex, currentIndex + 4)
            : vehicles;

        if (displayedVehicles.length === 0) return null;

        return (
            <div key={condition} className="mb-16">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        {title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-lg text-gray-600 mx-auto">
                        {condition === 'new' ? 'Brand new vehicles ready for delivery' : 'Quality pre-owned vehicles'}
                    </p>
                </div>

                <div className="relative">
                    {isHomePage && vehicles.length > 4 && (
                        <>
                            <button
                                onClick={() => handlePrev(condition)}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                                aria-label={`Previous ${condition} vehicles`}
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M15 19l-7-7 7-7"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => handleNext(condition)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                                aria-label={`Next ${condition} vehicles`}
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </>
                    )}

                    <div
                        className={`grid gap-8 ${
                            isHomePage ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                        }`}
                    >
                        {displayedVehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="h-48 bg-gray-200 overflow-hidden relative">
                                    {/* ✅ SOLD Badge */}
                                    {vehicle.sold?.status === 'sold' && (
                                        <div
                                            className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                                            Sold
                                        </div>
                                    )}

                                    {/* Certified Badge */}
                                    {vehicle.certified === 1 && (
                                        <div
                                            className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                                            Certified
                                        </div>
                                    )}
                                    <img
                                        className="w-full h-full object-cover"
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

                                {/* ✅ Vehicle Details */}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {vehicle.make?.name} {vehicle.model?.name}
                                    </h3>
                                    <p className="text-gray-600">{vehicle.year}</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {vehicle.mileage?.toLocaleString()} km • {vehicle.color}
                                    </p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span
                                            className={`text-xl font-bold ${
                                                vehicle.sold?.status === 'sold' ? 'text-gray-500 line-through' : 'text-blue-600'
                                            }`}
                                        >
                                        Rs. {vehicle.price ? parseFloat(vehicle.price).toLocaleString() : 'N/A'}
                                        </span>
                                        {vehicle.sold?.status === 'sold' ? (
                                            <span className="text-gray-400 text-sm italic">Sold Out</span>
                                        ) : (
                                            <Link
                                                to={`/vehicle/${vehicle.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View Details
                                            </Link>
                                        )}

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center space-y-4">
                        <Link
                            to={`/vehicles?condition=${condition}`}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            View All {title}
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
                    {renderVehicleGroup('new', 'New Vehicles')}
                    {renderVehicleGroup('used', 'Used Vehicles')}
                    {/*{renderVehicleGroup('certified-pre-owned', 'Certified Pre-Owned Vehicles')}*/}
                    {/*{renderVehicleGroup('salvage', 'Salvage Vehicles')}*/}

                    {/*{isHomePage && (*/}
                    {/*    <div className="mt-8 text-center space-y-4">*/}
                    {/*        <Link*/}
                    {/*            to="/vehicles"*/}
                    {/*            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"*/}
                    {/*        >*/}
                    {/*            View All Vehicles*/}
                    {/*        </Link>*/}
                    {/*    </div>*/}
                    {/*)}*/}
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
