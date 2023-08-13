import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch

import HomePage from "./pages/HomePage.tsx";
//import LikeButton from './component/likebutton.tsx';
// import Signin from './component/signin';
import FirstTimeLoginPage from './pages/FirstTimeLoginPage.tsx';
// import EventBoard from './component/event.tsx';


///Pages 
import SigninPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreatePostPage from './pages/CreatePostPage.tsx';
import CategoryPostsPage from './pages/CategoryPostsPage.tsx';
import ContactUs from './pages/ContactUsPage.tsx';


function App() {
  return (
    <Router>
      {/* <div className="like-button-container">
          <LikeButton />
        </div> */}
      {/* {<div className="event-board-container">
          <EventBoard />
          </div>} */}


      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route path="/signin" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/first-time-login" element={<FirstTimeLoginPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />

        <Route path="/category/:category" element={<CategoryPostsPage />} />

        <Route path="/contact-us" element={<ContactUs />} />


      </Routes>
    </Router>
  );
}

export default App;
