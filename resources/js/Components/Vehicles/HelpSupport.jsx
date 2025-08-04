import React from 'react';
import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaHeadset, FaBook, FaComments, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const HelpSupport = () => {
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                    <FaHeadset className="text-blue-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Our support team is here to help you find the perfect vehicle or sell your current one. 
                    Get expert advice and assistance anytime.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Help Topics */}
                <div>
                    <div className="flex items-center mb-6">
                        <FaQuestionCircle className="text-blue-600 mr-3 text-xl" />
                        <h4 className="text-xl font-semibold text-gray-900">Help Topics</h4>
                    </div>
                    
                    <div className="space-y-4">
                        {helpTopics.map((topic, index) => (
                            <Link
                                key={index}
                                to={topic.link}
                                className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-start">
                                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                                        <topic.icon className="text-blue-600 w-5 h-5" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-900 mb-1">{topic.title}</h5>
                                        <p className="text-sm text-gray-600">{topic.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Contact Methods */}
                <div>
                    <div className="flex items-center mb-6">
                        <FaHeadset className="text-blue-600 mr-3 text-xl" />
                        <h4 className="text-xl font-semibold text-gray-900">Contact Support</h4>
                    </div>
                    
                    <div className="space-y-4">
                        {contactMethods.map((method, index) => (
                            <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-lg mr-4 ${method.bgColor}`}>
                                        <method.icon className={`w-5 h-5 ${method.color}`} />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-900">{method.title}</h5>
                                        <p className="text-sm text-gray-600">{method.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-600 rounded-lg text-white">
                        <h5 className="font-semibold mb-2">Live Chat Available</h5>
                        <p className="text-sm text-blue-100 mb-3">
                            Chat with our experts in real-time for instant assistance
                        </p>
                        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200">
                            Start Chat
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/help/faq"
                        className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                        <FaQuestionCircle className="text-blue-600 text-2xl mx-auto mb-2" />
                        <h5 className="font-semibold text-gray-900">FAQ</h5>
                        <p className="text-sm text-gray-600">Find quick answers</p>
                    </Link>
                    
                    <Link
                        to="/help/contact"
                        className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                        <FaEnvelope className="text-blue-600 text-2xl mx-auto mb-2" />
                        <h5 className="font-semibold text-gray-900">Contact Us</h5>
                        <p className="text-sm text-gray-600">Get in touch</p>
                    </Link>
                    
                    <Link
                        to="/help/feedback"
                        className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                        <FaComments className="text-blue-600 text-2xl mx-auto mb-2" />
                        <h5 className="font-semibold text-gray-900">Feedback</h5>
                        <p className="text-sm text-gray-600">Share your thoughts</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport; 