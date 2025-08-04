import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaCar, FaMotorcycle, FaArrowLeft, FaCheck } from 'react-icons/fa';
import axios from '@/axios.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

const WriteReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`posts/${id}`);
                setVehicle(response.data.data);
            } catch (error) {
                console.error('Error fetching vehicle:', error);
                navigate('/reviews');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchVehicle();
        }
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        const newErrors = {};
        if (rating === 0) newErrors.rating = 'Please select a rating';
        if (!title.trim()) newErrors.title = 'Please enter a review title';
        if (!comment.trim()) newErrors.comment = 'Please enter your review';
        if (comment.trim().length < 10) newErrors.comment = 'Review must be at least 10 characters';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setSubmitting(true);
            await axios.post('reviews', {
                post_id: id,
                rating,
                title: title.trim(),
                comment: comment.trim()
            });

            // Redirect to reviews page with success message
            navigate('/reviews', { 
                state: { message: 'Review submitted successfully!' }
            });
        } catch (error) {
            console.error('Error submitting review:', error);
            setErrors({ submit: 'Failed to submit review. Please try again.' });
        } finally {
            setSubmitting(false);
        }
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Vehicle not found</h2>
                    <Link
                        to="/reviews"
                        className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Back to Reviews
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center mb-6">
                        <Link
                            to="/reviews"
                            className="flex items-center text-green-100 hover:text-white mr-4"
                        >
                            <FaArrowLeft className="w-4 h-4 mr-2" />
                            Back to Reviews
                        </Link>
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
                        <p className="text-green-100">
                            Share your experience with the community
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Vehicle Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    {getCategoryIcon(vehicle.category?.name)}
                                    <span className="ml-2 text-sm text-gray-600">{vehicle.category?.name}</span>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {vehicle.make?.name} {vehicle.model?.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">{vehicle.year}</p>
                                </div>

                                {vehicle.images && vehicle.images.length > 0 && (
                                    <img
                                        src={`/storage/${vehicle.images[0]}`}
                                        alt={vehicle.title}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                )}

                                <div className="text-sm text-gray-600">
                                    <p>Mileage: {vehicle.mileage?.toLocaleString()} km</p>
                                    <p>Price: Rs. {vehicle.price?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Review Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Your Rating *
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none"
                                            >
                                                <FaStar
                                                    className={`w-8 h-8 ${
                                                        star <= (hoverRating || rating)
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-3 text-sm text-gray-600">
                                            {rating > 0 && `${rating} out of 5 stars`}
                                        </span>
                                    </div>
                                    {errors.rating && (
                                        <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                                    )}
                                </div>

                                {/* Review Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                        Review Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Summarize your experience in a few words"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.title ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Review Comment */}
                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Review *
                                    </label>
                                    <textarea
                                        id="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={6}
                                        placeholder="Share your detailed experience with this vehicle. What did you like? What could be improved?"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                            errors.comment ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        {errors.comment && (
                                            <p className="text-sm text-red-600">{errors.comment}</p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            {comment.length}/500 characters
                                        </p>
                                    </div>
                                </div>

                                {/* Submit Error */}
                                {errors.submit && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-sm text-red-600">{errors.submit}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                    <Link
                                        to="/reviews"
                                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheck className="w-4 h-4 mr-2" />
                                                Submit Review
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WriteReview; 