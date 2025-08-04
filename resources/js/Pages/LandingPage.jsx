import { Link } from 'react-router-dom';
import { 
    FaCar, 
    FaSearch, 
    FaShieldAlt, 
    FaExchangeAlt, 
    FaStar, 
    FaUsers, 
    FaCheckCircle, 
    FaPhone, 
    FaEnvelope, 
    FaMapMarkerAlt,
    FaMotorcycle,
    FaTruck,
    FaTools,
    FaHandshake,
    FaClock,
    FaAward,
    FaHeart,
    FaEye,
    FaThumbsUp
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Navbar from "@/Components/Navbar.jsx";
import FeaturedVehicles from "@/Components/Vehicles/FeaturedVehicles.jsx";
import Search from "@/Components/Vehicles/Search/Search.jsx"
import FeaturedBikes from "@/Components/Vehicles/FeaturedBikes.jsx";

const LandingPage = ({ auth }) => {
    const [stats, setStats] = useState({
        vehicles: 0,
        users: 0,
        deals: 0,
        satisfaction: 0
    });

    const [testimonials] = useState([
        {
            id: 1,
            name: "Ahmed Khan",
            role: "Car Buyer",
            image: "/images/default-profile.png",
            content: "Found my dream car within a week! The verification process gave me confidence in the purchase.",
            rating: 5
        },
        {
            id: 2,
            name: "Sara Ahmed",
            role: "Car Seller",
            image: "/images/default-profile.png",
            content: "Sold my car in just 3 days. The platform is incredibly user-friendly and secure.",
            rating: 5
        },
        {
            id: 3,
            name: "Muhammad Ali",
            role: "Dealer",
            image: "/images/default-profile.png",
            content: "As a dealer, AutoMarket has helped me reach more customers and increase my sales significantly.",
            rating: 5
        }
    ]);

    const [categories] = useState([
        {
            id: 1,
            name: "Cars",
            icon: FaCar,
            count: "2,500+",
            description: "Sedans, SUVs, Hatchbacks",
            color: "bg-blue-500",
            link: "/vehicles"
        },
        {
            id: 2,
            name: "Motorcycles",
            icon: FaMotorcycle,
            count: "1,200+",
            description: "Sports, Cruisers, Scooters",
            color: "bg-red-500",
            link: "/bikes"
        },
        {
            id: 3,
            name: "Commercial",
            icon: FaTruck,
            count: "800+",
            description: "Trucks, Vans, Pickups",
            color: "bg-green-500",
            link: "/vehicles?category=commercial"
        },
        {
            id: 4,
            name: "Auto Parts",
            icon: FaTools,
            count: "5,000+",
            description: "Spare parts & accessories",
            color: "bg-purple-500",
            link: "/autoparts"
        }
    ]);

    const [howItWorks] = useState([
        {
            step: 1,
            title: "Search & Browse",
            description: "Use our advanced search filters to find your perfect vehicle from thousands of listings.",
            icon: FaSearch
        },
        {
            step: 2,
            title: "Contact Seller",
            description: "Get in touch with sellers directly through our secure messaging system.",
            icon: FaPhone
        },
        {
            step: 3,
            title: "Inspect & Verify",
            description: "Schedule inspections and verify vehicle details with our trusted partners.",
            icon: FaCheckCircle
        },
        {
            step: 4,
            title: "Complete Deal",
            description: "Complete your transaction safely with our secure payment and documentation system.",
            icon: FaHandshake
        }
    ]);

    useEffect(() => {
        // Simulate loading stats
        const timer = setTimeout(() => {
            setStats({
                vehicles: 4500,
                users: 25000,
                deals: 12000,
                satisfaction: 98
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FaStar 
                key={i} 
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            />
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar auth={auth}/>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
                            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                                <div className="sm:text-center lg:text-left">
                                    <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                                        <span className="block">Pakistan's #1</span>
                                        <span className="block text-blue-400">Vehicle Marketplace</span>
                                    </h1>
                                    <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                        Discover, buy, and sell vehicles with confidence. Join over 25,000 satisfied users who trust AutoMarket for their automotive needs.
                                    </p>
                                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                        <div className="rounded-md shadow">
                                            <Link
                                                to="/vehicles"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition duration-300"
                                            >
                                                Browse Vehicles
                                            </Link>
                                        </div>
                                        <div className="mt-3 sm:mt-0 sm:ml-3">
                                            <Link
                                                to="/post/create"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 transition duration-300"
                                            >
                                                Sell Your Vehicle
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                        src="/images/hero-car.jpg"
                        alt="Featured vehicle"
                    />
                </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 z-20 relative">
                <Search isCompact={true}/>
            </div>

            {/* Statistics Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            AutoMarket by the Numbers
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                            Trusted by thousands of users across Pakistan
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {stats.vehicles.toLocaleString()}+
                            </div>
                            <div className="text-gray-600">Vehicles Listed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {stats.users.toLocaleString()}+
                            </div>
                            <div className="text-gray-600">Happy Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {stats.deals.toLocaleString()}+
                            </div>
                            <div className="text-gray-600">Successful Deals</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {stats.satisfaction}%
                            </div>
                            <div className="text-gray-600">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Showcase */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Explore by Category
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                            Find exactly what you're looking for in our comprehensive vehicle categories
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                                <Link
                                    key={category.id}
                                    to={category.link}
                                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 group"
                                >
                                    <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className="text-white text-xl" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                                    <p className="text-gray-600 mb-3">{category.description}</p>
                                    <div className="text-blue-600 font-semibold">{category.count} listings</div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Featured vehicles */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FeaturedVehicles isHomePage={true}/>
                </div>
            </div>

            {/* Featured bikes section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FeaturedBikes isHomePage={true} />
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            How AutoMarket Works
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                            Simple steps to buy or sell your vehicle with confidence
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((step) => {
                            const IconComponent = step.icon;
                            return (
                                <div key={step.step} className="text-center">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <IconComponent className="text-white text-2xl" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">
                                            {step.step}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            What Our Users Say
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                            Real stories from satisfied buyers and sellers
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center mb-4">
                                    <img
                                        className="w-12 h-12 rounded-full mr-4"
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex mb-4">
                                    {renderStars(testimonial.rating)}
                                </div>
                                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Why Choose AutoMarket
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                            We make buying and selling vehicles simple and trustworthy
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="text-center group">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <FaShieldAlt className="h-8 w-8"/>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Verified Listings</h3>
                            <p className="text-base text-gray-600">
                                Every vehicle goes through our comprehensive verification process to ensure quality and authenticity.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-500 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <FaExchangeAlt className="h-8 w-8"/>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Secure Transactions</h3>
                            <p className="text-base text-gray-600">
                                Our platform ensures safe and secure transactions with buyer and seller protection.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-500 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <FaCar className="h-8 w-8"/>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Wide Selection</h3>
                            <p className="text-base text-gray-600">
                                Browse through thousands of quality vehicles from trusted sellers across Pakistan.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-500 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <FaStar className="h-8 w-8"/>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">24/7 Support</h3>
                            <p className="text-base text-gray-600">
                                Our dedicated customer support team is here to help you every step of the way.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Highlight */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                                Advanced Features for Smart Buyers
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <FaCheckCircle className="text-green-500 w-5 h-5 mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Advanced Search Filters</h3>
                                        <p className="text-gray-600">Find your perfect vehicle with detailed filters for price, year, mileage, and more.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaCheckCircle className="text-green-500 w-5 h-5 mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Vehicle History Reports</h3>
                                        <p className="text-gray-600">Get comprehensive vehicle history including accidents, maintenance, and ownership.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaCheckCircle className="text-green-500 w-5 h-5 mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Price Comparison</h3>
                                        <p className="text-gray-600">Compare prices across similar vehicles to get the best deal.</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FaCheckCircle className="text-green-500 w-5 h-5 mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Secure Messaging</h3>
                                        <p className="text-gray-600">Communicate safely with sellers through our secure messaging system.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="text-center">
                                <FaAward className="text-yellow-500 w-16 h-16 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Trusted by 25,000+ Users</h3>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-600">98%</div>
                                        <div className="text-gray-600">Satisfaction Rate</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-blue-600">4.8/5</div>
                                        <div className="text-gray-600">User Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
                        <span className="block">Ready to find your dream vehicle?</span>
                        <span className="block">Join AutoMarket today!</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-blue-100 mb-8">
                        Join thousands of satisfied buyers and sellers on Pakistan's most trusted vehicle marketplace.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition duration-300"
                        >
                            Sign up for free
                        </Link>
                        <Link
                            to="/vehicles"
                            className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 transition duration-300"
                        >
                            Browse Vehicles
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <FaCar className="h-8 w-8 text-red-600"/>
                                <span className="ml-2 text-2xl font-bold">AutoMarket</span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Pakistan's leading vehicle marketplace connecting buyers and sellers nationwide.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link to="/vehicles" className="text-gray-400 hover:text-white">Browse Cars</Link></li>
                                <li><Link to="/bikes" className="text-gray-400 hover:text-white">Browse Bikes</Link></li>
                                <li><Link to="/post/create" className="text-gray-400 hover:text-white">Sell Vehicle</Link></li>
                                <li><Link to="/search" className="text-gray-400 hover:text-white">Advanced Search</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Safety Tips</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Report Issue</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                            <div className="space-y-2 text-gray-400">
                                <div className="flex items-center">
                                    <FaPhone className="w-4 h-4 mr-2" />
                                    <span>+92 300 1234567</span>
                                </div>
                                <div className="flex items-center">
                                    <FaEnvelope className="w-4 h-4 mr-2" />
                                    <span>info@automarket.pk</span>
                                </div>
                                <div className="flex items-center">
                                    <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                    <span>Lahore, Pakistan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 AutoMarket. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
