import {useState, useEffect} from 'react';
import {useLocation, Link, useNavigate} from 'react-router-dom';
import axios from '@/axios.js';
import {useAuth} from '@/contexts/AuthContext.jsx';
import RelatedSearches from '@/Components/Vehicles/RelatedSearches.jsx';
import PopularBrands from '@/Components/Vehicles/PopularBrands.jsx';
import RecentlyViewed from '@/Components/Vehicles/RecentlyViewed.jsx';
import DealerShowrooms from '@/Components/Vehicles/DealerShowrooms.jsx';
import HelpSupport from '@/Components/Vehicles/HelpSupport.jsx';
import {
    FaMotorcycle,
    FaSearch,
    FaFilter,
    FaSort,
    FaTh,
    FaList,
    FaHeart,
    FaEye,
    FaStar,
    FaCheckCircle,
    FaShieldAlt,
    FaMapMarkerAlt,
    FaTachometerAlt,
    FaGasPump,
    FaCog,
    FaPalette,
    FaCalendarAlt,
    FaTruck,
    FaTools,
    FaTimes,
    FaSlidersH,
    FaThumbsUp,
    FaClock,
    FaFire,
    FaAward,
    FaBolt,
    FaRoad,
    FaBorderAll,
    FaThLarge
} from 'react-icons/fa';

