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

// Function to validate password
const validatePassword = (password) => {
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return regexPassword.test(password.trim());
};

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!validatePassword(password)) {
      setErrorMessage('Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    const escapedUsername = escapeHtml(username);
    const escapedEmail = escapeHtml(email);
    const escapedPassword = escapeHtml(password);
  try {
    const updatedUser = { username: escapedUsername, email: escapedEmail };
    if (escapedPassword) {
        updatedUser.password = escapedPassword;
    }

    const res = await axios.put(`http://localhost:5000/api/user/${id}`, updatedUser);
    // Extract and display the detailed message from the response
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
      <FormContainer>
        <Title>User Detail</Title>
        <Form>
          <FormGroup>
            <Label>Username:</Label>
            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label>Email:</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label>Password:</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormGroup>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Button onClick={handleUpdate}>Update User</Button>
          <Button onClick={handleDelete}>Delete User</Button>
          <StyledLink to="/users">Back to Users</StyledLink>
        </Form>
      </FormContainer>
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

const FormContainer = styled.div`
  width: 20%;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 600px;
`;

const Form = styled.form`
  width: 100%;
`;

const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 1em;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5em;
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

const Button = styled.button`
  width: 50%;
  height: 50px;
  padding: 0.25rem;
  font-size: 1.2rem;
  color: #FFFFFF;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: #007BFF;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  margin-top: .5em;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
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
