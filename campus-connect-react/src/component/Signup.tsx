import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== repassword) {
      console.log('Passwords do not match');
      return;
    }

    const response = await axios.post(
      'http://localhost:3000/db/register',
      {
        userName: username,
        password,
        rpiEmail: email,
      },
      { withCredentials: true }
    );

    if (response.data.success) {
      console.log('Sign-up successful');
      const sessionData = response.data;
      console.log('Session Name:', sessionData.userName);

      navigate('/home', { state: { sessionData } });
    } else {
      console.log('Sign-up failed:', response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="border rounded-lg shadow-lg p-8 bg-white w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Sign Up
        </h1>
        <form>
          <div className="mb-4">
            <label className="text-gray-700 font-bold text-xl">
              Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-700 font-bold text-xl">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-700 font-bold text-xl">
              Re-enter Password:
            </label>
            <input
              type="password"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-700 font-bold text-xl">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            className="w-full bg-gradient-to-r from-blue-400 to-purple-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-2 rounded-lg transition-colors duration-300"
            type="button"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="mr-2">Already have an account?</span>
          <span >
            <Link
              to="/"
              className="text-blue-600 font-bold hover:text-blue-800 transition-colors duration-300"
            >Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
