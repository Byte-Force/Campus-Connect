import { useState } from 'react';
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [email, setEmail] = useState('');


    const navigate = useNavigate();

    const handleSignUp = () => {
        // Perform sign-up logic here

        // After successful sign-up, navigate to the login page
        navigate('/'); // Replace '/login' with the path of your login page
    };
    return (
        <div className="border-r-gray-700 m-10 p-10 bg-gray-200">
            <label className="text-red-600 font-bold text-2xl flex items-center justify-center h-full">
                <h1>Sign Up</h1>
            </label>
            <form>
                <label className="text-black font-bold text-xl flex flex-col ">
                    Username:
                    <br />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br />
                <label className="text-black font-bold text-xl flex flex-col ">
                    Password:
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <label className="text-black font-bold text-xl flex flex-col ">
                    Re-enter Password:
                    <br />
                    <input
                        type="password"
                        value={repassword}
                        onChange={(e) => setRepassword(e.target.value)}
                    />
                </label>
                <br />
                <label className="text-black font-bold text-xl flex flex-col ">
                    Email:
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <br />
                <button
                    className="w-50 px-10 py-2 bg-red-500 text-white rounded cursor-pointer mx-auto mt-2 flex justify-center"
                    type="button"
                    onClick={handleSignUp}
                >
                    Sign Up
                </button>

            </form>
        </div>
    );
};

export default SignUp;
