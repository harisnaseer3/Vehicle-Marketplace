import '../css/app.css';
import './bootstrap';
import {Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from '@/axios';

import { AuthProvider } from "@/contexts/AuthContext.jsx";

// Layouts
import GuestLayout from '@/Layouts/GuestLayout';
import AdminLayout from '@/Layouts/AdminLayout';

// Public Pages
import LandingPage from '@/Pages/LandingPage';
import VehicleListing from '@/Pages/Vehicles/AllVehicles.jsx';
import VehicleDetails from '@/Components/Vehicles/VehicleDetails.jsx';
import Search from '@/Components/Vehicles/Search/Search.jsx';
import SearchResult from '@/Components/Vehicles/Search/SearchResult.jsx';
//Bikes
import BikesListing from '@/Pages/Vehicles/AllBikes.jsx';


// Auth Pages
import Login from '@/Pages/Auth/Login';
import Register from '@/Pages/Auth/Register';
import ForgotPassword from '@/Pages/Auth/ForgotPassword';
import ResetPassword from '@/Pages/Auth/ResetPassword';
import Profile from '@/Pages/Auth/Profile.jsx'

// User Pages
// import Dashboard from '@/Pages/User/Dashboard';
// import MyListings from '@/Pages/User/MyListings';
// import SavedVehicles from '@/Pages/User/SavedVehicles';
// import Inbox from '@/Pages/User/Inbox';
// import Notifications from '@/Pages/User/Notifications';

// Listing Management
import CreateVehicle from '@/Pages/Post/create.jsx';
import EditVehicle from '@/Pages/Post/Edit';

// Admin Pages
// import AdminLogin from '@/Pages/Admin/Login';
import AdminDashboard from '@/Pages/Admin/Dashboard';
import BikeDetails from "@/Components/Vehicles/BikeDetails.jsx";
import AuthLayout from "@/Layouts/AuthLayout.jsx";
// import ManageUsers from '@/Pages/Admin/ManageUsers';
// import ManageListings from '@/Pages/Admin/ManageListings';

// Error Pages
// import NotFound from '@/Pages/Errors/NotFound';
// import Unauthorized from '@/Pages/Errors/Unauthorized';

// function App() {
//     return <AppRoutes/>;
// }

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

// Admin Route Wrapper
const AdminRoute = ({children}) => {
    const [isAdmin, setIsAdmin] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminAuth = async () => {
            try {
                const res = await axios.get('/api/admin/check');
                if (res.data?.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                    navigate('/admin/login');
                }
            } catch (error) {
                setIsAdmin(false);
                navigate('/admin/login');
            }
        };

        checkAdminAuth();
    }, [navigate]);

    if (isAdmin === null) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return isAdmin ? <AdminLayout>{children}</AdminLayout> : null;
};

// Authenticated User Route Wrapper
const AuthRoute = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get('/auth/check');
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
                navigate('/login');
            }
        };

        checkAuth();
    }, [navigate]);

    if (isAuthenticated === null) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : null;
};

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<GuestLayout><LandingPage/></GuestLayout>}/>
            <Route path="/vehicles" element={<GuestLayout><VehicleListing/></GuestLayout>}/>
            <Route path="/vehicle/:id" element={<GuestLayout><VehicleDetails/></GuestLayout>}/>
            <Route path="/search" element={<GuestLayout><Search/></GuestLayout>}/>
            <Route path="/vehicles/search" element={<GuestLayout><SearchResult/></GuestLayout>}/>

            {/*Bikes*/}
            <Route path="/bikes" element={<GuestLayout><BikesListing/></GuestLayout>}/>
            <Route path="/bike/:id" element={<GuestLayout><BikeDetails/></GuestLayout>}/>

            {/* Authentication Routes */}
            <Route path="/login" element={<GuestLayout><Login/></GuestLayout>}/>
            <Route path="/register" element={<GuestLayout><Register/></GuestLayout>}/>
            <Route path="/forgot-password" element={<GuestLayout><ForgotPassword/></GuestLayout>}/>
            <Route path="/reset-password/:token" element={<GuestLayout><ResetPassword/></GuestLayout>}/>
            <Route path="/post/create" element={<CreateVehicle/>}/>

            {/* Authenticated User Routes */}
            <Route>
                <Route path="/user/profile" element={<Profile/>}/>
                {/*<Route path="/my-listings" element={<MyListings/>}/>*/}
                {/*<Route path="/saved-vehicles" element={<SavedVehicles/>}/>*/}
                {/*<Route path="/inbox" element={<Inbox/>}/>*/}
                {/*<Route path="/notifications" element={<Notifications/>}/>*/}
                <Route path="/post/:id/edit" element={<EditVehicle/>}/>
            </Route>

            {/* Admin Routes */}
            <Route path="/admin">
                {/*<Route path="login" element={<GuestLayout><AdminLogin/></GuestLayout>}/>*/}
                <Route path="dashboard" element={<AdminRoute><AdminDashboard/></AdminRoute>}/>
                {/*<Route path="users" element={<AdminRoute><ManageUsers/></AdminRoute>}/>*/}
                {/*<Route path="listings" element={<AdminRoute><ManageListings/></AdminRoute>}/>*/}
            </Route>

            {/* Error Routes */}
            {/*<Route path="/unauthorized" element={<Unauthorized/>}/>*/}
            {/*<Route path="*" element={<NotFound/>}/>*/}
        </Routes>
    );
}

export default App;
