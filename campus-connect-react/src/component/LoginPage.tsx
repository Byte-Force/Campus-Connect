import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Perform login logic here using username and password
    console.log('Logging in with:', username, password);
    // Clear form fields after login
    setUsername('');
    setPassword('');
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

export default LoginPage;
