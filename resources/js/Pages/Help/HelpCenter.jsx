import React from 'react';
import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaHeadset, FaBook, FaComments, FaPhone, FaEnvelope, FaWhatsapp, FaSearch } from 'react-icons/fa';

const HelpCenter = () => {
    const helpTopics = [
        {
            title: 'How to Buy a Vehicle',
            description: 'Step-by-step guide to purchasing your dream vehicle',
            icon: FaBook,
            link: '/help/buying-guide'
        },
        {
            title: 'Selling Your Vehicle',
            description: 'Tips and tricks for selling your vehicle quickly',
            icon: FaComments,
            link: '/help/selling-guide'
        },
        {
            title: 'Vehicle Financing',
            description: 'Learn about financing options and requirements',
            icon: FaBook,
            link: '/help/financing'
        },
        {
            title: 'Vehicle Inspection',
            description: 'How to inspect a vehicle before buying',
            icon: FaBook,
            link: '/help/inspection-guide'
        }
    ];

    const contactMethods = [
        {
            title: 'Call Us',
            description: '+92 300 1234567',
            icon: FaPhone,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Email Support',
            description: 'support@vehiclemarketplace.com',
            icon: FaEnvelope,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'WhatsApp',
            description: '+92 300 1234567',
            icon: FaWhatsapp,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <FaHeadset className="text-4xl" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                            Get help with buying, selling, and managing your vehicles. 
                            Our support team is here to assist you every step of the way.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                            type="text"
                            placeholder="Search for help topics..."
                            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Help Topics */}
                    <div>
                        <div className="flex items-center mb-8">
                            <FaQuestionCircle className="text-blue-600 mr-3 text-2xl" />
                            <h2 className="text-2xl font-bold text-gray-900">Help Topics</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {helpTopics.map((topic, index) => (
                                <Link
                                    key={index}
                                    to={topic.link}
                                    className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="flex items-start">
                                        <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                            <topic.icon className="text-blue-600 w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.title}</h3>
                                            <p className="text-gray-600">{topic.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div>
                        <div className="flex items-center mb-8">
                            <FaHeadset className="text-blue-600 mr-3 text-2xl" />
                            <h2 className="text-2xl font-bold text-gray-900">Contact Support</h2>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            {contactMethods.map((method, index) => (
                                <div key={index} className="p-6 bg-white rounded-lg border border-gray-200">
                                    <div className="flex items-center">
                                        <div className={`p-4 rounded-lg mr-4 ${method.bgColor}`}>
                                            <method.icon className={`w-6 h-6 ${method.color}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{method.title}</h3>
                                            <p className="text-gray-600">{method.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 bg-blue-600 rounded-lg text-white">
                            <h3 className="text-xl font-semibold mb-3">Live Chat Available</h3>
                            <p className="text-blue-100 mb-4">
                                Chat with our experts in real-time for instant assistance. 
                                Available 24/7 for urgent inquiries.
                            </p>
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200">
                                Start Chat Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            to="/help/faq"
                            className="text-center p-8 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                        >
                            <FaQuestionCircle className="text-blue-600 text-4xl mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">FAQ</h3>
                            <p className="text-gray-600">Find quick answers to common questions</p>
                        </Link>
                        
                        <Link
                            to="/help/contact"
                            className="text-center p-8 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                        >
                            <FaEnvelope className="text-blue-600 text-4xl mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Us</h3>
                            <p className="text-gray-600">Get in touch with our support team</p>
                        </Link>
                        
                        <Link
                            to="/help/feedback"
                            className="text-center p-8 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                        >
                            <FaComments className="text-blue-600 text-4xl mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Feedback</h3>
                            <p className="text-gray-600">Share your thoughts and suggestions</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter; 