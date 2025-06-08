import './style.css';
import TourList from "./components/TourList";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Main from "./pages/main";
import ContactUs from "./pages/contactus";
import UserPage from "./pages/userpage";
import LogIn from './pages/login';
import SignUp from './pages/signup';
import Profile from './pages/profile';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
      <Route exact path="/" element={<Main />} />
        <Route exact path="/main" element={<Main />} />
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
