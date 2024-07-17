import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Me from './pages/Me';
/* import PrivateRoute from './components/PrivateRoute'; */

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/me" element={<Me />} />
            </Routes>
        </Router>
    );
};

export default App;
