import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import './Login.css';

export function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            localStorage.setItem('token', response.data.token);

            navigate('/dashboard');
        } catch (err: any) {
            const errMsg = err.response?.data?.message || 'Invalid email or password.';
            setError(errMsg);
        }
    };

    return (
        <div className="login-container">
        <div className="login-card">
        <h2 className="login-title">Sign In</h2>

        {error && (
            <div className="error-alert">
            {error}
            </div>
        )}

        <form onSubmit={handleSubmit}>
        <div className="form-group">
        <label className="form-label">Email Address</label>
        <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-input"
        placeholder="you@example.com"
        required
        />
        </div>

        <div className="form-group">
        <label className="form-label">Password</label>
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-input"
        placeholder="••••••••"
        required
        />
        </div>

        <button type="submit" className="submit-btn">
        Login
        </button>
        </form>

        <p className="redirect-text">
        Don't have an account?{' '}
        <Link to="/register" className="redirect-link">
        Register here
        </Link>
        </p>
        </div>
        </div>
    );
}
