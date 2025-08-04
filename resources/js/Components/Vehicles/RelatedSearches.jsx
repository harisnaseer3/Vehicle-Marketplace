import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaArrowRight } from 'react-icons/fa';

const RelatedSearches = ({ category = 'vehicles' }) => {
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

    const searches = category === 'bikes' ? bikeSearches : vehicleSearches;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <FaSearch className="text-blue-600 mr-3 text-xl" />
                    <h3 className="text-xl font-semibold text-gray-900">Related Searches</h3>
                </div>
                <Link 
                    to={`/${category}`}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                    View All <FaArrowRight className="ml-1" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {searches.map((search, index) => (
                    <Link
                        key={index}
                        to={`/${category}?search=${encodeURIComponent(search.text)}`}
                        className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
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
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedSearches; 