const AllBikes = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [bikes, setBikes] = useState([]);
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
        condition: '',
        transmission_type: '',
        fuel_type: '',
        engine_capacity: '',
        bike_type: '',
        color: '',
        location: ''
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 12,
        total: 0,
        last_page: 1,
    });
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('latest'); // 'latest', 'price_low', 'price_high', 'year', 'mileage'
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [quickFilters, setQuickFilters] = useState({
        certified: false,
        featured: false,
        newArrivals: false,
        bestDeals: false
    });
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        used: 0,
        certified: 0
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
            condition: queryParams.get('condition') || '',
            transmission_type: queryParams.get('transmission_type') || '',
            fuel_type: queryParams.get('fuel_type') || '',
            engine_capacity: queryParams.get('engine_capacity') || '',
            bike_type: queryParams.get('bike_type') || '',
            color: queryParams.get('color') || '',
            location: queryParams.get('location') || ''
        });
    }, [location.search]);

    // Fetch makes on component mount
    useEffect(() => {
        const fetchMakes = async () => {
            try {
                const response = await axios.get('/makes/2'); // Category ID 2 for bikes
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

    // Fetch bikes when filters or pagination changes
    useEffect(() => {
        const fetchAllBikes = async () => {
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
                if (filters.transmission_type) params.append('transmission_type', filters.transmission_type);
                if (filters.fuel_type) params.append('fuel_type', filters.fuel_type);
                if (filters.engine_capacity) params.append('engine_capacity', filters.engine_capacity);
                if (filters.bike_type) params.append('bike_type', filters.bike_type);
                if (filters.color) params.append('color', filters.color);
                if (filters.location) params.append('location', filters.location);
                params.append('page', pagination.current_page);
                params.append('per_page', pagination.per_page);
                params.append('category', 'bikes');

                const response = await axios.get('/bikes', {params});

                if (response.data.success && response.data.data) {
                    setBikes(response.data.data.data);
                    setPagination({
                        current_page: response.data.data.current_page,
                        per_page: response.data.data.per_page,
                        total: response.data.data.total,
                        last_page: response.data.data.last_page,
                    });

                    // Update stats
                    setStats({
                        total: response.data.data.total,
                        new: response.data.data.data.filter(bike => bike.condition === 'new').length,
                        used: response.data.data.data.filter(bike => bike.condition === 'used').length,
                        certified: response.data.data.data.filter(bike => bike.certified === true).length
                    });
                } else {
                    throw new Error(response.data.message || 'Failed to load bikes');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAllBikes();
    }, [filters, pagination.current_page, pagination.per_page]);

    const handleFilterChange = (e) => {
        const {name, value} = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPagination(prev => ({...prev, current_page: 1}));
    };

    const handlePageChanges = (page) => {
        setPagination(prev => ({...prev, current_page: page}));
    };

    const handleAddBikeClick = (e) => {
        if (!user) {
            e.preventDefault();
            navigate('/login', {state: {from: '/bikes'}});
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

    const getEngineSize = (engineCapacity) => {
        if (!engineCapacity) return 'N/A';
        return `${engineCapacity}cc`;
    };

    const toggleFavorite = async (bikeId) => {
        if (!user) {
            navigate('/login', {state: {from: '/bikes'}});
            return;
        }

        try {
            const response = await axios.post('favorites/toggle',
                {post_id: bikeId},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });
            const {is_favorited} = response.data.data;

            setFavorites(prev =>
                is_favorited
                    ? [...prev, bikeId]
                    : prev.filter(id => id !== bikeId)
            );
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    // Fetch user's favorites on component mount
    useEffect(() => {
        const fetchFavorites = async () => {
            if (user) {
                try {
                    const response = await axios.get('favorites', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                        }
                    });
                    const favoriteIds = response.data.data.map(fav => fav.id);
                    setFavorites(favoriteIds);
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                }
            }
        };

        fetchFavorites();
    }, [user]);

    const handleQuickFilterChange = (filterName) => {
        setQuickFilters(prev => ({
            ...prev,
            [filterName]: !prev[filterName]
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            make_id: '',
            model_id: '',
            min_price: '',
            max_price: '',
            year: '',
            condition: '',
            transmission_type: '',
            fuel_type: '',
            engine_capacity: '',
            bike_type: '',
            color: '',
            location: ''
        });
        setQuickFilters({
            certified: false,
            featured: false,
            newArrivals: false,
            bestDeals: false
        });
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
            <div className="text-center text-red-500 p-8">
                {error}
                <p className="mt-2 text-sm text-gray-600">
                    Please try again later or contact support.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white">
                <div className="container mx-auto px-4 py-12">
                    <nav className="flex mb-6" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link to="/"
                                      className="inline-flex items-center text-sm font-medium text-red-200 hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="w-3 h-3 mx-1 text-red-300" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                    <span className="ml-1 text-sm font-medium text-white md:ml-2">
                                        All Motorcycles
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Browse All Motorcycles</h1>
                            <p className="text-red-100 text-lg">Discover your perfect ride from our extensive
                                collection</p>
                        </div>
                        <Link
                            to="/post/create"
                            onClick={handleAddBikeClick}
                            className="bg-white text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105 shadow-lg"
                        >
                            <FaMotorcycle className="inline mr-2"/>
                            Sell Your Motorcycle
                        </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <div className="text-red-200 text-sm">Total Motorcycles</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold">{stats.new}</div>
                            <div className="text-red-200 text-sm">New Motorcycles</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold">{stats.used}</div>
                            <div className="text-red-200 text-sm">Used Motorcycles</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold">{stats.certified}</div>
                            <div className="text-red-200 text-sm">Certified</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Enhanced Filter Section */}
                <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
                    {/* Filter Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <FaFilter className="text-red-600 mr-2"/>
                                <h2 className="text-xl font-semibold text-gray-900">Filter Motorcycles</h2>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                    className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700"
                                >
                                    <FaSlidersH className="mr-1"/>
                                    {showAdvancedFilters ? 'Hide' : 'Show'} Advanced
                                </button>
                                <button
                                    onClick={clearAllFilters}
                                    className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700"
                                >
                                    <FaTimes className="mr-1"/>
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleQuickFilterChange('certified')}
                                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    quickFilters.certified
                                        ? 'bg-red-100 text-red-700 border border-red-300'
                                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                }`}
                            >
                                <FaShieldAlt className="mr-1"/>
                                Certified
                            </button>
                            <button
                                onClick={() => handleQuickFilterChange('featured')}
                                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    quickFilters.featured
                                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                }`}
                            >
                                <FaStar className="mr-1"/>
                                Featured
                            </button>
                            <button
                                onClick={() => handleQuickFilterChange('newArrivals')}
                                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    quickFilters.newArrivals
                                        ? 'bg-green-100 text-green-700 border border-green-300'
                                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                }`}
                            >
                                <FaClock className="mr-1"/>
                                New Arrivals
                            </button>
                            <button
                                onClick={() => handleQuickFilterChange('bestDeals')}
                                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    quickFilters.bestDeals
                                        ? 'bg-red-100 text-red-700 border border-red-300'
                                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                }`}
                            >
                                <FaThumbsUp className="mr-1"/>
                                Best Deals
                            </button>
                        </div>
                    </div>

                    {/* Basic Filters */}
                    <div className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                                <select
                                    name="make_id"
                                    value={filters.make_id}
                                    onChange={handleFilterChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    disabled={!filters.make_id}
                                >
                                    <option value="">All Models</option>
                                    {models.map(model => (
                                        <option key={model.id} value={model.id}>{model.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                                <select
                                    name="condition"
                                    value={filters.condition}
                                    onChange={handleFilterChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                >
                                    <option value="">All Conditions</option>
                                    <option value="new">New</option>
                                    <option value="used">Used</option>
                                    <option value="certified-pre-owned">Certified Pre-Owned</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <input
                                    type="number"
                                    name="year"
                                    value={filters.year}
                                    onChange={handleFilterChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Year"
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                />
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        {showAdvancedFilters && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Filters</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Min
                                            Price</label>
                                        <input
                                            type="number"
                                            name="min_price"
                                            value={filters.min_price}
                                            onChange={handleFilterChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Min price"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max
                                            Price</label>
                                        <input
                                            type="number"
                                            name="max_price"
                                            value={filters.max_price}
                                            onChange={handleFilterChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Max price"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Engine
                                            Capacity</label>
                                        <select
                                            name="engine_capacity"
                                            value={filters.engine_capacity}
                                            onChange={handleFilterChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        >
                                            <option value="">All Capacities</option>
                                            <option value="50-125">50-125cc</option>
                                            <option value="126-250">126-250cc</option>
                                            <option value="251-500">251-500cc</option>
                                            <option value="501-750">501-750cc</option>
                                            <option value="751-1000">751-1000cc</option>
                                            <option value="1000+">1000cc+</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bike
                                            Type</label>
                                        <select
                                            name="bike_type"
                                            value={filters.bike_type}
                                            onChange={handleFilterChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        >
                                            <option value="">All Types</option>
                                            <option value="sports">Sports</option>
                                            <option value="cruiser">Cruiser</option>
                                            <option value="scooter">Scooter</option>
                                            <option value="adventure">Adventure</option>
                                            <option value="naked">Naked</option>
                                            <option value="touring">Touring</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sort and View Controls */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                                <option value="latest">Latest First</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="year">Year: Newest First</option>
                                <option value="mileage">Mileage: Low to High</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">View:</span>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <FaTh className="w-4 h-4"/>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <FaList className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {bikes.length} of {pagination.total} motorcycles
                            </div>
                            <div className="text-sm text-gray-600">
                                Page {pagination.current_page} of {pagination.last_page}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Motorcycles Listing */}
                {bikes.length > 0 ? (
                    <>
                        <div className={viewMode === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "space-y-4"
                        }>
                            {bikes.map((bike) => {
                                return viewMode === 'grid' ? (
                                    // Grid View
                                    <div key={bike.id}
                                         className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                                        <div
                                            className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                            {/* Badges */}
                                            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                                {bike.certified === 1 && (
                                                    <div
                                                        className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                                                        <FaShieldAlt className="w-3 h-3 mr-1"/>
                                                        Certified
                                                    </div>
                                                )}
                                                {bike.is_featured && (
                                                    <div
                                                        className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                                                        <FaStar className="w-3 h-3 mr-1"/>
                                                        Featured
                                                    </div>
                                                )}
                                            </div>

                                            {/* Category Badge */}
                                            <div className="absolute top-3 right-3 z-10">
                                                <div
                                                    className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow-lg flex items-center">
                                                    <FaMotorcycle className="w-3 h-3 mr-1"/>
                                                    Motorcycle
                                                </div>
                                            </div>

                                            {/* Condition Badge */}
                                            <div className="absolute bottom-3 left-3 z-10">
                                            <span
                                                className={`text-xs font-bold px-3 py-1 rounded-full border ${getConditionColor(bike.condition)}`}>
                                                {bike.condition === 'used' ? 'Used' : bike.condition}
                                            </span>
                                            </div>

                                            {/* Favorite Button */}
                                            <button
                                                onClick={() => toggleFavorite(bike.id)}
                                                className={`absolute bottom-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
                                                    favorites.includes(bike.id)
                                                        ? 'bg-red-500 text-white shadow-lg'
                                                        : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white'
                                                }`}
                                            >
                                                <FaHeart className="w-4 h-4"/>
                                            </button>

                                            <img
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                src={bike.images?.length ?
                                                    `/storage/${bike.images[0]}` :
                                                    '/images/bike-placeholder.jpg'}
                                                alt={`${bike.make?.name} ${bike.model?.name}`}
                                                onError={(e) => {
                                                    e.target.src = '/images/bike-placeholder.jpg';
                                                }}
                                            />
                                        </div>

                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                                                        {bike.make?.name} {bike.model?.name}
                                                    </h3>
                                                    <p className="text-gray-600 font-medium">{bike.year}</p>
                                                </div>
                                                <div className="flex items-center text-yellow-400">
                                                    <FaStar className="w-4 h-4"/>
                                                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                                                </div>
                                            </div>

                                            {/* Quick Specs */}
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaTachometerAlt className="w-4 h-4 mr-2 text-gray-400"/>
                                                    <span>{bike.mileage?.toLocaleString()} km</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaBolt className="w-4 h-4 mr-2 text-gray-400"/>
                                                    <span>{getEngineSize(bike.engine_size)}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaGasPump className="w-4 h-4 mr-2 text-gray-400"/>
                                                    <span className="capitalize">{bike.fuel_type}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <FaPalette className="w-4 h-4 mr-2 text-gray-400"/>
                                                    <span className="capitalize">{bike.color}</span>
                                                </div>
                                            </div>

                                            {/* Location */}
                                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                                <FaMapMarkerAlt className="w-4 h-4 mr-2"/>
                                                <span className="capitalize">{bike.location?.replace('-', ' ')}</span>
                                            </div>

                                            {/* Price and Action */}
                                            <div
                                                className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                <div>
                                                <span className="text-2xl font-bold text-red-600">
                                                    {formatPrice(bike.price)}
                                                </span>
                                                </div>
                                                <Link
                                                    to={`/bike/${bike.id}`}
                                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // List View
                                    <div key={bike.id}
                                         className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            <div className="lg:w-1/3">
                                                <div
                                                    className="relative h-48 lg:h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                                                    {/* Badges */}
                                                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                                        {bike.certified === 1 && (
                                                            <div
                                                                className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                                                                <FaShieldAlt className="w-3 h-3 mr-1"/>
                                                                Certified
                                                            </div>
                                                        )}
                                                        {bike.is_featured && (
                                                            <div
                                                                className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
                                                                <FaStar className="w-3 h-3 mr-1"/>
                                                                Featured
                                                            </div>
                                                        )}
                                                    </div>

                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={bike.images?.length ?
                                                            `/storage/${bike.images[0]}` :
                                                            '/images/bike-placeholder.jpg'}
                                                        alt={`${bike.make?.name} ${bike.model?.name}`}
                                                        onError={(e) => {
                                                            e.target.src = '/images/bike-placeholder.jpg';
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="lg:w-2/3">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                            {bike.make?.name} {bike.model?.name} {bike.year}
                                                        </h3>
                                                        <p className="text-gray-600 text-lg">{bike.title}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => toggleFavorite(bike.id)}
                                                            className={`p-2 rounded-full transition-all duration-300 ${
                                                                favorites.includes(bike.id)
                                                                    ? 'bg-red-500 text-white'
                                                                    : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                                                            }`}
                                                        >
                                                            <FaHeart className="w-5 h-5"/>
                                                        </button>
                                                        <span
                                                            className={`text-xs font-bold px-3 py-1 rounded-full border ${getConditionColor(bike.condition)}`}>
                                                        {bike.condition === 'used' ? 'Used' : bike.condition}
                                </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                    <div className="flex items-center text-gray-600">
                                                        <FaTachometerAlt className="w-5 h-5 mr-2 text-gray-400"/>
                                                        <div>
                                                            <div className="text-sm text-gray-500">Mileage</div>
                                                            <div
                                                                className="font-medium">{bike.mileage?.toLocaleString()} km
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <FaBolt className="w-5 h-5 mr-2 text-gray-400"/>
                                                        <div>
                                                            <div className="text-sm text-gray-500">Engine</div>
                                                            <div
                                                                className="font-medium">{getEngineSize(bike.engine_size)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <FaGasPump className="w-5 h-5 mr-2 text-gray-400"/>
                                                        <div>
                                                            <div className="text-sm text-gray-500">Fuel Type</div>
                                                            <div
                                                                className="font-medium capitalize">{bike.fuel_type}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <FaPalette className="w-5 h-5 mr-2 text-gray-400"/>
                                                        <div>
                                                            <div className="text-sm text-gray-500">Color</div>
                                                            <div className="font-medium capitalize">{bike.color}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center text-gray-500">
                                                        <FaMapMarkerAlt className="w-4 h-4 mr-2"/>
                                                        <span
                                                            className="capitalize">{bike.location?.replace('-', ' ')}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="text-right">
                                                            <div className="text-3xl font-bold text-red-600">
                                                                {formatPrice(bike.price)}
                                                            </div>
                                                        </div>
                                                        <Link
                                                            to={`/bike/${bike.id}`}
                                                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Enhanced Pagination */}
                        <div className="flex justify-center mt-8">
                            <nav className="inline-flex rounded-md shadow">
                                <button
                                    onClick={() => handlePageChanges(1)}
                                    disabled={pagination.current_page === 1}
                                    className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    First
                                </button>
                                <button
                                    onClick={() => handlePageChanges(pagination.current_page - 1)}
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
                                            onClick={() => handlePageChanges(pageNum)}
                                            className={`px-3 py-2 border-t border-b border-gray-300 ${pagination.current_page === pageNum ? 'bg-red-50 text-red-600 border-red-500' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChanges(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className="px-3 py-2 border-t border-b border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => handlePageChanges(pagination.last_page)}
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
                        <div className="max-w-md mx-auto">
                            <div className="text-gray-400 mb-4">
                                <FaMotorcycle className="w-16 h-16 mx-auto"/>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No motorcycles found</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your search or filter to find what you're
                                looking for.</p>
                            <button
                                onClick={clearAllFilters}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Related Searches */}
            <RelatedSearches/>

            {/* Popular Brands */}
            <PopularBrands/>

            {/* Recently Viewed */}
            <RecentlyViewed/>

            {/* Dealer Showrooms */}
            <DealerShowrooms/>

            {/* Help & Support */}
            <HelpSupport/>
        </div>
    );
};

export default AllBikes;
