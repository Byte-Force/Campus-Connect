import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import LoginPage from './component/LoginPage';
import SignUp from './component/SignUp';
import './index.css';

const App: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <React.StrictMode>
      <div className="container">
        <div className="content">
          {showSignUp ? <SignUp /> : <LoginPage />}
        </div>
        <button className="toggle-button" onClick={() => setShowSignUp(!showSignUp)}>
          {showSignUp ? 'Go to Login' : 'Go to Sign Up'}
        </button>
      </div>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
