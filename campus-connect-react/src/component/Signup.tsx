import React, { useState } from 'react';
const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [email, setEmail] = useState('');
  
    const handleSignUp = () => {
      // Perform sign-up logic here
    };
  
    return (
      <div>
        <h1>Sign Up</h1>
        <form>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <label>
            Re-enter Password:
            <input
              type="password"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <br />
          <button type="button" onClick={handleSignUp}>
            Sign Up
          </button>
        </form>
      </div>
    );
  };
  
  export default SignUp;
  