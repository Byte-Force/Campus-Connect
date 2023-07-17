import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
import Headers from './component/header';
import SideBar from './component/sideBar';
import FirstTimeLogin from './component/firstTimeLogin';
import CreatePostForm from './component/createPostForm';
import Signin from './component/signin';


function App() {
  return (
    <Router>
      <Headers />
      {/* <SideBar /> */}
      <Routes>
        {/* Define the route for Signin component */}
        <Route path="/signin" element={<Signin />} />

        {/* Other routes */}
        <Route path="/first-time-login" element={<FirstTimeLogin />} />
        <Route path="/create-post" element={<CreatePostForm />} />
      </Routes>
    </Router>
  );
}

export default App;
