import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '@/axios.js';

const FeaturedBikes = ({ isHomePage = false }) => {
    const [bikeGroups, setBikeGroups] = useState({
        new: [],
        used: [],
        'certified-pre-owned': [],
        salvage: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndices, setCurrentIndices] = useState({
        new: 0,
        used: 0,
        'certified-pre-owned': 0,
        salvage: 0
    });

    useEffect(() => {
        const fetchFeaturedBikes = async () => {
            try {
                const response = await axios.get('/featured-bikes'); // Update endpoint

                if (response.data.success && response.data.data) {
                    setBikeGroups(response.data.data);
                } else {
                    throw new Error(response.data.message || 'Invalid data format received');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to load featured bikes');
                setLoading(false);
                console.error('API Error:', err.response?.data || err.message);
            }
        };

        fetchFeaturedBikes();
    }, []);

    const handlePrev = (condition) => {
        setCurrentIndices(prev => ({
            ...prev,
            [condition]: prev[condition] === 0 ?
                bikeGroups[condition].length - Math.min(4, bikeGroups[condition].length) :
                prev[condition] - 4
        }));
    };

    const handleNext = (condition) => {
        setCurrentIndices(prev => ({
            ...prev,
            [condition]: prev[condition] + 4 >= bikeGroups[condition].length ?
                0 :
                prev[condition] + 4
        }));
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

    const renderBikeGroup = (condition, title) => {
        const bikes = bikeGroups[condition] || [];
        const currentIndex = currentIndices[condition] || 0;

        const displayedBikes = isHomePage
            ? bikes.slice(currentIndex, currentIndex + 4)
            : bikes;

        if (displayedBikes.length === 0) return null;

        return (
            <div key={condition} className="mb-16">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        {title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-lg text-gray-600 mx-auto">
                        {condition === 'new' ? 'Brand new bikes ready for delivery' :
                            condition === 'used' ? 'Quality pre-owned bikes' :
                                condition === 'certified-pre-owned' ? 'Certified and inspected bikes' :
                                    'Salvage bikes available for repair'}
                    </p>
                </div>

                <div className="relative">
                    {isHomePage && bikes.length > 4 && (
                        <>
                            <button
                                onClick={() => handlePrev(condition)}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                                aria-label={`Previous ${condition} bikes`}
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleNext(condition)}
                                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                                aria-label={`Next ${condition} bikes`}
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    <div className={`grid gap-8 ${isHomePage ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
                        {displayedBikes.map((bike) => (
                            <div key={bike.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="h-48 bg-gray-200 overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={bike.images?.length ?
                                            `/storage/${bike.images[0]}` :
                                            '/images/bike-placeholder.jpg'
                                        }
                                        alt={`${bike.make?.name || 'Bike'} ${bike.model?.name || ''}`}
                                        onError={(e) => {
                                            e.target.src = '/images/bike-placeholder.jpg';
                                        }}
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {bike.make?.name} {bike.model?.name}
                                    </h3>
                                    <p className="text-gray-600">{bike.year}</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {bike.mileage?.toLocaleString()} km • {bike.color} • {bike.engine_size}cc
                                    </p>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-xl font-bold text-blue-600">
                                            Rs. {bike.price ? parseFloat(bike.price).toLocaleString() : 'N/A'}
                                        </span>
                                        <Link
                                            to={`/bike/${bike.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View All button for this specific bike condition */}
                    <div className="mt-8 text-center">
                        <Link
                            to={`/bikes?condition=${condition}&category=bikes`}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            View All {title}
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    const hasBikes = Object.values(bikeGroups).some(group => group.length > 0);

    return (
        <>
            {hasBikes ? (
                <>
                    {renderBikeGroup('new', 'New Bikes')}
                    {renderBikeGroup('used', 'Used Bikes')}
                    {/* Uncomment these when you have these categories */}
                    {/* {renderBikeGroup('certified-pre-owned', 'Certified Pre-Owned Bikes')} */}
                    {/* {renderBikeGroup('salvage', 'Salvage Bikes')} */}
                </>
            ) : (
                <div className="mt-12 text-center text-gray-500">
                    No featured bikes available at this time
                    <p className="mt-2 text-sm">
                        Check back later for new arrivals.
                    </p>
                </div>
            )}
        </>
    );
};

export default FeaturedBikes;
