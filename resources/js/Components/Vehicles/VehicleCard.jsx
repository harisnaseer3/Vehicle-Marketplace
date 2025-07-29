import {Link} from 'react-router-dom';
import {
    FaCar,
    FaGasPump,
    FaTachometerAlt,
    FaCalendarAlt
} from 'react-icons/fa';

const VehicleCard = ({
                         id,
                         title,
                         price,
                         images = [],
                         make = {}, // Ensure make is always an object
                         model = {}, // Ensure model is always an object
                         year,
                         mileage,
                         fuel_type,
                         transmission_type,
                         body_type,
                         condition,
                         certified = 0,
                         makeName = '', // Keep makeName for backward compatibility
                         modelName = '', // Keep modelName for backward compatibility
                         fuelType = '', // Keep fuelType for backward compatibility
                         bodyType = '', // Keep bodyType for backward compatibility
                     }) => {
    // Use nested data if available, fallback to direct props
    const displayMakeName = make?.name || makeName;
    const displayModelName = model?.name || modelName;
    const displayFuelType = fuel_type || fuelType;
    const displayBodyType = body_type || bodyType;

    const formattedPrice = new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        maximumFractionDigits: 0
    }).format(price).replace('PKR', 'PKR ');

    const formattedMileage = new Intl.NumberFormat('en-US').format(mileage);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link to={`/vehicle/${id}`}>
                <div className="relative pb-3/4 h-48">
                    {certified === 1 && (
                        <div
                            className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                            Certified
                        </div>
                    )}
                    <img
                        className="w-full h-full object-cover"
                        src={images[0] || '/images/hero-car.jpg'}
                        alt={title}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/hero-car.jpg';
                        }}
                    />
                </div>

                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {displayMakeName} {displayModelName}
                    </h3>
                    <p className="mt-1 text-lg font-bold text-blue-600">
                        {formattedPrice}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                            <FaTachometerAlt className="mr-1 text-gray-500"/>
                            <span>{formattedMileage} mi</span>
                        </div>
                        <div className="flex items-center">
                            <FaCalendarAlt className="mr-1 text-gray-500"/>
                            <span>{year}</span>
                        </div>
                        <div className="flex items-center">
                            <FaCar className="mr-1 text-gray-500"/>
                            <span>{displayBodyType}</span>
                        </div>
                        <div className="flex items-center">
                            <FaGasPump className="mr-1 text-gray-500"/>
                            <span>{displayFuelType}</span>
                        </div>
                    </div>

                    <button
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-300">
                        View Details
                    </button>
                </div>
            </Link>
        </div>
    );
};

VehicleCard.defaultProps = {
    make: {},
    model: {},
    images: [],
    makeName: '',
    modelName: '',
    fuelType: '',
    bodyType: ''
};

export default VehicleCard;
