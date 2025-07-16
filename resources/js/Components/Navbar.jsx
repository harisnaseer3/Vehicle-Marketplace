import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {FaCar, FaUser, FaBell, FaSearch, FaBars} from 'react-icons/fa';
import {IoMdArrowDropdown} from 'react-icons/io';
import {useState} from 'react';
import axios from "axios";

const Navbar = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('auth_token');
        return {user: token ? { /* user data */} : null};
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [error, setError] = useState(null);

    const handleRegisterClick = (e) => {
        e.preventDefault();
        navigate('/register');
    };

    const handleLogout = async () => {
        try {
            await axios.post('/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            localStorage.removeItem('auth_token');
            setAuth({user: null});
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || "Failed to logout");
        }
    };

    return (
        <>
            {/* Top Announcement Bar (optional) */}
            <div className="bg-blue-600 text-white text-sm">
                <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center">
                    <div className="flex space-x-4">
                        <RouterLink to="/news" className="hover:underline">News</RouterLink>
                        <RouterLink to="/reviews" className="hover:underline">Reviews</RouterLink>
                        <RouterLink to="/advice" className="hover:underline">Advice</RouterLink>
                    </div>
                    <div className="flex space-x-4">
                        <RouterLink to="/contact" className="hover:underline">Contact Us</RouterLink>
                    </div>
                </div>
            </div>

            {/* Main Fixed Navbar */}
            <nav className="sticky top-0 z-50 bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <RouterLink to="/" className="flex items-center">
                            <FaCar className="h-8 w-8 text-red-600"/>
                            <span className="ml-2 text-2xl font-bold text-gray-900">AutoMarket</span>
                        </RouterLink>

                        {/* Desktop Search and Navigation */}
                        <div className="hidden md:flex items-center flex-1 mx-8">
                            <div className="relative w-full max-w-xl">
                                <input
                                    type="text"
                                    placeholder="Search for cars, bikes, and more..."
                                    className="w-full py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                                    <FaSearch/>
                                </button>
                            </div>
                        </div>

                        {/* Desktop Right Side */}
                        <div className="hidden md:flex items-center space-x-4">
                            <RouterLink
                                to="/sell-vehicle"
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Sell Vehicle
                            </RouterLink>

                            {auth.user ? (
                                <>
                                    <button className="p-1 text-gray-600 hover:text-blue-600 relative">
                                        <FaBell className="h-5 w-5"/>
                                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
                                    </button>
                                    <div
                                        className="flex items-center space-x-2 relative"
                                        onMouseEnter={() => setIsDropdownOpen(true)}
                                        onMouseLeave={() => setTimeout(() => setIsDropdownOpen(false), 300)} // 300ms delay
                                    >

                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src={auth.user.profile_photo_url || '/images/default-profile.png'}
                                            alt="User profile"
                                        />
                                        <IoMdArrowDropdown className="text-gray-500"/>
                                        {isDropdownOpen && (
                                            <div
                                                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                                                <RouterLink to="/dashboard"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</RouterLink>
                                                <RouterLink to="/my-vehicles"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My
                                                    Vehicles</RouterLink>
                                                <RouterLink to="/profile"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</RouterLink>
                                                <RouterLink
                                                    to="#"
                                                    onClick={handleLogout}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                >
                                                    Sign Out
                                                </RouterLink>
                                            </div>
                                        )}

                                    </div>
                                </>
                            ) : (
                                <>
                                    <RouterLink to="/login"
                                                className="px-4 py-2 text-blue-600 hover:text-blue-800">Login</RouterLink>

                                    <button
                                        onClick={handleRegisterClick}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-600 hover:text-blue-600"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <FaBars className="h-6 w-6"/>
                        </button>
                    </div>
                </div>

                {/* Categories Bar */}
                <div className="bg-gray-100 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex space-x-6 overflow-x-auto py-2 hide-scrollbar">
                            <RouterLink to="/used-cars"
                                        className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-blue-600">Used
                                Cars</RouterLink>
                            <RouterLink to="/new-cars"
                                        className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-blue-600">New
                                Cars</RouterLink>
                            <RouterLink to="/bikes"
                                        className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-blue-600">Bikes</RouterLink>
                            <RouterLink to="/autoparts"
                                        className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-blue-600">Auto
                                Parts</RouterLink>
                            <RouterLink to="/dealers"
                                        className="whitespace-nowrap text-sm font-medium text-gray-700 hover:text-blue-600">Dealers</RouterLink>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <div className="relative px-3 py-2">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="absolute right-3 top-2 text-gray-500">
                                    <FaSearch/>
                                </button>
                            </div>
                            <RouterLink to="/sell-vehicle" className="block px-3 py-2 text-white bg-red-600 rounded-md">Sell
                                Vehicle</RouterLink>
                            {auth.user ? (
                                <>
                                    <RouterLink to="/dashboard"
                                                className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Dashboard</RouterLink>
                                    <RouterLink to="/my-vehicles"
                                                className="block px-3 py-2 text-gray-700 hover:bg-gray-100">My
                                        Vehicles</RouterLink>
                                    <RouterLink to="/profile"
                                                className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Profile</RouterLink>
                                    <RouterLink
                                        to="#"
                                        onClick={handleLogout}
                                        className="block px-3 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                        Sign Out
                                    </RouterLink>
                                </>
                            ) : (
                                <>
                                    <RouterLink to="/login"
                                                className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Login</RouterLink>
                                    <RouterLink to="/register"
                                                className="block px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">Sign
                                        Up</RouterLink>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Add this to your CSS file or style tag */}

        </>
    );
};

export default Navbar;
