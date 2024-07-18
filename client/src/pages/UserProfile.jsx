import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/me');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>My Profile</h2>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
    </div>
  );
};

export default MyProfile;
