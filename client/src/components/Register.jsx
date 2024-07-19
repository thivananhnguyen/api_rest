import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

// Function to escape HTML characters
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

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    server: ''
  });

  const { username, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { username: '', email: '', password: '', confirmPassword: '', server: '' };

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

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

    if (trimmedPassword !== trimmedConfirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Trim and escape inputs
    const escapedUsername = escapeHtml(username.trim());
    const escapedEmail = escapeHtml(email.trim());
    const escapedPassword = password.trim();

    try {
      const res = await axios.post('http://localhost:5000/api/register', {
        username: escapedUsername,
        email: escapedEmail,
        password: escapedPassword,
        confirmPassword: confirmPassword.trim()
      });
      
      if (res.data.success) {
        alert(res.data.message);
        navigate('/login');
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          server: res.data.message || 'Registration failed'
        }));
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          server: err.response.data.message
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          server: 'Error registering user'
        }));
      }
    }
  };

  return (
    <MainContainer>
      <Helmet>
        <title>Register</title>
        <meta name="description" content="Register for an account" />
      </Helmet>
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <Title>Inscription</Title>
          <FormGroup>
            <Label htmlFor="username">Nom</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              required
            />
            {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              required
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          </FormGroup>
          <Button type="submit">S'inscrire</Button>
          {errors.server && <ErrorMessage>{errors.server}</ErrorMessage>}
          <p>Déjà Inscrit? <StyledLink to="/login">Connectez-vous</StyledLink></p>
        </Form>
      </FormContainer>
    </MainContainer>
  );
};

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
  width: 100%;
  height: 50px;
  padding: 0.25rem;
  font-size: 1rem;
  color: #FFFFFF;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: #007BFF;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  margin-top: 1em;

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

export default Register;