import {Link} from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthLayout = ({children, auth}) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/*<div className="min-h-screen bg-gray-50 flex items-center justify-center">*/}
            <main>
                <div className="flex justify-center px-4 sm:px-6 lg:px-8">
                    {/*<div className="w-full max-w-7xl"> /!* Match landing page width *!/*/}
                    <div className="w-full max-w-md">
                        <div className="min-h-full flex flex-col justify-center py-12">
                            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                <Link to="/" className="flex justify-center">
                                    <img
                                        className="h-12 w-auto"
                                        src="/images/default-profile.png"
                                        alt="AutoMarket"
                                    />
                                </Link>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default AuthLayout;
