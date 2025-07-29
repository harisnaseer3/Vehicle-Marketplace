import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSpinner } from 'react-icons/fa';
import VehicleCard from "@/Components/Vehicles/VehicleCard.jsx";
import { Link, useLocation } from "react-router-dom";
import axios from '@/axios.js';

const Search = ({ isCompact = false, categoryId = 1 }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // State for search filters with URL parameter initialization
    const [filters, setFilters] = useState({
        make: queryParams.get('make') || '',
        model: queryParams.get('model') || '',
        min_price: queryParams.get('min_price') || '',
        max_price: queryParams.get('max_price') || '',
        year: queryParams.get('year') || '',
    });

    // State for API data
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [isLoadingMakes, setIsLoadingMakes] = useState(false);
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    // Price ranges in PKR
    const priceRanges = [
        { label: "Under PKR 1,000,000", value: "0-1000000" },
        { label: "PKR 1,000,000 - 3,000,000", value: "1000000-3000000" },
        { label: "PKR 3,000,000 - 5,000,000", value: "3000000-5000000" },
        { label: "Over PKR 5,000,000", value: "5000000-" }
    ];

    // Fetch makes on component mount
    useEffect(() => {
        const fetchMakes = async () => {
            setIsLoadingMakes(true);
            try {
                const response = await axios.get(`/makes/${categoryId}`, {
                });
                if (response.data && response.data.success) {
                    setMakes(response.data.data);
                } else {
                    console.error("Unexpected API response format", response.data);
                }
            } catch (error) {
                console.error("Error fetching makes:", error);
                // Handle error state if needed
            } finally {
                setIsLoadingMakes(false);
            }
        };
        fetchMakes();
    }, [categoryId]);

    // Fetch models when make is selected
    useEffect(() => {
        if (filters.make) {
            const fetchModels = async () => {
                setIsLoadingModels(true);
                try {
                    const selectedMake = makes.find(make => make.name === filters.make);
                    if (selectedMake) {
                        const response = await axios.get(`models/${selectedMake.id}`);
                        setModels(response.data.data);
                    }
                } catch (error) {
                    console.error("Error fetching models:", error);
                } finally {
                    setIsLoadingModels(false);
                }
            };
            fetchModels();
        } else {
            setModels([]);
            setFilters(prev => ({ ...prev, model: '' }));
        }
    }, [filters.make, makes]);

    // Handle price range selection
    const handlePriceRangeChange = (value) => {
        const [min, max] = value.split('-');
        setFilters(prev => ({
            ...prev,
            min_price: min || '',
            max_price: max || ''
        }));
    };


    // Format price in PKR
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            maximumFractionDigits: 0
        }).format(price).replace('PKR', 'PKR ');
    };

    if (isCompact) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 z-20 relative">
                <div className="bg-white shadow-xl rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Find Your Vehicle</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Make</label>
                            <select
                                name="make"
                                value={filters.make}
                                onChange={(e) => setFilters({...filters, make: e.target.value, model: ''})}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                disabled={isLoadingMakes}
                            >
                                <option value="">All Makes</option>
                                {makes.map(make => (
                                    <option key={make.id} value={make.name}>{make.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Model</label>
                            <select
                                name="model"
                                value={filters.model}
                                onChange={(e) => setFilters({...filters, model: e.target.value})}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                disabled={!filters.make || isLoadingModels}
                            >
                                <option value="">All Models</option>
                                {models.map(model => (
                                    <option key={model.id} value={model.name}>{model.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price Range</label>
                            <select
                                value={`${filters.min_price}-${filters.max_price}`}
                                onChange={(e) => handlePriceRangeChange(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="-">Any Price</option>
                                {priceRanges.map((range, index) => (
                                    <option key={index} value={range.value}>{range.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Link
                                to={`/vehicles/search?make=${filters.make}&model=${filters.model}&minPrice=${filters.min_price}&maxPrice=${filters.max_price}`}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
                            >
                                <FaSearch className="mr-2" />
                                Search
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    }
export default Search;
