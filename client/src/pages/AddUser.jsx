import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

const validateEmail = (email) => {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexEmail.test(email.trim());
};

const validatePassword = (password) => {
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return regexPassword.test(password.trim());
};

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' 
  });

  const [errorMessage, setErrorMessage] = useState({
    username: '',
    email: '',
    password: '',
    server: ''
  });

  const { username, email, password, role } = formData;

  const validateForm = () => {
    let valid = true;
    const newErrors = { username: '', email: '', password: '', server: '' };

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername) {
      newErrors.username = "Le champ nom ne doit pas être vide.";
      valid = false;
    }

    if (!validateEmail(trimmedEmail)) {
      newErrors.email = "L'adresse e-mail n'est pas valide.";
      valid = false;
    }

    if (!validatePassword(trimmedPassword)) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.";
      valid = false;
    }

    setErrorMessage(newErrors);
    return valid;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Trim and escape inputs
    const escapedUsername = escapeHtml(username.trim());
    const escapedEmail = escapeHtml(email.trim());
    const escapedPassword = password.trim();

    try {
      const res = await axios.post('http://localhost:5000/api/add-user', {
        username: escapedUsername,
        email: escapedEmail,
        password: escapedPassword,
        role: role
      });

      if (res.data.success) {
        alert(res.data.message);
        navigate('/users');
      } else {
        setErrorMessage((prevErrors) => ({
          ...prevErrors,
          server: res.data.message || 'Add failed'
        }));
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage((prevErrors) => ({
          ...prevErrors,
          server: err.response.data.message
        }));
      } else {
        setErrorMessage((prevErrors) => ({
          ...prevErrors,
          server: 'Error add user'
        }));
      }
    }
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  return (
    <Container>
      <Title>Add User</Title>
      {errorMessage.server && <p style={{ color: 'red' }}>{errorMessage.server}</p>}
      <form onSubmit={handleAddUser}>
        <FormGroup>
          <Label>Username:</Label>
          <Input type="text" value={username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          {errorMessage.username && <Error>{errorMessage.username}</Error>}
        </FormGroup>
        <FormGroup>
          <Label>Email:</Label>
          <Input type="email" value={email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          {errorMessage.email && <Error>{errorMessage.email}</Error>}
        </FormGroup>
        <FormGroup>
          <Label>Password:</Label>
          <Input type="password" value={password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          {errorMessage.password && <Error>{errorMessage.password}</Error>}
        </FormGroup>
        <FormGroup>
          <Label>Role:</Label>
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                value="user"
                checked={role === 'user'}
                onChange={handleRoleChange}
              />
              User
            </RadioLabel>
            <RadioLabel>
              <RadioInput
                type="radio"
                value="admin"
                checked={role === 'admin'}
                onChange={handleRoleChange}
              />
              Admin
            </RadioLabel>
          </RadioGroup>
        </FormGroup>
        <Button type="submit">Submit</Button>
      </form>
    </Container>
  );
};

export default AddUser;

const Container = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 2em;
`;

const Title = styled.h2`
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const RadioLabel = styled.label`
  margin-bottom: 5px;
`;

const RadioInput = styled.input`
  margin-right: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1e88e5;
  }
`;

const Error = styled.span`
  color: red;
  font-size: 0.8em;
`;
