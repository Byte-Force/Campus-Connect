import Logo from '../image/rmbg_logo.png';
import { Link } from 'react-router-dom';

/* 
creates the header for the website including the logo and the buttons to navigate
*/
export default function Headers() {
    return (
        <header className="bg-white-300">
            <div className="container mx-auto flex items-center justify-between p-4">
                <div className="flex items-center">
                    <img src={Logo} alt="Logo" className="w-12 h-12" />
                    <h1 className="text-xl font-bold text-black ml-2"></h1>
                </div>
                <nav>
                    <ul className="flex space-x-3">
                        <li>
                            <Link
                                to="/signin"
                                className="font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                            >
                                Sign up
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact-us"
                                className="font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                            >Contact Us</Link>
                        </li>
                    </ul>
                </nav>
            </div>


        </header>
    );
}
