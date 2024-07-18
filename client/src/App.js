import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import UserList from './pages/UserList.jsx';
import UserDetails from './pages/UserDetails';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/me" element={<UserProfile />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/user/:id" element={<UserDetails />} />
                <Route path="/" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
