import {useEffect, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {Link, useNavigate} from 'react-router-dom';
import axios from '@/axios.js';
import {FaUser, FaCar, FaHeart, FaCog, FaSignOutAlt, FaEdit, FaCheck, FaTimes} from 'react-icons/fa';
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
            {/* Profile Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div
                        className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <img
                                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow"
                                    src={user.profile_photo_url || '/images/default-profile.png'}
                                    alt="Profile"
                                />
                                {isEditing && (
                                    <button
                                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700">
                                        <FaEdit size={14}/>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                    <p className="text-gray-600">{user.email}</p>
                                    {user.phone && <p className="text-gray-600 mt-1">{user.phone}</p>}
                                </div>
                                <div className="flex space-x-2">
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            <FaEdit className="mr-2"/> Edit Profile
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleSaveProfile}
                                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            >
                                                <FaCheck className="mr-2"/> Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        name: user.name,
                                                        email: user.email,
                                                        phone: user.phone || '',
                                                        address: user.address || ''
                                                    });
                                                }}
                                                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                            >
                                                <FaTimes className="mr-2"/> Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow p-4">
                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`flex items-center w-full px-4 py-2 text-left rounded-md ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <FaUser className="mr-3"/> Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('saved')}
                                    className={`flex items-center w-full px-4 py-2 text-left rounded-md ${activeTab === 'saved' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <FaHeart className="mr-3"/> Saved Vehicles
                                </button>
                                <button
                                    onClick={() => setActiveTab('my-vehicles')}
                                    className={`flex items-center w-full px-4 py-2 text-left rounded-md ${activeTab === 'my-vehicles' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <FaCar className="mr-3"/> My Vehicles
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`flex items-center w-full px-4 py-2 text-left rounded-md ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <FaCog className="mr-3"/> Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-left rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    <FaSignOutAlt className="mr-3"/> Sign Out
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Panel */}
                    <div className="flex-1">
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Personal
                                        Information</h3>
                                </div>
                                <div className="px-6 py-5">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            ) : (
                                                <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            ) : (
                                                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone
                                                Number</label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            ) : (
                                                <p className="mt-1 text-sm text-gray-900">{user.phone || 'Not provided'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Address</label>
                                            {isEditing ? (
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            ) : (
                                                <p className="mt-1 text-sm text-gray-900">{user.address || 'Not provided'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'saved' && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Saved Vehicles</h3>
                                </div>
                                <div className="px-6 py-5">
                                    {savedVehicles.length === 0 ? (
                                        <div className="text-center py-8">
                                            <FaHeart className="mx-auto h-12 w-12 text-gray-400"/>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No saved
                                                vehicles</h3>
                                            <p className="mt-1 text-sm text-gray-500">Save vehicles you're interested in
                                                to view them here.</p>
                                            <div className="mt-6">
                                                <Link
                                                    to="/vehicles"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Browse Vehicles
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {savedVehicles.map((vehicle) => (
                                                <div key={vehicle.id}
                                                     className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                                                    <Link to={`/vehicles/${vehicle.id}`} className="block">
                                                        <div className="relative pb-2/3 h-48">
                                                            <img
                                                                className="absolute h-full w-full object-cover"
                                                                src={vehicle.primary_photo_url || '/images/default-vehicle.jpg'}
                                                                alt={vehicle.title}
                                                            />
                                                        </div>
                                                        <div className="p-4">
                                                            <h3 className="text-lg font-medium text-gray-900 truncate">{vehicle.title}</h3>
                                                            <p className="mt-1 text-sm text-gray-600">{vehicle.year} • {vehicle.mileage} km</p>
                                                            <p className="mt-2 text-lg font-bold text-blue-600">${vehicle.price.toLocaleString()}</p>
                                                        </div>
                                                    </Link>
                                                    <div className="px-4 py-3 bg-gray-50 border-t flex justify-end">
                                                        <button
                                                            onClick={() => removeSavedVehicle(vehicle.id)}
                                                            className="text-sm font-medium text-red-600 hover:text-red-800"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'my-vehicles' && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">My Vehicles</h3>
                                        <Link
                                            to="/post/create"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            Sell New Vehicle
                                        </Link>
                                    </div>
                                </div>
                                <div className="px-6 py-5">
                                    {myVehicles.length === 0 ? (
                                        <div className="text-center py-8">
                                            <FaCar className="mx-auto h-12 w-12 text-gray-400"/>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles
                                                listed</h3>
                                            <p className="mt-1 text-sm text-gray-500">Get started by selling your
                                                vehicle.</p>
                                            <div className="mt-6">
                                                <Link
                                                    to="/post/create"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    Sell Vehicle
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {myVehicles.map((vehicle) => (
                                                <div key={vehicle.id}
                                                     className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                                                    <Link to={`/vehicle/${vehicle.id}`} className="block">
                                                        <div className="relative pb-2/3 h-48">
                                                            <img
                                                                className="absolute h-full w-full object-cover"
                                                                src={
                                                                    vehicle.images?.length
                                                                        ? `/storage/${vehicle.images[0]}`
                                                                        : '/images/vehicle-placeholder.jpg'
                                                                }
                                                                alt={vehicle.title}
                                                            />
                                                        </div>
                                                        <div className="p-4">
                                                            <h3 className="text-lg font-medium text-gray-900 truncate">{vehicle.title}</h3>
                                                            <p className="mt-1 text-sm text-gray-600">
                                                                {vehicle.year} • {vehicle.mileage} km
                                                                • {vehicle.transmission_type}
                                                            </p>
                                                            <p className="mt-2 text-lg font-bold text-blue-600">
                                                                ${parseFloat(vehicle.price).toLocaleString()}
                                                            </p>
                                                            <div className="mt-2 flex flex-wrap gap-1">
                                                                {vehicle.features?.map((feature, index) => (
                                                                    <span key={index}
                                                                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                        {feature}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    <div className="px-4 py-3 bg-gray-50 border-t flex justify-between">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                vehicle.condition === 'new' ? 'bg-green-100 text-green-800' :
                                                                    vehicle.condition === 'used' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {vehicle.condition.replace(/-/g, ' ')}
                                                        </span>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleEditVehicle(vehicle.id);
                                                                }}
                                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleDeleteVehicle(vehicle.id);
                                                                }}
                                                                className="text-sm font-medium text-red-600 hover:text-red-800"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">Account Settings</h3>
                                </div>
                                <div className="px-6 py-5">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-md font-medium text-gray-900">Change Password</h4>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Current
                                                        Password</label>
                                                    <input
                                                        type="password"
                                                        name="current_password"
                                                        value={passwordData.current_password}
                                                        onChange={handlePasswordChange}
                                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                            passwordErrors.current_password ? 'border-red-500' : ''
                                                        }`}
                                                    />
                                                    {passwordErrors.current_password && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {passwordErrors.current_password[0]} {/* Display first error message */}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">New
                                                        Password</label>
                                                    <input
                                                        type="password"
                                                        name="new_password"
                                                        value={passwordData.new_password}
                                                        onChange={handlePasswordChange}
                                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                            passwordErrors.new_password ? 'border-red-500' : ''
                                                        }`}
                                                    />
                                                    {passwordErrors.new_password && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {passwordErrors.new_password[0]}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Confirm
                                                        New Password</label>
                                                    <input
                                                        type="password"
                                                        name="new_password_confirmation"
                                                        value={passwordData.new_password_confirmation}
                                                        onChange={handlePasswordChange}
                                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                                            passwordErrors.new_password_confirmation ? 'border-red-500' : ''
                                                        }`}
                                                    />
                                                    {passwordErrors.new_password_confirmation && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {passwordErrors.new_password_confirmation[0]}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={handleUpdatePassword}
                                                    disabled={isUpdatingPassword}
                                                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                                                        isUpdatingPassword ? 'opacity-70 cursor-not-allowed' : ''
                                                    }`}
                                                >
                                                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-gray-200">
                                            <h4 className="text-md font-medium text-gray-900">Delete Account</h4>
                                            <p className="mt-1 text-sm text-gray-600">Once you delete your account,
                                                there is no going back. Please be certain.</p>
                                            <button
                                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
