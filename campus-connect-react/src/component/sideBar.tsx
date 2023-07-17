
import Home from "../image/home.png"; //Have to fix this 
import Event from "../image/calendar.png";


const categories = ["IT", "Computer Science", "Events"];

export default function SideBar() {

    return (
        <div className="flex h-screen">
            <div className="w-64 h-981 flex-shrink-0 bg-gray-200 p-10">
                <div className="flex items-center mb-6">

                    <img src={Home} alt="Home Icon" className="w-6 h-6 mr-2" />
                    <a href='#' className="text-xl font-bold  hover:text-gray-500">Home</a>
                </div>
                <div className="flex items-center mb-6">
                    <img src={Event} alt="Event Icon" className="w-6 h-6 mr-2 " />
                    <a href="#events" className="text-xl font-bold  hover:text-gray-500">Events</a>
                </div>

                <ul className="space-y-2">
                    {categories.map((category) => (
                        <li
                            key={category}
                            className="text-xl font-bold cursor-pointer hover:text-gray-500"
                            onClick={() => console.log(`Clicked on ${category}`)}
                        >
                            {category}
                        </li>
                    ))}
                </ul>
            </div>
            {/* Your main content goes here */}
        </div>
    );
}