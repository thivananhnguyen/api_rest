import React, { useState }  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './axiosConfig';
import { AuthProvider } from '././components/AuthContext';
import ProtectedRoute from '././components/ProtectedRoute';
import Login from './pages/Login';
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail..jsx'; 
import UserProfile from './pages/UserProfile';
import UserList from './pages/UserList';
import AddUser from './pages/AddUser.jsx';
import UserID from './pages/UserID.jsx';
import Navbar from './components/Navbar';


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
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/users" element={<UserList />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/user/:id" element={<UserID />} />
          </Route>

        </Routes>
      </Router>
   </AuthProvider> 
  );
}

export default App;
 
