import { useState } from 'react';
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


        // Access the session data from the server response and display the session name
        const sessionData = response.data;
        console.log('Session Name:', sessionData.userName);
        //console.log('Session Name:', sessionData.userName); // Adjust the property name based on your session data

        navigate('/home');
      } else {
        console.log('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  return (
    <div className="border-r-gray-700 m-10 p-10 bg-gray-200">
      <form onSubmit={handleLogin}>
        <label className="block">
          <label className="text-red-600 font-bold text-2xl flex items-center justify-center h-full">
            Login:
          </label>
        </label>
        <label className="text-black font-bold text-xl flex flex-col items-center justify-center">
          Username:
          <br />
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label className="text-black font-bold text-xl flex flex-col items-center justify-center">
          Password:
          <br />
          <input className="w-80 px-1 mx-auto text-lg font-bold" type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <br />
        <button className="w-50 px-10 py-2 bg-red-500 text-white rounded cursor-pointer mx-auto mt-2 flex justify-center" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
