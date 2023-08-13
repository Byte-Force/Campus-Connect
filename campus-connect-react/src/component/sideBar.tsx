import Home from "../image/home.png"; // Have to fix this


import { Link } from 'react-router-dom';

const categories = ["IT", "Computer Science", "Business", "Engineering", "Science", "Mathematics", "Arts", "Music", "Sports", "Health", "Other"];

// a sidebar that will display all the categories in the homepage
export default function SideBar() {
    return (
        <div >
            <div className="p-10">
                <div className="flex items-center mb-6">
                    <img src={Home} alt="Home Icon" className="w-6 h-6 " />
                    <Link to="/home" className="text-xl font-bold  hover:text-gray-500">
                        Home
                    </Link>
                    {/* <a href="#" className="text-xl font-bold  hover:text-gray-500">
                        Home
                    </a> */}
                </div>


                <ul className="space-y-2">
                    {categories.map((category) => (
                        <li
                            key={category}
                            className="text-xl font-bold cursor-pointer hover:text-gray-500"
                        >
                            <Link to={`/category/${category}`}>{category}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Your main content goes here */}
        </div>
    );
}
