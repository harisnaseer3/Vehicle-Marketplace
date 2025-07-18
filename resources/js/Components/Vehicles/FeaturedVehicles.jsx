import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '@/axios.js';

const FeaturedVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedVehicles = async () => {
            try {
                const response = await axios.get('/api/vehicles/featured');

                // Add proper response handling
                if (response.data && Array.isArray(response.data.data)) {
                    setVehicles(response.data.data);
                } else {
                    setError('Invalid data format received from server');
                    setVehicles([]); // Set empty array as fallback
                }
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to load featured vehicles');
                setVehicles([]); // Set empty array as fallback
                setLoading(false);
            }
        };

        fetchFeaturedVehicles();
    }, []);

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
            </div>
        );
    }

    // Additional check in case vehicles is not an array
    // if (!Array.isArray(vehicles) {
    //     return (
    //         <div className="mt-12 text-center text-red-500">
    //             No vehicles data available
    //         </div>
    //     );
    // }

    return (
        <>
            {vehicles.length > 0 ? (
                <>
                    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="h-48 bg-gray-200 overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={vehicle.images?.length ? vehicle.images[0].url : '/images/vehicle-placeholder.jpg'}
                                        alt={`${vehicle.make} ${vehicle.model}`}
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{vehicle.make} {vehicle.model}</h3>
                                    <p className="text-gray-600">{vehicle.year}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-xl font-bold text-blue-600">${vehicle.price?.toLocaleString()}</span>
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

                    <div className="mt-8 text-center">
                        <Link
                            to="/vehicles"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            View All Vehicles
                        </Link>
                    </div>
                </>
            ) : (
                <div className="mt-12 text-center text-gray-500">
                    No featured vehicles available at this time
                </div>
            )}
        </>
    );
};

export default FeaturedVehicles;
