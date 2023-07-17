import { Link } from 'react-router-dom';
import Logo from '../image/rmbg_logo.png';


/* 
creates the header for the website including the logo and the the buttons to navigate
*/
export default function Headers() {

    return (
        <header className="flex items-center justify-between  bg-gray-200">
            <div className="flex items-center">
                <img src={Logo} alt="Logo" className="w-20 h-20 ml-6" />

            </div>
            <nav>
                <ul className="flex space-x-4 mr-10">
                    <li>
                        <Link to="/signin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Sign In
                        </Link>
                    </li>
                    {/* <li>
                        <a href="#" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Sign Up
                        </a>
                    </li>
                    <li>
                        <a href="#" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            About Us
                        </a>
                    </li>
                    <li>
                        <a href="#" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Contact
                        </a>
                    </li> */}

                </ul>
            </nav>
        </header>
    )
}



