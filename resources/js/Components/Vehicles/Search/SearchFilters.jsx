import { FaFilter } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from '@/axios.js';

const SearchFilters = ({ onFilterChange, initialValues }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [transmissions, setTransmissions] = useState([]);
    const [loadingMakes, setLoadingMakes] = useState(false);
    const [loadingModels, setLoadingModels] = useState(false);

    // Fetch makes on component mount
    useEffect(() => {
        const fetchMakes = async () => {
            setLoadingMakes(true);
            try {
                const response = await axios.get('/makes/1');
                setMakes(response.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch makes:", err);
                setMakes([]);
            } finally {
                setLoadingMakes(false);
            }
        };
        fetchMakes();
    }, []);

    // Fetch models when make is selected
    useEffect(() => {
        if (!initialValues.makeId) {
            setModels([]);
            return;
        }

        const fetchModels = async () => {
            setLoadingModels(true);
            try {
                const response = await axios.get(`/makes/${initialValues.makeId}/models`);
                setModels(response.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch models:", err);
                setModels([]);
            } finally {
                setLoadingModels(false);
            }
        };
        fetchModels();
    }, [initialValues.makeId]);

    // Fetch transmission types
    useEffect(() => {
        const fetchTransmissions = async () => {
            try {
                const response = await axios.get('/transmission-types');
                setTransmissions(response.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch transmissions:", err);
                setTransmissions([]);
            }
        };
        fetchTransmissions();
    }, []);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium mb-4">Refine Search</h3>

            {/* Price Range */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (PKR)</label>
                <div className="flex space-x-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={initialValues.minPrice || ''}
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => onFilterChange('minPrice', e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={initialValues.maxPrice || ''}
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                    />
                </div>
            </div>

            {/* Year */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                    type="number"
                    placeholder="Any year"
                    value={initialValues.year || ''}
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => onFilterChange('year', e.target.value)}
                />
            </div>

            {/* Advanced Filters Toggle */}
            <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="mt-4 flex items-center text-blue-600 text-sm"
            >
                <FaFilter className="mr-1" />
                {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
            </button>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Mileage */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
                        <input
                            type="number"
                            placeholder="Max mileage"
                            value={initialValues.maxMileage || ''}
                            className="w-full p-2 border rounded-md"
                            onChange={(e) => onFilterChange('maxMileage', e.target.value)}
                        />
                    </div>

                    {/* Transmission */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                        <select
                            value={initialValues.transmission || ''}
                            className="w-full p-2 border rounded-md"
                            onChange={(e) => onFilterChange('transmission', e.target.value)}
                        >
                            <option value="">Any</option>
                            {transmissions.map(transmission => (
                                <option key={transmission.id} value={transmission.value}>
                                    {transmission.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

SearchFilters.defaultProps = {
    initialValues: {
        makeId: '',
        makeName: '',
        modelId: '',
        modelName: '',
        minPrice: '',
        maxPrice: '',
        year: '',
        maxMileage: '',
        transmission: ''
    }
};

export default SearchFilters;
