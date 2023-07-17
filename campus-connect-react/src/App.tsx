import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import LoginPage from './component/LoginPage';
import SignUp from './component/SignUp';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Login</Link>
          </li>
          <li>
            {/*<Link to="/signup">Sign Up</Link>*/}
          </li>
        </ul>
      </div>

      <Route path="/" exact component={LoginPage} />
      <Route path="/signup" component={SignUp} />
    </Router>
  );
};

export default App;
