import { useState, useEffect } from 'react';
import axios from '@/axios.js';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const AllVehicles = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [filters, setFilters] = useState({
        make_id: '',
        model_id: '',
        min_price: '',
        max_price: '',
        year: '',
        condition: ''
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 12,
        total: 0,
        last_page: 1,
    });

    // Initialize filters from URL params
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setFilters({
            make_id: queryParams.get('make_id') || '',
            model_id: queryParams.get('model_id') || '',
            min_price: queryParams.get('min_price') || '',
            max_price: queryParams.get('max_price') || '',
            year: queryParams.get('year') || '',
            condition: queryParams.get('condition') || ''
        });
    }, [location.search]);

    // Fetch makes on component mount
    useEffect(() => {
        const fetchMakes = async () => {
            try {
                const response = await axios.get('/makes/1');
                setMakes(response.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch makes:", err);
            }
        };
        fetchMakes();
    }, []);

    // Fetch models when make is selected
    useEffect(() => {
        if (!filters.make_id) {
            setModels([]);
            return;
        }

        const fetchModels = async () => {
            try {
                const response = await axios.get(`/makes/${filters.make_id}/models`);
                setModels(response.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch models:", err);
                setModels([]);
            }
        };
        fetchModels();
    }, [filters.make_id]);

    // Fetch vehicles when filters or pagination changes
    useEffect(() => {
        const fetchAllVehicles = async () => {
            try {
                setLoading(true);

                // Create params object with all filters
                const params = new URLSearchParams();
                if (filters.make_id) params.append('make_id', filters.make_id);
                if (filters.model_id) params.append('model_id', filters.model_id);
                if (filters.min_price) params.append('min_price', filters.min_price);
                if (filters.max_price) params.append('max_price', filters.max_price);
                if (filters.year) params.append('year', filters.year);
                if (filters.condition) params.append('condition', filters.condition);
                params.append('page', pagination.current_page);
                params.append('per_page', pagination.per_page);

                const response = await axios.get('/vehicles', { params });

                if (response.data.success && response.data.data) {
                    setVehicles(response.data.data.data);
                    setPagination({
                        current_page: response.data.data.current_page,
                        per_page: response.data.data.per_page,
                        total: response.data.data.total,
                        last_page: response.data.data.last_page,
                    });
                } else {
                    throw new Error(response.data.message || 'Invalid data format received');
                }
            } catch (err) {
                setError(err.message || 'Failed to load vehicles');
                setVehicles([]);
                console.error('API Error:', err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllVehicles();
    }, [filters, pagination.current_page]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = {
            ...filters,
            [name]: value,
            ...(name === 'make_id' && { model_id: '' }) // Reset model when make changes
        };
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, current_page: 1 }));

        // Update URL
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, val]) => {
            if (val) params.set(key, val);
        });
        navigate(`?${params.toString()}`, { replace: true });
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
                </ol>
            </nav>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">All Vehicles</h1>
                <Link
                    to="/post/create"
                    onClick={handleAddVehicleClick}
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
                        <select
                            name="make_id"
                            value={filters.make_id}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">All Makes</option>
                            {makes.map(make => (
                                <option key={make.id} value={make.id}>{make.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                        <select
                            name="model_id"
                            value={filters.model_id}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            disabled={!filters.make_id}
                        >
                            <option value="">All Models</option>
                            {models.map(model => (
                                <option key={model.id} value={model.id}>{model.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                        <input
                            type="number"
                            name="min_price"
                            value={filters.min_price}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Min price"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                        <input
                            type="number"
                            name="max_price"
                            value={filters.max_price}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Max price"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                        <select
                            name="condition"
                            value={filters.condition}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">All Conditions</option>
                            <option value="new">New</option>
                            <option value="used">Used</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Vehicle Listing */}
            {vehicles.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {vehicles.map((vehicle) => (
                            <div key={vehicle.id}
                                 className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="h-48 bg-gray-200 overflow-hidden relative">
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
                                            to={`/vehicle/${vehicle.id}`}
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
                            {Array.from({length: Math.min(5, pagination.last_page)}, (_, i) => {
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
