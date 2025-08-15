import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowRight } from 'react-icons/fa';
import axios from "@/axios.js";

const RelatedSearches = ({ category = 'vehicles' }) => {
    const [searches, setSearches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fallback data
    const getFallbackData = (category) => {
        const vehicleSearches = [
            { text: 'Toyota Corolla 2020', count: '2,450' },
            { text: 'Honda Civic 2021', count: '1,890' },
            { text: 'Suzuki Swift 2019', count: '3,120' },
            { text: 'Toyota Hilux 2022', count: '980' },
            { text: 'Honda City 2020', count: '1,650' },
            { text: 'Suzuki Cultus 2021', count: '2,340' },
            { text: 'Toyota Vitz 2018', count: '1,780' },
            { text: 'Honda Vezel 2021', count: '890' }
        ];

        const bikeSearches = [
            { text: 'Honda CG 125', count: '1,230' },
            { text: 'Yamaha YBR 125', count: '980' },
            { text: 'Suzuki GS 150', count: '1,450' },
            { text: 'Honda CD 70', count: '2,100' },
            { text: 'Yamaha YB 100', count: '890' },
            { text: 'Suzuki GS 125', count: '1,120' },
            { text: 'Honda 125', count: '1,670' },
            { text: 'Yamaha 70', count: '750' }
        ];

        return category === 'bikes' ? bikeSearches : vehicleSearches;
    };

    const handleSearchClick = (searchTerm) => {
        navigate(`/vehicles/search?category=${category}&query=${encodeURIComponent(searchTerm)}`);
    };

    useEffect(() => {
        const fetchRelatedSearches = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/vehicle/simple-search?category=${category}&limit=8`);

                let data = response.data;
                if (data.results) data = data.results;
                if (!Array.isArray(data)) data = getFallbackData(category);

                const formattedData = data.map(item => ({
                    text: item.name || item.model || item.text || 'Unknown Vehicle',
                    count: item.count || item.results || '0'
                }));

                setSearches(formattedData);
                setError(null);
            } catch (err) {
                console.error('Error fetching related searches:', err);
                setError(err.message);
                setSearches(getFallbackData(category));
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedSearches();
    }, [category]);

    const displaySearches = Array.isArray(searches) ? searches : getFallbackData(category);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center mb-6">
                    <FaSearch className="text-blue-600 mr-3 text-xl" />
                    <h3 className="text-xl font-semibold text-gray-900">Loading related searches...</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <FaSearch className="text-blue-600 mr-3 text-xl" />
                    <h3 className="text-xl font-semibold text-gray-900">Related Searches</h3>
                </div>
                <button
                    onClick={() => navigate(`/${category}`)}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                    View All <FaArrowRight className="ml-1" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displaySearches.map((search, index) => (
                    <div
                        key={index}
                        onClick={() => handleSearchClick(search.text)}
                        className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                    {search.text}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {search.count} results
                                </p>
                            </div>
                            <FaArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedSearches;
