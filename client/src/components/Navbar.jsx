import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types'; 

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [setIsLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <NavbarContainer>
      <NavbarTitle>Admin Dashboard</NavbarTitle>
      <NavbarLinkContainer>
        <NavbarLink to="/users">Manage Users</NavbarLink>
        <NavbarLink to="/me">My Profile</NavbarLink>
        {isLoggedIn ? (
          <NavbarButton onClick={handleLogout}>Logout</NavbarButton>
        ) : (
          <NavbarLink to="/login">Login</NavbarLink>
        )}
      </NavbarLinkContainer>
    </NavbarContainer>
  );
};

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default Navbar;

// Styled components...
const NavbarContainer = styled.div`
  background-color: #add8e6; 
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const NavbarLinkContainer = styled.div`
  display: flex;
  align-items: center;
`;

const NavbarLink = styled(Link)`
  display: block;
  color: #333;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  
  &:hover {
    background-color: #ddd;
    color: black;
  }
`;

const NavbarButton = styled.button`
  display: block;
  color: #333;
  background: none;
  border: none;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    background-color: #ddd;
    color: black;
  }
`;

const NavbarTitle = styled.h2`
  color: #333;
  margin: 0;
  padding: 14px 16px;
`;
