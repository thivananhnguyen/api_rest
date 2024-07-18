import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const newUser = { username, email, password, confirmPassword };
      await axios.post('http://localhost:5000/api/users', newUser);
      alert('User added successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error adding user:', error.response ? error.response.data : error);
      setErrorMessage('Failed to add user');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </div>
      <button onClick={handleRegister}>Register</button>
      <p>Pas de compte? <Link to="/login">Connectez-vous</Link></p>
    </div>
  );
};

export default Register;
