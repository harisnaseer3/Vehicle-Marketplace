import { Link } from 'react-router-dom';
import { FaCar, FaSearch, FaShieldAlt, FaExchangeAlt, FaStar } from 'react-icons/fa';
import Navbar from "@/Components/Navbar.jsx";
import {useEffect} from "react";
import FeaturedVehicles from "@/Components/Vehicles/FeaturedVehicles.jsx";
import Search from "@/Components/Vehicles/Search/Search.jsx"
import FeaturedBikes from "@/Components/Vehicles/FeaturedBikes.jsx";

const LandingPage = ({ auth }) => {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <Navbar auth={auth}/>

            {/* Hero Section */}
            <div className="relative bg-gray-900 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="relative z-10 pb-8 bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
                            <div
                                className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                                <div className="sm:text-center lg:text-left">
                                    <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                                        <span className="block">Find your perfect</span>
                                        <span className="block text-blue-400">vehicle today</span>
                                    </h1>
                                    <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                        Browse thousands of quality used cars, trucks, and SUVs from trusted sellers
                                        across the country.
                                    </p>
                                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                        <div className="rounded-md shadow">
                                            <Link
                                                to="/vehicles"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                                            >
                                                Browse Vehicles
                                            </Link>
                                        </div>
                                        <div className="mt-3 sm:mt-0 sm:ml-3">
                                            <Link
                                                to="/post/create"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
                                            >
                                                Sell Your Car
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 z-20 relative">
                <Search isCompact={true}/>
            </div>


            {/* Featured vehicles */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Featured Vehicles
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                        Check out our selection of quality vehicles
                    </p>
                </div>

                <FeaturedVehicles isHomePage={true}/>
            </div>

            {/* Featured bikes section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Featured Bikes
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                        Check out our selection of quality motorcycles
                    </p>
                </div>

                <FeaturedBikes isHomePage={true} />
            </div>

            {/* Why Choose Us */}
            <div className="bg-gray-100 py-16">
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
                        <div className="text-center">
                            <div
                                className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                                <FaShieldAlt className="h-6 w-6"/>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Verified Listings</h3>
                            <p className="mt-2 text-base text-gray-600">
                                Every vehicle goes through our verification process to ensure quality.
                            </p>
                        </div>

                        <div className="text-center">
                            <div
                                className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                                <FaExchangeAlt className="h-6 w-6"/>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Easy Transactions</h3>
                            <p className="mt-2 text-base text-gray-600">
                                Our platform makes buying and selling vehicles hassle-free.
                            </p>
                        </div>

                        <div className="text-center">
                            <div
                                className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                                <FaCar className="h-6 w-6"/>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Wide Selection</h3>
                            <p className="mt-2 text-base text-gray-600">
                                Thousands of vehicles from trusted sellers across the country.
                            </p>
                        </div>

                        <div className="text-center">
                            <div
                                className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                                <FaStar className="h-6 w-6"/>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Customer Support</h3>
                            <p className="mt-2 text-base text-gray-600">
                                Our team is here to help you every step of the way.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-blue-700">
                <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">Ready to find your dream vehicle?</span>
                        <span className="block">Start browsing now.</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-blue-200">
                        Join thousands of satisfied buyers and sellers on AutoMarket today.
                    </p>
                    <Link
                        to="/register"
                        className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
                    >
                        Sign up for free
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
