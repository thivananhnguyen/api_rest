import React, { useState }  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import UserList from './pages/UserList.jsx';
import AddUser from './pages/AddUser.jsx';
import UpdateUserID from './pages/UpdateUserID';
import Navbar from './components/Navbar';
import './axiosConfig';
import { AuthProvider } from '././components/AuthContext';
import ProtectedRoute from '././components/ProtectedRoute';

const App = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/me" element={<UserProfile />} />

          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/users" element={<UserList />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/user/:id" element={<UpdateUserID />} />
          </Route>
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
 
