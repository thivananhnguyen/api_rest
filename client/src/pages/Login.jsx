import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import PropTypes from 'prop-types'; 
import { useAuth } from '../components/AuthContext';

// Validation functions with regex
const validateEmail = (email) => {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regexEmail.test(email.trim());
};

const validatePassword = (password) => {
  const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  return regexPassword.test(password.trim());
};

const escapeHTML = (str) => {
  return str.replace(/[&<>"']/g, (match) => {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return escapeMap[match];
  });
};

const Login = ({ setIsLoggedIn }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    server: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (!emailValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Email invalide',
      }));
      return;
    }

    if (!passwordValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
      }));
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email: escapeHTML(email.trim()),
        password: escapeHTML(password.trim())
      });
      const userData = res.data;

      if (res.data.success) {
        const token = res.data.token;
        localStorage.setItem('token', token);
        console.log(token)
        localStorage.setItem('role', res.data.role);
        login(userData);
        setIsLoggedIn(true);
        setErrors({ email: '', password: '', server: '' });
        alert('Connexion réussie');
        navigate('/');
      } else {
        handleLoginFailure(res.data.message || 'Échec de la connexion');
      }
    } catch (err) {
      handleLoginFailure(err.response?.data?.message || 'Erreur lors de la connexion');
    }
  };

  const handleLoginFailure = (message) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      server: message
    }));
  };

  return (
    <MainContainer>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Login to your account" />
      </Helmet>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Connexion</Title>
        <InputLabel htmlFor="email">Votre email</InputLabel>
        <Input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
          required
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        <InputLabel htmlFor="password">Votre mot de passe</InputLabel>
        <Input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
          required
        />
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        {errors.server && <ErrorMessage>{errors.server}</ErrorMessage>}
        <Button type="submit">Se connecter</Button>
        <StyledLink to="/register">Pas de compte? Inscrivez-vous</StyledLink>
      </LoginForm>
    </MainContainer>
  );
};

// PropTypes
Login.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

// Styled-components
const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff;
`;

const LoginForm = styled.form`
  width: 20%;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  max-width: 600px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5em;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 1.25rem;
  line-height: 24px;
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

export default Login;

