import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaCar, FaMotorcycle, FaFilter, FaThumbsUp, FaComment, FaCalendarAlt, FaUser } from 'react-icons/fa';
import axios from '@/axios.js';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchReviewsData = async () => {
            try {
                setLoading(true);
                
                // Fetch categories
                const categoriesResponse = await axios.get('categories');
                setCategories(categoriesResponse.data.data || []);
                
                // Fetch latest reviews
                await fetchReviews();
                
            } catch (error) {
                console.error('Error fetching reviews data:', error);
                setCategories([]);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviewsData();
    }, []);

    const fetchReviews = async (page = 1) => {
        try {
            const params = {
                page,
                per_page: 12,
                ...(searchTerm && { search: searchTerm }),
                ...(selectedCategory && { category: selectedCategory }),
                ...(selectedRating && { rating: selectedRating })
            };
            
            const response = await axios.get('reviews', { params });
            
            const reviewsData = Array.isArray(response.data.data) ? response.data.data : [];

            setReviews(reviewsData);
            setTotalPages(response.data.meta?.last_page || 1);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
            setTotalPages(1);
        }
    };

    useEffect(() => {
        if (!loading) {
            fetchReviews(1);
        }
    }, [searchTerm, selectedCategory, selectedRating]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchReviews(1);
    };

    const handlePageChange = (page) => {
        fetchReviews(page);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FaStar
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    const getCategoryIcon = (categoryName) => {
        switch (categoryName?.toLowerCase()) {
            case 'cars':
                return <FaCar className="w-4 h-4" />;
            case 'bikes':
                return <FaMotorcycle className="w-4 h-4" />;
            default:
                return <FaCar className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Vehicle Reviews</h1>
                        <p className="text-xl text-green-100 max-w-2xl mx-auto">
                            Read authentic reviews from real buyers and sellers. Get insights from the community to make informed decisions.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search reviews by vehicle, brand, or model..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <FaFilter className="w-4 h-4 mr-2" />
                                Filters
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                                Search
                            </button>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">All Categories</option>
                                    {Array.isArray(categories) && categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={selectedRating}
                                    onChange={(e) => setSelectedRating(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">All Ratings</option>
                                    <option value="5">5 Stars</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="3">3+ Stars</option>
                                    <option value="2">2+ Stars</option>
                                    <option value="1">1+ Star</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory('');
                                        setSelectedRating('');
                                        setSearchTerm('');
                                    }}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Reviews Grid */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Latest Reviews</h2>
                        <Link
                            to="/reviews/write"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                            Write a Review
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Array.isArray(reviews) && reviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                                {/* Review Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <img
                                            src={review.reviewer?.image_url || '/images/default-profile.png'}
                                            alt={review.reviewer?.name}
                                            className="w-12 h-12 rounded-full mr-4"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{review.reviewer?.name}</h3>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaCalendarAlt className="w-3 h-3 mr-1" />
                                                <span>{formatDate(review.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        {renderStars(review.rating)}
                                        <span className="ml-2 text-sm font-medium text-gray-900">{review.rating}/5</span>
                                    </div>
                                </div>

                                {/* Vehicle Info */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <div className="flex items-center">
                                        {getCategoryIcon(review.post?.category?.name)}
                                        <span className="ml-2 font-medium text-gray-900">
                                            {review.post?.make?.name} {review.post?.model?.name}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {review.post?.year} • {review.post?.mileage?.toLocaleString()} km
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                </div>

                                {/* Review Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
                                            <FaThumbsUp className="w-4 h-4 mr-1" />
                                            <span className="text-sm">Helpful ({review.helpful_count || 0})</span>
                                        </button>
                                        <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                                            <FaComment className="w-4 h-4 mr-1" />
                                            <span className="text-sm">Reply</span>
                                        </button>
                                    </div>
                                    <Link
                                        to={`/${review.post?.category?.name === 'Bikes' ? 'bike' : 'vehicle'}/${review.post?.id}`}
                                        className="text-green-600 hover:text-green-700 font-medium text-sm"
                                    >
                                        View Vehicle
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* No reviews message */}
                    {Array.isArray(reviews) && reviews.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-4">No reviews found</div>
                            <p className="text-gray-400 mb-6">Try adjusting your search criteria or be the first to write a review!</p>
                            <Link
                                to="/reviews/write"
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                                Write Your First Review
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <nav className="flex items-center space-x-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                                            currentPage === page
                                                ? 'bg-green-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewsPage; 