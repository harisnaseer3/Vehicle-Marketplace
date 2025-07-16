import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import { FaCar, FaSearch, FaPlusCircle, FaUserCog } from 'react-icons/fa';
import {Link} from "react-router-dom";

const Dashboard = () => {
    // Sample data - replace with actual data from your backend
    const stats = [
        { name: 'Total Vehicles', value: '1,234', change: '+12%', changeType: 'positive' },
        { name: 'Active Listings', value: '876', change: '+4%', changeType: 'positive' },
        { name: 'Sold This Month', value: '124', change: '-2%', changeType: 'negative' },
        { name: 'New Users', value: '89', change: '+8%', changeType: 'positive' },
    ];

    const recentListings = [
        { id: 1, title: 'Toyota Corolla 2022', price: '$18,500', status: 'Active', date: '2 hours ago' },
        { id: 2, title: 'Honda Civic 2020', price: '$15,200', status: 'Pending', date: '1 day ago' },
        { id: 3, title: 'Suzuki Swift 2021', price: '$12,800', status: 'Sold', date: '3 days ago' },
        { id: 4, title: 'Toyota Hilux 2019', price: '$22,300', status: 'Active', date: '5 days ago' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                        <Link
                            href="/vehicles/create"
                            className="flex items-center p-4 bg-white rounded-lg shadow hover:bg-blue-50 transition-colors"
                        >
                            <FaPlusCircle className="w-8 h-8 text-blue-600" />
                            <div className="ml-4">
                                <h3 className="font-medium text-gray-900">Add New Vehicle</h3>
                                <p className="text-sm text-gray-500">List a vehicle for sale</p>
                            </div>
                        </Link>
                        <Link
                            href="/vehicles"
                            className="flex items-center p-4 bg-white rounded-lg shadow hover:bg-blue-50 transition-colors"
                        >
                            <FaSearch className="w-8 h-8 text-green-600" />
                            <div className="ml-4">
                                <h3 className="font-medium text-gray-900">Browse Vehicles</h3>
                                <p className="text-sm text-gray-500">Find your next car</p>
                            </div>
                        </Link>
                        <Link
                            href="/my-vehicles"
                            className="flex items-center p-4 bg-white rounded-lg shadow hover:bg-blue-50 transition-colors"
                        >
                            <FaCar className="w-8 h-8 text-purple-600" />
                            <div className="ml-4">
                                <h3 className="font-medium text-gray-900">My Listings</h3>
                                <p className="text-sm text-gray-500">Manage your vehicles</p>
                            </div>
                        </Link>
                        <Link
                            href="/profile"
                            className="flex items-center p-4 bg-white rounded-lg shadow hover:bg-blue-50 transition-colors"
                        >
                            <FaUserCog className="w-8 h-8 text-orange-600" />
                            <div className="ml-4">
                                <h3 className="font-medium text-gray-900">Account Settings</h3>
                                <p className="text-sm text-gray-500">Update your profile</p>
                            </div>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.name} className="p-5 bg-white rounded-lg shadow">
                                <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                                <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
                                <p className={`mt-1 text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.change} from last month
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Recent Listings */}
                    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Listings</h3>
                            <p className="mt-1 text-sm text-gray-500">Your recently added vehicles</p>
                        </div>
                        <div className="border-t border-gray-200">
                            <ul className="divide-y divide-gray-200">
                                {recentListings.map((listing) => (
                                    <li key={listing.id} className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-blue-600 truncate">
                                                    <Link href={`/vehicles/${listing.id}`}>{listing.title}</Link>
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">{listing.price}</p>
                                            </div>
                                            <div className="flex flex-col items-end ml-2">
                                                <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                                    listing.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                        listing.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                }`}>
                                                    {listing.status}
                                                </span>
                                                <p className="mt-1 text-xs text-gray-500">{listing.date}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="px-4 py-4 bg-gray-50 sm:px-6">
                            <Link
                                href="/my-vehicles"
                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                                View all listings →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Dashboard;
