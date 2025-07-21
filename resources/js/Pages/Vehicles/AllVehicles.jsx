import { useState, useEffect } from 'react';
import axios from '@/axios.js';
import FeaturedVehicles from '@/Components/Vehicles/FeaturedVehicles.jsx';
import { Link, useNavigate  } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const AllVehicles = () => {
    // const { user } = useAuth();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        make: '',
        model: '',
        minPrice: '',
        maxPrice: '',
        year: '',
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 12,
        total: 0,
        last_page: 1,
    });

    useEffect(() => {
        const fetchAllVehicles = async () => {
            try {
                const response = await axios.get('/posts', {
                    params: {
                        ...filters,
                        page: pagination.current_page,
                        per_page: pagination.per_page
                    }
                });

                if (response.data.success && response.data.data) {
                    setVehicles(response.data.data.data);
                    setPagination(prev => ({
                        ...prev,
                        current_page: response.data.data.current_page,
                        per_page: response.data.data.per_page,
                        total: response.data.data.total,
                        last_page: response.data.data.last_page,
                    }));
                } else {
                    throw new Error(response.data.message || 'Invalid data format received');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to load vehicles');
                setVehicles([]);
                setLoading(false);
                console.error('API Error:', err.response?.data || err.message);
            }
        };

        fetchAllVehicles();
    }, [filters, pagination.current_page]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        // Reset to first page when filters change
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, current_page: page }));
    };

    const handleAddVehicleClick = (e) => {
        if (!user) {
            e.preventDefault();
            navigate('/login', { state: { from: '/vehicles' } });
        }
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">All Vehicles</h1>
                <Link
                    to="/post/create"
                    // onClick={handleAddVehicleClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    Add New Vehicle
                </Link>
            </div>

            {/* Filter Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Filter Vehicles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                        <input
                            type="text"
                            name="make"
                            value={filters.make}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Any make"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                        <input
                            type="text"
                            name="model"
                            value={filters.model}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Any model"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Min price"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Max price"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input
                            type="number"
                            name="year"
                            value={filters.year}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Any year"
                        />
                    </div>
                </div>
            </div>

            {/* Vehicle Listing */}
            {vehicles.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="h-48 bg-gray-200 overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={vehicle.images?.length ?
                                            `/storage/${vehicle.images[0]}` :
                                            '/images/vehicle-placeholder.jpg'
                                        }
                                        alt={vehicle.title}
                                        onError={(e) => {
                                            e.target.src = '/images/vehicle-placeholder.jpg';
                                        }}
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {vehicle.make?.name} {vehicle.model?.name}
                                        </h3>
                                        {vehicle.is_featured && (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                Featured
                                            </span>
                                        )}
                                    </div>
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

                    {/* Pagination */}
                    <div className="flex justify-center mt-8">
                        <nav className="inline-flex rounded-md shadow">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={pagination.current_page === 1}
                                className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                                First
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>

                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                                let pageNum;
                                if (pagination.last_page <= 5) {
                                    pageNum = i + 1;
                                } else if (pagination.current_page <= 3) {
                                    pageNum = i + 1;
                                } else if (pagination.current_page >= pagination.last_page - 2) {
                                    pageNum = pagination.last_page - 4 + i;
                                } else {
                                    pageNum = pagination.current_page - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-2 border-t border-b border-gray-300 ${pagination.current_page === pageNum ? 'bg-blue-50 text-blue-600 border-blue-500' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.last_page)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Last
                            </button>
                        </nav>
                    </div>
                </>
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
                    <p className="mt-2 text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
            )}
        </div>
    );
};

export default AllVehicles;
