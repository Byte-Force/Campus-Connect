import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Logging in with:', username, password);

    try {
      const response = await axios.post(
        'http://localhost:3000/db/login',
        {
          userName: username,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log('Login successful');
        setUsername('');
        setPassword('');

        // Access the session data from the server response and pass it as state while navigating
        const sessionData = response.data;
        console.log('Session Name:', sessionData.userName);
        navigate('/home', { state: { sessionData } });

      } else {
        console.log('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="border rounded-lg shadow-lg p-8 bg-white w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="text-gray-700 font-bold text-xl">Username:</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-700 font-bold text-xl">Password:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            className="w-full bg-gradient-to-r from-blue-400 to-purple-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-2 rounded-lg transition-colors duration-300"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
