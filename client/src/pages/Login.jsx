import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters')
});

const Login = ({ history }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('http://localhost:5000/login', data);
            localStorage.setItem('token', res.data.token);
            history.push('/me');
        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Name</label>
                    <input name="name" {...register('name')} />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>
                <div>
                    <label>Password</label>
                    <input name="password" type="password" {...register('password')} />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
