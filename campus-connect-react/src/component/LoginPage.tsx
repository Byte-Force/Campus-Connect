import React, { useState } from 'react';
import './LoginPage.css'; // Import the CSS file

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
      <div className="login-form"> {/* Apply the 'login-form' class */}
        <form onSubmit={handleLogin}>
          <label style={{ display: 'block' }}>
            Login:
          </label>
          <label>
            Username:
            <br />
            <input type="text" value={username} onChange={handleUsernameChange} />
          </label>
          <br />
          <label>
            Password:
            <br />
            <input type="password" value={password} onChange={handlePasswordChange} />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
  );
};

export default LoginPage;
