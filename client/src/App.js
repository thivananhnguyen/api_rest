import React, { useState }  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import UserList from './pages/UserList.jsx';
import AddUser from './pages/AddUser.jsx';
import UserDetails from './pages/UserDetails';
import Navbar from './components/Navbar';
import './axiosConfig';

const App = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <Router>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Routes>
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/me" element={<UserProfile />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/user/:id" element={<UserDetails />} />
            </Routes>
        </Router>
    );
};

export default App;
