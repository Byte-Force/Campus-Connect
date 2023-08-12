import { useState } from "react";
import { useNavigate } from 'react-router-dom';


//Lets the user select the categories that they want to follow or are more interested in

const Grid = () => {
    const [selectedPills, setSelectedPills] = useState<number[]>([]);

    const handlePillClick = (pill: number) => {
        if (selectedPills.includes(pill)) {
            setSelectedPills(selectedPills.filter((selectedPill) => selectedPill !== pill));
        } else {
            setSelectedPills([...selectedPills, pill]);
        }
    };
    // categories name
    const pillNames = ['alb', 'c', 'd', 'e', 'eve', 'e', 'e', 'e', 'bye'];
    return (
        <div className="grid grid-cols-3 gap-4">
            {pillNames.map((pill, index) => (
                <span
                    key={index}
                    className={`inline-block p-3 text-lg m-4 rounded-full bg-gray-200 text-gray-800 ${selectedPills.includes(index) ? 'bg-gray-400 text-white ' : ''}`}
                    onClick={() => handlePillClick(index)}
                >
                    {'#' + pill}
                </span>
            ))}

        </div>
    );
};


export default function FirstTimeLogin() {
    const [usrname] = useState("Wendy");
    const navigate = useNavigate();

    function handeleNext() {
        navigate('/home');
    }

    return (
        <div className="text-center">
            <div>
                <h1 className="text-4xl p-4">Welcome {usrname} ...</h1>
                <p className="m-5">Follow 5 or more categories to get started</p>
            </div>

            {/* body of the selection */}
            <div>
                <Grid />
                <div className="flex justify-end">
                    <button onClick={handeleNext} className="px-4 py-2 m-10 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
