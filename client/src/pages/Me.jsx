import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Me = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('http://localhost:5000/me', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setUser(res.data);
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Me</h1>
            {user ? (
                <div>
                    <p>ID: {user.id}</p>
                    <p>Username: {user.username}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Me;
