import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from '@/axios.js';
import {useAuth} from '@/contexts/AuthContext';

const Create = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);
    const [features, setFeatures] = useState([]);
    const [currentFeature, setCurrentFeature] = useState('');

    // State for dropdown options
    const [categories, setCategories] = useState([]);
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [cities, setCities] = useState([]);
    const [transmissionTypes, setTransmissionTypes] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [bodyTypes, setBodyTypes] = useState([]);
    const [conditionTypes, setConditionTypes] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const [formData, setFormData] = useState({
        user_id: user?.id || 1,
        category_id: '',
        make_id: '',
        model_id: '',
        vehicle_registration_id: '',
        city_id: '',
        title: '',
        description: '',
        price: '',
        year: '',
        mileage: '',
        transmission_type: '',
        fuel_type: '',
        body_type: '',
        condition: '',
        location: '',
        is_featured: false,
        color: 'white'
    });

    // Fetch initial options on component mount
    useEffect(() => {
        const fetchInitialOptions = async () => {
            try {
                setLoadingOptions(true);

                // Fetch all options in parallel
                const [
                    categoriesRes,
                    registrationsRes,
                    citiesRes,
                    transmissionRes,
                    fuelRes,
                    bodyRes,
                    conditionRes
                ] = await Promise.all([
                    axios.get('/categories'),
                    axios.get('/vehicle-registration'),
                    axios.get('/cities'),
                    axios.get('/transmission-type'),
                    axios.get('/fuel-type'),
                    axios.get('/body-type'),
                    axios.get('/condition-type')
                ]);

                setCategories(categoriesRes.data.data || []);
                setRegistrations(registrationsRes.data.data || []);
                setCities(citiesRes.data.data || []);
                setTransmissionTypes(transmissionRes.data.data || []);
                setFuelTypes(fuelRes.data.data || []);
                setBodyTypes(bodyRes.data.data || []);
                setConditionTypes(conditionRes.data.data || []);

                // Set default values if options exist
                if (categoriesRes.data.data?.length) {
                    setFormData(prev => ({...prev, category_id: categoriesRes.data.data[0].id}));
                }
                if (registrationsRes.data.data?.length) {
                    setFormData(prev => ({...prev, vehicle_registration_id: registrationsRes.data.data[0].id}));
                }
                if (citiesRes.data.data?.length) {
                    setFormData(prev => ({...prev, city_id: citiesRes.data.data[0].id}));
                }
                if (transmissionRes.data.data?.length) {
                    setFormData(prev => ({...prev, transmission_type: transmissionRes.data.data[0]}));
                }
                if (fuelRes.data.data?.length) {
                    setFormData(prev => ({...prev, fuel_type: fuelRes.data.data[0]}));
                }
                if (bodyRes.data.data?.length) {
                    setFormData(prev => ({...prev, body_type: bodyRes.data.data[0]}));
                }
                if (conditionRes.data.data?.length) {
                    setFormData(prev => ({...prev, condition: conditionRes.data.data[0]}));
                }

            } catch (err) {
                console.error('Error fetching initial options:', err);
                setError('Failed to load form options. Please refresh the page.');
            } finally {
                setLoadingOptions(false);
            }
        };

        fetchInitialOptions();
    }, []);

    // Fetch makes when category_id changes
    useEffect(() => {
        if (formData.category_id) {
            const fetchMakes = async () => {
                try {
                    const res = await axios.get(`/makes/${formData.category_id}`);
                    setMakes(res.data.data || []);

                    // Reset make_id and model_id if the current ones are not in the new lists
                    if (res.data.data?.length && !res.data.data.some(m => m.id === formData.make_id)) {
                        setFormData(prev => ({
                            ...prev,
                            make_id: res.data.data[0].id,
                            model_id: '' // Reset model when make changes
                        }));
                    }
                } catch (err) {
                    console.error('Error fetching makes:', err);
                    setMakes([]);
                }
            };

            fetchMakes();
        } else {
            setMakes([]);
            setFormData(prev => ({...prev, make_id: '', model_id: ''}));
        }
    }, [formData.category_id]);

    // Fetch models when make_id changes
    useEffect(() => {
        if (formData.make_id) {
            const fetchModels = async () => {
                try {
                    const res = await axios.get(`/models/${formData.make_id}`);
                    setModels(res.data.data || []);

                    // Reset model_id if the current one is not in the new list
                    if (res.data.data?.length && !res.data.data.some(m => m.id === formData.model_id)) {
                        setFormData(prev => ({...prev, model_id: res.data.data[0].id}));
                    }
                } catch (err) {
                    console.error('Error fetching models:', err);
                    setModels([]);
                }
            };

            fetchModels();
        } else {
            setModels([]);
            setFormData(prev => ({...prev, model_id: ''}));
        }
    }, [formData.make_id]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const {name, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const addFeature = () => {
        if (currentFeature.trim() && !features.includes(currentFeature.trim())) {
            setFeatures([...features, currentFeature.trim()]);
            setCurrentFeature('');
        }
    };

    const removeFeature = (featureToRemove) => {
        setFeatures(features.filter(f => f !== featureToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();

            // Append all form data (convert boolean to 1/0 for is_featured)
            Object.entries({
                ...formData,
                is_featured: formData.is_featured ? 1 : 0
            }).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            // Append features as comma-separated string
            formDataToSend.append('features', features.join(','));

            // Append images
            images.forEach(image => {
                formDataToSend.append('images[]', image);
            });

            const response = await axios.post('/create-post', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                // navigate(`/vehicles/${response.data.data.id}`);
                navigate(`/vehicles`);
            } else {
                throw new Error(response.data.message || 'Failed to create vehicle');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to create vehicle');
            console.error('Create vehicle error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loadingOptions) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Listing</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Category</label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Make</label>
                            <select
                                name="make_id"
                                value={formData.make_id}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                                disabled={!formData.category_id || !makes.length}
                            >
                                {makes.length ? (
                                    makes.map(make => (
                                        <option key={make.id} value={make.id}>
                                            {make.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Select a category first</option>
                                )}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Model</label>
                            <select
                                name="model_id"
                                value={formData.model_id}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                                disabled={!formData.make_id || !models.length}
                            >
                                {models.length ? (
                                    models.map(model => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Select a make first</option>
                                )}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows="4"
                                required
                            />
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Registration</label>
                            <select
                                name="vehicle_registration_id"
                                value={formData.vehicle_registration_id}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                {registrations.map(reg => (
                                    <option key={reg.id} value={reg.id}>
                                        {reg.status} {reg.province ? `(${reg.province})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">City</label>
                            <select
                                name="city_id"
                                value={formData.city_id}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            >
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Price (Rs)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Year</label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Mileage (km)</label>
                                <input
                                    type="number"
                                    name="mileage"
                                    value={formData.mileage}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* More Vehicle Details */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">More Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Transmission</label>
                                <select
                                    name="transmission_type"
                                    value={formData.transmission_type}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    {transmissionTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Fuel Type</label>
                                <select
                                    name="fuel_type"
                                    value={formData.fuel_type}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    {fuelTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Body Type</label>
                                <select
                                    name="body_type"
                                    value={formData.body_type}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    {bodyTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Condition</label>
                                <select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    {conditionTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Color</label>
                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleCheckboxChange}
                                className="mr-2"
                                id="is_featured"
                            />
                            <label htmlFor="is_featured" className="text-gray-700">
                                Mark as Featured
                            </label>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Features</h2>

                        <div className="flex mb-4">
                            <input
                                type="text"
                                value={currentFeature}
                                onChange={(e) => setCurrentFeature(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-l-md"
                                placeholder="Add a feature (e.g., ABS, Sunroof)"
                            />
                            <button
                                type="button"
                                onClick={addFeature}
                                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {features.map(feature => (
                                <div key={feature} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                                    <span>{feature}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(feature)}
                                        className="ml-2 text-gray-500 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Images</h2>

                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="mb-4"
                            multiple
                            accept="image/*"
                            required
                        />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.length > 0 ? (
                                Array.from(images).map((image, index) => (
                                    <div key={index} className="border rounded-md p-2">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover"
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No images selected</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Listing'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Create;
