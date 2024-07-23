import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

// Escape HTML function
const escapeHtml = (unsafe) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return unsafe.replace(/[&<>"']/g, (m) => map[m]);
};

// Function to validate email
const validateEmail = (email) => {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexEmail.test(email.trim());
};

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${id}`);
        setUser(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleUpdate = async () => {
    if (!validateEmail(email)) {
      setErrorMessage('Invalid email format');
      return;
    }

    const escapedUsername = escapeHtml(username.trim());
    const escapedEmail = escapeHtml(email.trim());

    try {
      const updatedUser = { username: escapedUsername, email: escapedEmail };

      const res = await axios.put(`http://localhost:5000/api/user/${id}`, updatedUser);
      if (res.data.success) {
        alert(res.data.message || 'User updated successfully!');
        navigate('/users');
      } else {
        setErrorMessage(res.data.message || 'Failed to update user');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Failed to update user');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${id}`);
      alert('User deleted successfully!');
      navigate('/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage('Failed to delete user');
    }
  };

  return (
    <MainContainer>
      <Helmet>
        <title>User Detail</title>
      </Helmet>
      <TableContainer>
        <Title>User Details</Title>
        <Table>
          <tbody>
            <TableRow>
              <TableHeader>ID:</TableHeader>
              <TableData>{user.id}</TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Username:</TableHeader>
              <TableData>
                <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              </TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Email:</TableHeader>
              <TableData>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </TableData>
            </TableRow>
            <ErrorContainer>
              {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            </ErrorContainer>
            <TableRow>
              <TableHeader>Role:</TableHeader>
              <TableData>{user.role}</TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Is Verified:</TableHeader>
              <TableData>{user.is_verified ? 'Yes' : 'No'}</TableData>
            </TableRow>
            <TableRow>
              <TableHeader>Locked Until:</TableHeader>
              <TableData>{user.locked_until || 'N/A'}</TableData>
            </TableRow>
          </tbody>
        </Table>
        <ButtonGroup>
          <UpdateButton onClick={handleUpdate}>Update User</UpdateButton>
          <DeleteButton onClick={handleDelete}>Delete User</DeleteButton>
        </ButtonGroup>
        <StyledLink to="/users">Back to Users</StyledLink>
      </TableContainer>
    </MainContainer>
  );
};

export default UserDetail;

// Styled-components
const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff;
`;

const TableContainer = styled.div`
  width: 50%;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center; 
  max-width: 800px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 0.5rem;
  font-weight: bold;
`;

const TableData = styled.td`
  padding: 0.5rem;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.21);
  box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  border: none;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border: 2px solid #87CEEB;
    box-shadow: 0 0 8px rgba(135, 206, 235, 0.8);
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1em; 
  width: 100%;
  margin-top: 1em; 
`;


const Button = styled.button`
  height: 50px;
  padding: 0.25rem 2rem;
  font-size: 1.2rem;
  color: #FFFFFF;
  border: none;
  outline: none;
  cursor: pointer;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  margin: 0;

  &:hover {
    transform: scale(1.05);
  }
`;

const UpdateButton = styled(Button)`
  background-color: #007BFF;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #FF4C4C;

  &:hover {
    background-color: #e03c3c;
  }
`;


const ErrorMessage = styled.p`
  color: red;
  margin-top: 0.5em;
`;

const StyledLink = styled(Link)`
  color: #007BFF;
  text-decoration: none;
  margin-top: 1em;

  &:hover {
    text-decoration: underline;
  }
`;
const ErrorContainer = styled.div`
  width: 100%;
  text-align: center; 
  margin-top: 1em;
`;

