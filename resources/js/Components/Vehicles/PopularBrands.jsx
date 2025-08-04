import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaMotorcycle, FaStar } from 'react-icons/fa';

const PopularBrands = ({ category = 'vehicles' }) => {
    const vehicleBrands = [
        { name: 'Toyota', logo: '/images/brands/toyota.png', count: '15,420', rating: 4.8 },
        { name: 'Honda', logo: '/images/brands/honda.png', count: '12,890', rating: 4.7 },
        { name: 'Suzuki', logo: '/images/brands/suzuki.png', count: '18,230', rating: 4.6 },
        { name: 'Daihatsu', logo: '/images/brands/daihatsu.png', count: '8,450', rating: 4.5 },
        { name: 'Nissan', logo: '/images/brands/nissan.png', count: '6,780', rating: 4.4 },
        { name: 'Mitsubishi', logo: '/images/brands/mitsubishi.png', count: '5,230', rating: 4.3 }
    ];

    const bikeBrands = [
        { name: 'Honda', logo: '/images/brands/honda-bike.png', count: '25,670', rating: 4.9 },
        { name: 'Yamaha', logo: '/images/brands/yamaha.png', count: '18,450', rating: 4.8 },
        { name: 'Suzuki', logo: '/images/brands/suzuki-bike.png', count: '12,890', rating: 4.7 },
        { name: 'United', logo: '/images/brands/united.png', count: '8,230', rating: 4.6 },
        { name: 'Road Prince', logo: '/images/brands/road-prince.png', count: '6,450', rating: 4.5 },
        { name: 'Super Power', logo: '/images/brands/super-power.png', count: '4,120', rating: 4.4 }
    ];

    const brands = category === 'bikes' ? bikeBrands : vehicleBrands;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    {category === 'bikes' ? (
                        <FaMotorcycle className="text-red-600 mr-3 text-xl" />
                    ) : (
                        <FaCar className="text-blue-600 mr-3 text-xl" />
                    )}
                    <h3 className="text-xl font-semibold text-gray-900">Popular Brands</h3>
                </div>
                <Link 
                    to={`/${category}/brands`}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                    View All Brands
                </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {brands.map((brand, index) => (
                    <Link
                        key={index}
                        to={`/${category}?brand=${encodeURIComponent(brand.name)}`}
                        className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-center"
                    >
                        <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-600">
                                {brand.name.charAt(0)}
                            </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {brand.name}
                        </h4>
                        <div className="flex items-center justify-center mt-2">
                            <FaStar className="text-yellow-400 w-4 h-4" />
                            <span className="text-sm text-gray-600 ml-1">{brand.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {brand.count} listings
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default PopularBrands; 