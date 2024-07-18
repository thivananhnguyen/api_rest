import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AddUser = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

  const handleAddUser = async () => {

    try {
      const newUser = { username, email, password};
      await axios.post('http://localhost:5000/api/add-user', newUser);
      alert('User added successfully');
      navigate('/users');
    } catch (error) {
      console.error('Error adding user:', error.response ? error.response.data : error);
      setErrorMessage('Failed to add user');
    }
  };

  return (
    <Container>
      <Title>Add User</Title>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
      <Button onClick={handleAddUser}>Submit</Button>
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