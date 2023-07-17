
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import LoginPage from './component/LoginPage';
import SignUp from './component/SignUp';

import './App.css'
import Headers from './component/header'
// import FirstTimeLogin from './component/firstTimeLogin'
import SideBar from './component/sideBar'
//import CreatePostForm from './component/createPostForm'

function App() {


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

    <>
      <Headers />
      {/* <FirstTimeLogin /> */}
      <SideBar />
      {/* <CreatePostForm /> */}
    </>
  )
}


export default App;
