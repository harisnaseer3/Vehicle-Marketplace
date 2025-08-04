import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaEye, FaShare, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaHeart, FaComment } from 'react-icons/fa';
import axios from '@/axios.js';

const ArticleDetail = () => {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showShareMenu, setShowShareMenu] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`news/${slug}`);
                setArticle(response.data.data);
                
                // Fetch related articles
                if (response.data.data.category_id) {
                    const relatedResponse = await axios.get('news/related', {
                        params: { 
                            category_id: response.data.data.category_id,
                            exclude_id: response.data.data.id,
                            limit: 3
                        }
                    });
                    setRelatedArticles(relatedResponse.data.data || []);
                }
            } catch (error) {
                console.error('Error fetching article:', error);
                setError('Article not found');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    const handleShare = (platform) => {
        const url = window.location.href;
        const title = article?.title || '';
        const text = article?.excerpt || '';

        let shareUrl = '';
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
                break;
            default:
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
        setShowShareMenu(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">{error || 'Article not found'}</h2>
                    <Link
                        to="/news"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to News
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                    <Link to="/news" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                                        News
                                    </Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                    </svg>
                                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                        {article.title}
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Article Header */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                            {article.featured_image && (
                                <img
                                    src={`/storage/${article.featured_image}`}
                                    alt={article.title}
                                    className="w-full h-64 md:h-96 object-cover"
                                />
                            )}
                            <div className="p-6">
                                <div className="flex items-center text-sm text-gray-600 mb-4">
                                    <div className="flex items-center mr-4">
                                        <FaCalendarAlt className="w-4 h-4 mr-1" />
                                        <span>{formatDate(article.published_at)}</span>
                                    </div>
                                    <div className="flex items-center mr-4">
                                        <FaUser className="w-4 h-4 mr-1" />
                                        <span>{article.author?.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaEye className="w-4 h-4 mr-1" />
                                        <span>{article.views_count || 0} views</span>
                                    </div>
                                </div>

                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
                                
                                {article.excerpt && (
                                    <p className="text-lg text-gray-600 mb-6 italic">{article.excerpt}</p>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center text-gray-600 hover:text-red-500 transition-colors">
                                            <FaHeart className="w-4 h-4 mr-1" />
                                            <span>Like</span>
                                        </button>
                                        <button className="flex items-center text-gray-600 hover:text-blue-500 transition-colors">
                                            <FaComment className="w-4 h-4 mr-1" />
                                            <span>Comment</span>
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowShareMenu(!showShareMenu)}
                                            className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
                                        >
                                            <FaShare className="w-4 h-4 mr-1" />
                                            <span>Share</span>
                                        </button>
                                        
                                        {showShareMenu && (
                                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleShare('facebook')}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                    >
                                                        <FaFacebook className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare('twitter')}
                                                        className="p-2 text-blue-400 hover:bg-blue-50 rounded"
                                                    >
                                                        <FaTwitter className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare('linkedin')}
                                                        className="p-2 text-blue-700 hover:bg-blue-50 rounded"
                                                    >
                                                        <FaLinkedin className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare('whatsapp')}
                                                        className="p-2 text-green-500 hover:bg-green-50 rounded"
                                                    >
                                                        <FaWhatsapp className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <div 
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>

                        {/* Related Articles */}
                        {relatedArticles.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h2>
                                <div className="space-y-4">
                                    {relatedArticles.map((relatedArticle) => (
                                        <div key={relatedArticle.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <img
                                                src={relatedArticle.featured_image ? `/storage/${relatedArticle.featured_image}` : '/images/news-placeholder.jpg'}
                                                alt={relatedArticle.title}
                                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                    <Link to={`/news/${relatedArticle.slug}`} className="hover:text-blue-600">
                                                        {relatedArticle.title}
                                                    </Link>
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                                    {relatedArticle.excerpt}
                                                </p>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <FaCalendarAlt className="w-3 h-3 mr-1" />
                                                    <span>{formatDate(relatedArticle.published_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Info</h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-gray-600">Category:</span>
                                    <p className="font-medium">{article.category?.name}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Published:</span>
                                    <p className="font-medium">{formatDate(article.published_at)}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Author:</span>
                                    <p className="font-medium">{article.author?.name}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Views:</span>
                                    <p className="font-medium">{article.views_count || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest News</h3>
                            <div className="space-y-4">
                                {/* This would be populated with latest articles */}
                                <p className="text-gray-600 text-sm">Latest news articles will appear here.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail; 