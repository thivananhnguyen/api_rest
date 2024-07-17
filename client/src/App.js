import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import UserList from './pages/UserList.jsx';
import UserDetails from './pages/UserDetails.jsx';

/* import PrivateRoute from './pages/PrivateRoute';  */

const App = () => {
    return (
        <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/user/:id" element={<UserDetails />} />
                    <Route path="/" element={<Login />} />
                </Routes>
        </Router>
    );
};

export default App;
