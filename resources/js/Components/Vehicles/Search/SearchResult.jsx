import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VehicleCard from '@/Components/Vehicles/VehicleCard.jsx';
import SearchFilters from '@/Components/Vehicles/Search/SearchFilters.jsx';
import axios from '@/axios.js';
import { FaSpinner } from "react-icons/fa";

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        makeId: '',
        makeName: '',
        modelId: '',
        modelName: '',
        bodyType: '',
        fuelType: '',
        minPrice: '',
        maxPrice: '',
        year: '',
        maxMileage: '',
        transmission: ''
    });

    // Initialize search from URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchQuery(params.get('search') || '');
    }, [location.search]);

    // Fetch makes on mount
    useEffect(() => {
        const fetchMakes = async () => {
            try {
                const response = await axios.get('/makes/1');
                setMakes(response.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch makes:", err);
                setMakes([]);
            }
        };
        fetchMakes();
    }, []);

    // Initialize filters after makes are loaded
    useEffect(() => {
        if (makes.length === 0) return;

        const params = new URLSearchParams(location.search);
        const makeName = params.get('make');
        const makeId = makeName ? makes.find(m => m.name === makeName)?.id || '' : '';

        const modelName = params.get('model');
        let modelId = '';
        if (makeId && modelName) {
            const makeModels = models.filter(m => m.make_id == makeId);
            modelId = makeModels.find(m => m.name === modelName)?.id || '';
        }

        setFilters({
            makeId,
            makeName: makeName || '',
            modelId,
            modelName: modelName || '',
            minPrice: params.get('min_price') || '',
            maxPrice: params.get('max_price') || '',
            year: params.get('year') || '',
            maxMileage: params.get('max_mileage') || '',
            transmission: params.get('transmission') || '',
            bodyType: params.get('body_type') || '',
            fuelType: params.get('fuel_type') || ''
        });

        setIsInitialLoad(false);
    }, [location.search, makes, models]);

    // Fetch models when make is selected
    useEffect(() => {
        if (!filters.makeId) {
            setModels([]);
            return;
        }

        const fetchModels = async () => {
            try {
                const response = await axios.get(`/makes/${filters.makeId}/models`);
                setModels(response.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch models:", err);
                setModels([]);
            }
        };
        fetchModels();
    }, [filters.makeId]);

    // Fetch vehicles when filters or search query change
    useEffect(() => {
        if (isInitialLoad) return;

        const fetchResults = async () => {
            try {
                setLoading(true);
                setError(null);
                let response;

                if (searchQuery) {
                    // Simple search
                    response = await axios.get(`/vehicle/simple-search?search=${encodeURIComponent(searchQuery)}`);
                } else {
                    // Advanced search
                    const params = new URLSearchParams();
                    if (filters.makeId) params.append('make_id', filters.makeId);
                    if (filters.modelId) params.append('model_id', filters.modelId);
                    if (filters.minPrice) params.append('min_price', filters.minPrice);
                    if (filters.maxPrice) params.append('max_price', filters.maxPrice);
                    if (filters.year) params.append('year', filters.year);
                    if (filters.maxMileage) params.append('max_mileage', filters.maxMileage);
                    if (filters.transmission) params.append('transmission', filters.transmission);
                    if (filters.bodyType) params.append('body_type', filters.bodyType);
                    if (filters.fuelType) params.append('fuel_type', filters.fuelType);

                    response = await axios.get(`/vehicle/search?${params.toString()}`);
                }

                if (response.data?.success) {
                    setVehicles(response.data.data?.data ?? []);
                } else {
                    throw new Error(response.data?.message || 'Unknown error');
                }
            } catch (err) {
                setError(err.message || "Failed to load results. Please try again.");
                setVehicles([]);
                console.error("API Error:", err);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounceTimer);
    }, [filters, searchQuery, isInitialLoad]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        setSearchQuery(''); // Clear simple search when using filters

        // Update URL
        const params = new URLSearchParams();
        if (newFilters.makeId) {
            params.append('make_id', newFilters.makeId);
            params.append('make', newFilters.makeName);
        }
        if (newFilters.modelId) {
            params.append('model_id', newFilters.modelId);
            params.append('model', newFilters.modelName);
        }
        if (newFilters.minPrice) params.append('min_price', newFilters.minPrice);
        if (newFilters.maxPrice) params.append('max_price', newFilters.maxPrice);
        if (newFilters.year) params.append('year', newFilters.year);
        if (newFilters.maxMileage) params.append('max_mileage', newFilters.maxMileage);
        if (newFilters.transmission) params.append('transmission', newFilters.transmission);
        if (newFilters.bodyType) params.append('body_type', newFilters.bodyType);
        if (newFilters.fuelType) params.append('fuel_type', newFilters.fuelType);

        navigate(`?${params.toString()}`, { replace: true });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">
                {searchQuery
                    ? `Results for "${searchQuery}"`
                    : filters.makeName || filters.modelName
                        ? `Results for ${filters.makeName ? filters.makeName + ' ' : ''}${filters.modelName || ''}`
                        : 'All Vehicles'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Filters Sidebar - Hide when simple search is active */}
                {!searchQuery && (
                    <div className="md:col-span-1">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="font-medium mb-4">Filters</h3>
                            <SearchFilters
                                onFilterChange={handleFilterChange}
                                initialValues={{
                                    makeId: filters.makeId,
                                    makeName: filters.makeName,
                                    modelId: filters.modelId,
                                    modelName: filters.modelName,
                                    minPrice: filters.minPrice,
                                    maxPrice: filters.maxPrice,
                                    year: filters.year,
                                    maxMileage: filters.maxMileage,
                                    transmission: filters.transmission,
                                    bodyType: filters.bodyType,
                                    fuelType: filters.fuelType
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Results */}
                <div className={`${searchQuery ? 'md:col-span-4' : 'md:col-span-3'}`}>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                            <button
                                onClick={() => window.location.reload()}
                                className="ml-4 text-blue-600 hover:text-blue-800"
                            >
                                Retry
                            </button>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchQuery
                                    ? `No vehicles found for "${searchQuery}"`
                                    : 'No vehicles found matching your criteria'}
                            </p>
                            <button
                                onClick={() => navigate('/vehicles')}
                                className="mt-4 text-blue-600 hover:text-blue-800"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-500 mb-4">
                                Showing {vehicles.length} results
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vehicles
                                    .filter(vehicle => vehicle !== null && vehicle !== undefined)
                                    .map(vehicle => (
                                        <VehicleCard
                                            key={vehicle.id}
                                            {...vehicle}
                                            images={vehicle.images?.map(img => `/storage/${img}`) || []}
                                        />
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
