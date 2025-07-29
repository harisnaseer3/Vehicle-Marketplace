import {useState, useEffect} from 'react';
import {useLocation, Link} from 'react-router-dom';
import axios from '@/axios.js';

const AllBikes = () => {
    const location = useLocation();
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeCondition, setActiveCondition] = useState('all');

    // Get condition from URL query params
    const queryParams = new URLSearchParams(location.search);
    const conditionFilter = queryParams.get('condition') || 'all';
    const categoryFilter = queryParams.get('category') || 'bikes';

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                setLoading(true);
                let url = `/bikes?page=${currentPage}`;

                if (conditionFilter !== 'all') {
                    url += `&condition=${conditionFilter}`;
                }

                if (categoryFilter) {
                    url += `&category=${categoryFilter}`;
                }

                const response = await axios.get(url);

                if (response.data.success) {
                    setBikes(response.data.data.data);
                    setTotalPages(response.data.data.last_page);
                    setActiveCondition(conditionFilter);
                } else {
                    throw new Error(response.data.message || 'Failed to load bikes');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBikes();
    }, [currentPage, conditionFilter, categoryFilter]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-8">
                {error}
                <p className="mt-2 text-sm text-gray-600">
                    Please try again later or contact support.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Breadcrumb Navigation */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link to="/"
                              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="m1 9 4-4-4-4"/>
                            </svg>
                            <Link to="/bikes"
                                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                                Bikes
                            </Link>
                        </div>
                    </li>
                </ol>
            </nav>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {activeCondition === 'new' ? 'New Bikes' :
                        activeCondition === 'used' ? 'Used Bikes' :
                            'All Bikes'}
                </h1>
            </div>

            {/* Condition filter tabs */}
            <div className="flex justify-center mb-8">
                <div className="flex space-x-1 rounded-md bg-gray-100 p-1">
                    <Link
                        to="/bikes"
                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeCondition === 'all' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        All Bikes
                    </Link>
                    <Link
                        to="/bikes?condition=new&category=bikes"
                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeCondition === 'new' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        New Bikes
                    </Link>
                    <Link
                        to="/bikes?condition=used&category=bikes"
                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeCondition === 'used' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Used Bikes
                    </Link>
                </div>
            </div>

            {/* Bikes grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bikes.map((bike) => (
                    <div key={bike.id}
                         className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="h-48 bg-gray-200 overflow-hidden">
                            <img
                                className="w-full h-full object-cover"
                                src={bike.images?.length ?
                                    `/storage/${bike.images[0]}` :
                                    '/images/bike-placeholder.jpg'}
                                alt={`${bike.make?.name} ${bike.model?.name}`}
                                onError={(e) => {
                                    e.target.src = '/images/bike-placeholder.jpg';
                                }}
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {bike.make?.name} {bike.model?.name}
                            </h3>
                            <p className="text-gray-600">{bike.year}</p>
                            <div className="mt-2 text-sm text-gray-500">
                                <p>{bike.mileage?.toLocaleString()} km • {bike.engine_size}cc</p>
                                <p>{bike.color} • {bike.condition}</p>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-blue-600">
                                    Rs. {bike.price?.toLocaleString()}
                                </span>
                                <Link
                                    to={`/bike/${bike.id}`}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2">
                        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 border rounded-md ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </nav>
                </div>
            )}
        </div>
    );
};

export default AllBikes;
