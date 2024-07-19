/* import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const role =  localStorage.getItem('role');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Users List</title>
      </Helmet>
      <Header>
        <Title>Users List</Title>  
        {role === 'admin' && (
          <AddButton onClick={() => navigate('/add-user')}>Add User</AddButton>
        )}
      </Header>
      { (role === 'admin') ? (
        <Table>
        <TableHead>
          <TableRow>
            <TableHeader>ID</TableHeader>
            <TableHeader>Username</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Action</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell><Link to={`/user/${user.id}`}>{user.username}</Link></TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button onClick={() => navigate(`/user/${user.id}`)}>Update</Button>
                <Button onClick={() => handleDeleteUser(user.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
        ):
         (
          <p>You have no right to access</p>
        )}

    </Container>
  );
};

export default UsersList;

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  flex-grow: 1;
  text-align: center;
  margin: 0;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1e88e5;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const TableHead = styled.thead`
  background-color: #f2f2f2;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button`
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  &:last-child {
    background-color: #f44336;
  }

  &:last-child:hover {
    background-color: #d32f2f;
  }
`; */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Users List</title>
      </Helmet>
      <Header>
        <Title>Users List</Title>  
        {role === 'admin' && (
          <AddButton onClick={() => navigate('/add-user')}>Add User</AddButton>
        )}
      </Header>
      {role === 'admin' ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Username</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Locked</TableHeader>
              <TableHeader>Lock Until</TableHeader>
              <TableHeader>Action</TableHeader>
            </TableRow>
          </TableHead>
          <tbody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell><Link to={`/user/${user.id}`}>{user.username}</Link></TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.is_locked ? 'Yes' : 'No'}</TableCell>
                <TableCell>{user.lock_until ? new Date(user.lock_until).toLocaleString() : 'N/A'}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/user/${user.id}`)}>Update</Button>
                  <Button onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>You have no right to access</p>
      )}
    </Container>
  );
};

export default UsersList;

// Styled components
const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  flex-grow: 1;
  text-align: center;
  margin: 0;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1e88e5;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
`;

const TableHead = styled.thead`
  background-color: #f2f2f2;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button`
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  &:last-child {
    background-color: #f44336;
  }

  &:last-child:hover {
    background-color: #d32f2f;
  }
`;
