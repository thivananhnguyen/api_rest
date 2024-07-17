import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
        setName(response.data.username);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedUser = { username: name, email, password };
      await axios.put(`http://localhost:5000/api/user/${id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Xử lý khi cập nhật thành công, có thể chuyển hướng hoặc cập nhật UI tại đây
      navigate('/users');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Xử lý khi xóa thành công, có thể chuyển hướng hoặc cập nhật UI tại đây
      navigate('/users');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h2>User Details</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleUpdate}>Update User</button>
      <button onClick={handleDelete}>Delete User</button>
    </div>
  );
};

export default UserDetails;
