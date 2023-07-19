import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch

import HomePage from "./pages/HomePage.tsx";
import FirstTimeLoginPage from './pages/FirstTimeLoginPage.tsx';


///Pages 
import SigninPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreatePostPage from './pages/CreatePostPage.tsx';

function App() {
  return (
    <Router>




      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route path="/signin" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/first-time-login" element={<FirstTimeLoginPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />

      </Routes>
    </Router>
  );
}

export default App;
