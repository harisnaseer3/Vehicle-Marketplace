import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaUser, FaEye, FaArrowRight, FaNewspaper, FaCar, FaMotorcycle, FaIndustry, FaCog } from 'react-icons/fa';
import axios from '@/axios.js';

const NewsPage = () => {
    const [articles, setArticles] = useState([]);
    const [featuredArticles, setFeaturedArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchNewsData = async () => {
            try {
                setLoading(true);
                
                // Fetch categories
                const categoriesResponse = await axios.get('news/categories');
                const categoriesData = Array.isArray(categoriesResponse.data.data) ? categoriesResponse.data.data : [];
                setCategories(categoriesData);
                
                // Fetch featured articles
                const featuredResponse = await axios.get('news/featured');
                const featuredData = Array.isArray(featuredResponse.data.data) ? featuredResponse.data.data : [];
                setFeaturedArticles(featuredData);
                
                // Fetch latest articles
                await fetchArticles();
                
            } catch (error) {
                setCategories([]);
                setFeaturedArticles([]);
                setArticles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNewsData();
    }, []);

    const fetchArticles = async (page = 1) => {
        try {
            const params = {
                page,
                per_page: 12,
                ...(searchTerm && { search: searchTerm }),
                ...(selectedCategory && { category: selectedCategory })
            };
            
            const response = await axios.get('news', { params });
            
            // Ensure we always set an array
            const articlesData = Array.isArray(response.data.data) ? response.data.data : [];
            setArticles(articlesData);
            setTotalPages(response.data.meta?.last_page || 1);
            setCurrentPage(page);
        } catch (error) {
            setArticles([]);
            setTotalPages(1);
        }
    };

    useEffect(() => {
        if (!loading) {
            fetchArticles(1);
        }
    }, [searchTerm, selectedCategory]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchArticles(1);
    };

    const handlePageChange = (page) => {
        fetchArticles(page);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCategoryIcon = (categoryName) => {
        switch (categoryName?.toLowerCase()) {
            case 'cars':
                return <FaCar className="w-4 h-4" />;
            case 'bikes':
                return <FaMotorcycle className="w-4 h-4" />;
            case 'industry':
                return <FaIndustry className="w-4 h-4" />;
            case 'technology':
                return <FaCog className="w-4 h-4" />;
            default:
                return <FaNewspaper className="w-4 h-4" />;
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
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Auto News & Insights</h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Stay updated with the latest automotive news, reviews, and industry insights from Pakistan and around the world.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Categories</option>
                            {Array.isArray(categories) && categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Featured Articles */}
                {Array.isArray(featuredArticles) && featuredArticles.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredArticles.map((article) => (
                                <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                    <div className="relative">
                                        <img
                                            src={article.featured_image ? `/storage/${article.featured_image}` : '/images/news-placeholder.jpg'}
                                            alt={article.title}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.target.src = '/images/news-placeholder.jpg';
                                            }}
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                                Featured
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center text-sm text-gray-600 mb-3">
                                            <div className="flex items-center mr-4">
                                                {getCategoryIcon(article.category?.name)}
                                                <span className="ml-1">{article.category?.name}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="w-3 h-3 mr-1" />
                                                <span>{formatDate(article.published_at)}</span>
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaUser className="w-3 h-3 mr-1" />
                                                <span>{article.author?.name}</span>
                                            </div>
                                            <Link
                                                to={`/news/${article.slug}`}
                                                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                                            >
                                                Read More
                                                <FaArrowRight className="w-3 h-3 ml-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Latest Articles */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(articles) && articles.map((article) => (
                            <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="relative">
                                    <img
                                        src={article.featured_image ? `/storage/${article.featured_image}` : '/images/news-placeholder.jpg'}
                                        alt={article.title}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = '/images/news-placeholder.jpg';
                                        }}
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center text-sm text-gray-600 mb-3">
                                        <div className="flex items-center mr-4">
                                            {getCategoryIcon(article.category?.name)}
                                            <span className="ml-1">{article.category?.name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="w-3 h-3 mr-1" />
                                            <span>{formatDate(article.published_at)}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FaUser className="w-3 h-3 mr-1" />
                                            <span>{article.author?.name}</span>
                                            <span className="mx-2">•</span>
                                            <FaEye className="w-3 h-3 mr-1" />
                                            <span>{article.views_count || 0}</span>
                                        </div>
                                        <Link
                                            to={`/news/${article.slug}`}
                                            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                                        >
                                            Read More
                                            <FaArrowRight className="w-3 h-3 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* No articles message */}
                    {Array.isArray(articles) && articles.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-4">No articles found</div>
                            <p className="text-gray-400">Try adjusting your search criteria or check back later for new content.</p>
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
                                                ? 'bg-blue-600 text-white'
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

export default NewsPage; 