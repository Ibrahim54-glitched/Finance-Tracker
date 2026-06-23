import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.ts';
import './Register.css';

export function Register() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/auth/register', {
                name,
                email,
                password,
            });

            navigate('/login');
        } catch (err: any) {
            const errMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
            setError(errMsg);
        }
    };

    return (
        <div className="register-container">
        <div className="register-card">
        <h2 className="register-title">Create an Account</h2>

        {error && (
            <div className="error-alert">
            {error}
            </div>
        )}

        <form onSubmit={handleSubmit}>
        <div className="form-group">
        <label className="form-label">Full Name</label>
        <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="form-input"
        placeholder="John Doe"
        required
        />
        </div>

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
        Register
        </button>
        </form>

        <p className="redirect-text">
        Already have an account?{' '}
        <Link to="/login" className="redirect-link">
        Login here
        </Link>
        </p>
        </div>
        </div>
    );
}
