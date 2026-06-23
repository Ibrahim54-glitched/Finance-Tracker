
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Dashboard.css';

interface Transaction {
    _id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
}

export function Dashboard() {
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/transactions');

                const data = response.data.transactions || response.data;
                setTransactions(data);
            } catch (err: any) {
                console.error('Failed to pull transaction data:', err);
                setError('Could not load financial records. Please re-authenticate.');
            }
        };

        fetchTransactions();
    }, []);

    const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const handleLogout = (): void => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
        {/* Navbar Section */}
        <nav className="navbar">
        <div className="navbar-brand">FinanceTracker</div>
        <button onClick={handleLogout} className="logout-btn">
        Logout
        </button>
        </nav>

        {/* Main Content Area */}
        <main className="main-content">
        {error && <div className="error-alert">{error}</div>}

        {/* Real-time Computed Summary Cards Row */}
        <section className="summary-section">
        <div className="placeholder-card">
        <h3>Total Income</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.5rem' }}>
        ${totalIncome.toFixed(2)}
        </p>
        </div>
        <div className="placeholder-card">
        <h3>Total Expenses</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444', marginTop: '0.5rem' }}>
        ${totalExpenses.toFixed(2)}
        </p>
        </div>
        <div className="placeholder-card">
        <h3>Net Balance</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: balance >= 0 ? '#2563eb' : '#ef4444', marginTop: '0.5rem' }}>
        ${balance.toFixed(2)}
        </p>
        </div>
        </section>

        {/* Dynamic Transactions List Section */}
        <section className="transactions-section">
        <h2 className="section-title">Recent Transactions</h2>

        {transactions.length === 0 ? (
            <div className="placeholder-list">
            No transactions recorded yet. Start adding your income and expenses!
            </div>
        ) : (
        <div className="transaction-list-wrapper">
        {transactions.map((tx) => (
            <div key={tx._id} className="transaction-item-card">
            <div className="tx-info-block">
            <span className="tx-title">{tx.title}</span>
            <span className="tx-date">
            {new Date(tx.date).toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            })}
            </span>
            </div>
            <div className="tx-amount-block">
            <span className={`tx-amount ${tx.type}`}>
            {tx.type === 'income' ? '+' : '-'} ${tx.amount.toFixed(2)}
            </span>
            <span className="tx-badge">{tx.category}</span>
            </div>
            </div>
        ))}
        </div>
        )}
        </section>
        </main>
        </div>
    );
}

