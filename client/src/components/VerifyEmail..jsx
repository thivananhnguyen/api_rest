import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setMessage('Invalid or missing token');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/verify-email', { token });
        setMessage(response.data.message);
        if (response.data.success) {
          // Redirect to login page after successful verification
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error verifying email');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div>
      <h2>Verify Email</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
