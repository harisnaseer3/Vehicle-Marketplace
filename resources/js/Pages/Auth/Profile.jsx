import {useEffect, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {Link, useNavigate} from 'react-router-dom';
import axios from '@/axios.js';
import {FaUser, FaCar, FaHeart, FaCog, FaSignOutAlt, FaEdit, FaCheck, FaTimes, FaEye, FaSearch, FaCalendarAlt, FaTachometerAlt, FaPlus, FaTrash, FaLock} from 'react-icons/fa';
import {toast} from 'react-toastify';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [savedVehicles, setSavedVehicles] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [myVehicles, setMyVehicles] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUser(response.data.data);
                setFormData({
                    name: response.data.data.name,
                    email: response.data.data.email,
                    phone: response.data.data.phone || '',
                    address: response.data.data.address || ''
                });

                // Fetch saved vehicles if on that tab
                if (activeTab === 'saved') {
                    await fetchSavedVehicles();
                } else if (activeTab === 'my-vehicles') {
                    await fetchMyVehicles();
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile');
                setLoading(false);
            }
        };

        fetchProfile();
    }, [activeTab, navigate]);

    const fetchSavedVehicles = async () => {
        try {
            const response = await axios.get('/user/saved-vehicles', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setSavedVehicles(response.data.data);
        } catch (error) {
            console.error('Error fetching saved vehicles:', error);
            toast.error('Failed to load saved vehicles');
        }
    };

    const fetchMyVehicles = async () => {
        try {
            const response = await axios.get('/user/vehicles', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            setMyVehicles(response.data.data);
        } catch (error) {
            console.error('Error fetching user vehicles:', error);
            toast.error('Failed to load your vehicles');
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            const response = await axios.put('/user/profile/update', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            setUser(response.data.data);
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handlePasswordChange = (e) => {
        const {name, value} = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (passwordErrors[name]) {
            setPasswordErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    }
    const handleUpdatePassword = async () => {
        // Clear previous errors
        setPasswordErrors({});

        // Frontend validation
        if (!passwordData.current_password || !passwordData.new_password || !passwordData.new_password_confirmation) {
            toast.error('Please fill in all fields');
            return;
        }

        // Frontend password match validation
        if (passwordData.new_password !== passwordData.new_password_confirmation) {
            setPasswordErrors({
                new_password: ['Passwords do not match'],
                new_password_confirmation: ['Passwords do not match']
            });
            return;
        }

        setIsUpdatingPassword(true);

        try {
            const response = await axios.post('/change-password', passwordData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            // toast.success(response.data.message || 'Password updated successfully');
            alert('Password updated successfully!');
            setActiveTab('profile');
            setPasswordData({
                current_password: '',
                new_password: '',
                new_password_confirmation: ''
            });
        } catch (error) {
            // Handle different error response formats
            if (error.response?.data?.errors) {
                // For password mismatch error from backend
                setPasswordErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                // For incorrect current password error
                if (error.response.data.message === 'Current password is incorrect.') {
                    setPasswordErrors({
                        current_password: [error.response.data.message]
                    });
                } else {
                    // toast.error(error.response.data.message);
                }
            } else {
                // toast.error('Failed to update password');
            }
        } finally {
            setIsUpdatingPassword(false);
        }
    }
    const handleLogout = async () => {
        try {
            await axios.post('/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            localStorage.removeItem('auth_token');
            navigate('/login');
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Failed to logout');
        }
    };

    const removeSavedVehicle = async (vehicleId) => {
        try {
            await axios.delete(`/user/saved-vehicles/${vehicleId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            setSavedVehicles(savedVehicles.filter(v => v.id !== vehicleId));
            toast.success('Vehicle removed from saved list');
        } catch (error) {
            console.error('Error removing saved vehicle:', error);
            toast.error('Failed to remove vehicle');
        }
    };

    const handleDeleteVehicle = async (vehicleId) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await axios.delete(`/posts/${vehicleId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                });

                setMyVehicles(myVehicles.filter(v => v.id !== vehicleId));
                toast.success('Vehicle deleted successfully');
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                toast.error('Failed to delete vehicle');
            }
        }
    };

    const handleEditVehicle = (vehicleId) => {
        navigate(`/post/${vehicleId}/edit`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Profile Not Found</h2>
                    <p className="mt-2 text-gray-600">Please login to view your profile</p>
                    <Link to="/login"
                          className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Dashboard Overview */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-end gap-6">
                    <div className="flex-shrink-0">
                        <img
                            className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg"
                            src={user.image ? `/storage/${user.image}` : '/images/default-profile.png'}
                            alt="Profile"
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                        <div className="text-blue-100">{user.email}</div>
                        {user.phone && <div className="text-blue-200 mt-1">{user.phone}</div>}
                    </div>
                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto mt-6 md:mt-0">
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold">{myVehicles.length}</div>
                            <div className="text-blue-200 text-sm">My Listings</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold">{savedVehicles.length}</div>
                            <div className="text-blue-200 text-sm">Favorites</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 text-center hidden md:block">
                            <div className="text-2xl font-bold">0</div>
                            <div className="text-blue-200 text-sm">Sold</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
                {/* Responsive Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
                    <div className="bg-white rounded-lg shadow p-4 sticky top-4">
                        <nav className="space-y-1 flex md:block flex-row md:flex-col gap-2 md:gap-0">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex items-center w-full px-4 py-2 text-left rounded-md ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <FaUser className="mr-3"/> <span className="hidden sm:inline">Profile</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('saved')}
                                className={`flex items-center w-full px-4 py-2 text-left rounded-md ${activeTab === 'saved' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <FaHeart className="mr-3"/> <span className="hidden sm:inline">Favorites</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('my-vehicles')}
                                className={`flex items-center w-full px-4 py-2 text-left rounded-md ${activeTab === 'my-vehicles' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <FaCar className="mr-3"/> <span className="hidden sm:inline">My Listings</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`flex items-center w-full px-4 py-2 text-left rounded-md ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <FaCog className="mr-3"/> <span className="hidden sm:inline">Settings</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2 text-left rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                <FaSignOutAlt className="mr-3"/> <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Panel */}
                <main className="flex-1">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            {/* Profile Information Card */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FaUser className="text-blue-600 mr-3 text-xl" />
                                            <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                                        </div>
                                        {!isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                                            >
                                                <FaEdit className="mr-2" /> Edit Profile
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6">
                                    {isEditing ? (
                                        <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                        placeholder="Enter your full name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                        placeholder="Enter your email"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                        placeholder="Enter your phone number"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                        placeholder="Enter your location"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                                                <textarea
                                                    name="bio"
                                                    value={formData.bio || ''}
                                                    onChange={handleInputChange}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                                    placeholder="Tell us about yourself..."
                                                />
                                            </div>
                                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setFormData({
                                                            name: user.name,
                                                            email: user.email,
                                                            phone: user.phone || '',
                                                            address: user.address || '',
                                                            bio: user.bio || ''
                                                        });
                                                    }}
                                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isUpdatingPassword}
                                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                                                >
                                                    {isUpdatingPassword ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-500 mb-1">Full Name</label>
                                                    <p className="text-lg text-gray-900">{user.name}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-500 mb-1">Email Address</label>
                                                    <p className="text-lg text-gray-900">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-500 mb-1">Phone Number</label>
                                                    <p className="text-lg text-gray-900">{user.phone || 'Not provided'}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-500 mb-1">Location</label>
                                                    <p className="text-lg text-gray-900">{user.address || 'Not provided'}</p>
                                                </div>
                                            </div>
                                            {user.bio && (
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-semibold text-gray-500 mb-1">Bio</label>
                                                    <p className="text-lg text-gray-900">{user.bio}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Account Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <FaCar className="text-blue-600 text-xl" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">Active Listings</p>
                                            <p className="text-2xl font-bold text-gray-900">{myVehicles.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-green-100 rounded-lg">
                                            <FaHeart className="text-green-600 text-xl" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">Saved Vehicles</p>
                                            <p className="text-2xl font-bold text-gray-900">{savedVehicles.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                                    <div className="flex items-center">
                                        <div className="p-3 bg-purple-100 rounded-lg">
                                            <FaEye className="text-purple-600 text-xl" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">Profile Views</p>
                                            <p className="text-2xl font-bold text-gray-900">0</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div className="space-y-6">
                            {/* Saved Vehicles Header */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FaHeart className="text-red-600 mr-3 text-xl" />
                                            <h3 className="text-xl font-semibold text-gray-900">Saved Vehicles</h3>
                                        </div>
                                        <Link
                                            to="/vehicles"
                                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                                        >
                                            <FaSearch className="mr-2" /> Browse More
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {savedVehicles.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FaHeart className="text-red-600 text-2xl" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved vehicles yet</h3>
                                            <p className="text-gray-600 mb-6 max-w-md mx-auto">Save vehicles you're interested in to view them here and get notified about price changes.</p>
                                            <Link
                                                to="/vehicles"
                                                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                                            >
                                                <FaSearch className="mr-2" /> Browse Vehicles
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {savedVehicles.map((vehicle) => (
                                                <div key={vehicle.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                                    <div className="relative">
                                                        <img
                                                            className="w-full h-48 object-cover"
                                                            src={vehicle.primary_photo_url || '/images/default-vehicle.jpg'}
                                                            alt={vehicle.title}
                                                        />
                                                        <div className="absolute top-3 right-3">
                                                            <button
                                                                onClick={() => removeSavedVehicle(vehicle.id)}
                                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
                                                            >
                                                                <FaHeart className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="absolute bottom-3 left-3">
                                                            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                                                                {vehicle.condition}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{vehicle.title}</h4>
                                                        <div className="flex items-center text-sm text-gray-600 mb-3">
                                                            <FaCalendarAlt className="mr-1" />
                                                            <span>{vehicle.year}</span>
                                                            <span className="mx-2">•</span>
                                                            <FaTachometerAlt className="mr-1" />
                                                            <span>{vehicle.mileage?.toLocaleString()} km</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xl font-bold text-red-600">${vehicle.price?.toLocaleString()}</span>
                                                            <Link
                                                                to={`/vehicles/${vehicle.id}`}
                                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                                                            >
                                                                View Details
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'my-vehicles' && (
                        <div className="space-y-6">
                            {/* My Vehicles Header */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FaCar className="text-green-600 mr-3 text-xl" />
                                            <h3 className="text-xl font-semibold text-gray-900">My Vehicle Listings</h3>
                                        </div>
                                        <Link
                                            to="/post/create"
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                                        >
                                            <FaPlus className="mr-2" /> Add New Listing
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {myVehicles.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FaCar className="text-green-600 text-2xl" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles listed yet</h3>
                                            <p className="text-gray-600 mb-6 max-w-md mx-auto">Start selling your vehicles by creating your first listing. It's quick and easy!</p>
                                            <Link
                                                to="/post/create"
                                                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                                            >
                                                <FaPlus className="mr-2" /> Create First Listing
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {myVehicles.map((vehicle) => (
                                                <div key={vehicle.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                                                    <div className="flex flex-col md:flex-row">
                                                        <div className="md:w-1/3">
                                                            <div className="relative h-48 md:h-full">
                                                                <img
                                                                    className="w-full h-full object-cover"
                                                                    src={vehicle.images?.length ? `/storage/${vehicle.images[0]}` : '/images/vehicle-placeholder.jpg'}
                                                                    alt={vehicle.title}
                                                                />
                                                                <div className="absolute top-3 left-3">
                                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                        vehicle.condition === 'new' ? 'bg-green-100 text-green-800' :
                                                                        vehicle.condition === 'used' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {vehicle.condition.replace(/-/g, ' ')}
                                                                    </span>
                                                                </div>
                                                                {vehicle.is_featured && (
                                                                    <div className="absolute top-3 right-3">
                                                                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                                            Featured
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="md:w-2/3 p-6">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div>
                                                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{vehicle.title}</h4>
                                                                    <div className="flex items-center text-sm text-gray-600 mb-3">
                                                                        <FaCalendarAlt className="mr-1" />
                                                                        <span>{vehicle.year}</span>
                                                                        <span className="mx-2">•</span>
                                                                        <FaTachometerAlt className="mr-1" />
                                                                        <span>{vehicle.mileage?.toLocaleString()} km</span>
                                                                        <span className="mx-2">•</span>
                                                                        <FaCog className="mr-1" />
                                                                        <span className="capitalize">{vehicle.transmission_type}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-2xl font-bold text-green-600 mb-1">
                                                                        ${parseFloat(vehicle.price).toLocaleString()}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">Listed {new Date(vehicle.created_at).toLocaleDateString()}</div>
                                                                </div>
                                                            </div>
                                                            {vehicle.features?.length > 0 && (
                                                                <div className="mb-4">
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {vehicle.features.slice(0, 3).map((feature, index) => (
                                                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                                                {feature}
                                                                            </span>
                                                                        ))}
                                                                        {vehicle.features.length > 3 && (
                                                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                                                +{vehicle.features.length - 3} more
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                                                <div className="flex items-center space-x-2">
                                                                    <Link
                                                                        to={`/vehicle/${vehicle.id}`}
                                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                                                                    >
                                                                        <FaEye className="mr-1" /> View
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleEditVehicle(vehicle.id)}
                                                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm"
                                                                    >
                                                                        <FaEdit className="mr-1" /> Edit
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDeleteVehicle(vehicle.id)}
                                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm"
                                                                >
                                                                    <FaTrash className="mr-1" /> Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            {/* Password Change Card */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <FaLock className="text-purple-600 mr-3 text-xl" />
                                        <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <form onSubmit={(e) => { e.preventDefault(); handleUpdatePassword(); }} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                                <input
                                                    type="password"
                                                    name="current_password"
                                                    value={passwordData.current_password}
                                                    onChange={handlePasswordChange}
                                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                                                        passwordErrors.current_password ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="Enter current password"
                                                />
                                                {passwordErrors.current_password && (
                                                    <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password[0]}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                                <input
                                                    type="password"
                                                    name="new_password"
                                                    value={passwordData.new_password}
                                                    onChange={handlePasswordChange}
                                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                                                        passwordErrors.new_password ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="Enter new password"
                                                />
                                                {passwordErrors.new_password && (
                                                    <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password[0]}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="new_password_confirmation"
                                                value={passwordData.new_password_confirmation}
                                                onChange={handlePasswordChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                                                    passwordErrors.new_password_confirmation ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Confirm new password"
                                            />
                                            {passwordErrors.new_password_confirmation && (
                                                <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password_confirmation[0]}</p>
                                            )}
                                        </div>
                                        <div className="flex justify-end pt-4 border-t border-gray-200">
                                            <button
                                                type="submit"
                                                disabled={isUpdatingPassword}
                                                className={`px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors duration-200 ${
                                                    isUpdatingPassword ? 'cursor-not-allowed' : ''
                                                }`}
                                            >
                                                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Account Settings Card */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <FaCog className="text-red-600 mr-3 text-xl" />
                                        <h3 className="text-xl font-semibold text-gray-900">Account Settings</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Notification Preferences</h4>
                                            <div className="space-y-3">
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                                    <span className="ml-3 text-gray-700">Email notifications for new messages</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                                    <span className="ml-3 text-gray-700">Price change alerts for saved vehicles</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                    <span className="ml-3 text-gray-700">Marketing emails and promotions</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-gray-200">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Danger Zone</h4>
                                            <p className="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                                                <FaTrash className="mr-2" /> Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Profile;
