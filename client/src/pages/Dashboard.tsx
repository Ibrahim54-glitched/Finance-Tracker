import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AddTransaction } from '../components/AddTransaction';
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
  const [showForm, setShowForm] = useState<boolean>(false);
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await api.get('/transactions');
      const data = response.data.transactions || response.data;
      setTransactions(data);
    } catch (err: any) {
      console.error('Failed to pull transaction data:', err);
      setError('Could not load financial records. Please log in again.');
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await api.delete(`/transactions/${id}`);
      
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete transaction.');
    }
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(undefined);
  };

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
      <nav className="navbar">
        <div className="navbar-brand">FinanceTracker</div>
        <div className="navbar-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setShowForm(true)} className="btn-add-transaction">
            + Add Transaction
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        {error && <div className="error-alert">{error}</div>}

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

        <section className="transactions-section">
          <h2 className="section-title">Recent Transactions</h2>
          
          {transactions.length === 0 ? (
            <div className="placeholder-list">
              No transactions recorded yet. Click "+ Add Transaction" to begin tracking!
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
                  
                  {/* Interactive Button Wrapper Layout Block */}
                  <div className="tx-actions-block" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div className="tx-amount-block">
                      <span className={`tx-amount ${tx.type}`}>
                        {tx.type === 'income' ? '+' : '-'} ${tx.amount.toFixed(2)}
                      </span>
                      <span className="tx-badge">{tx.category}</span>
                    </div>

                    <div className="item-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenEdit(tx)} className="btn-edit-item">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(tx._id)} className="btn-delete-item">
                        Delete
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <AddTransaction 
          onSuccess={fetchTransactions} // Full fetch triggers recalculations for edits safely
          onClose={handleCloseForm}
          initialData={editingTransaction} // Passes object data to fill inputs smoothly
        />
      )}
    </div>
  );
}

