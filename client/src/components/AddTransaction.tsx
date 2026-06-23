
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './AddTransaction.css';

interface Transaction {
    _id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
}

interface AddTransactionProps {
    onSuccess: () => void;
    onClose: () => void;
    initialData?: Transaction;
}

export function AddTransaction({ onSuccess, onClose, initialData }: AddTransactionProps) {
    const [title, setTitle] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [error, setError] = useState<string>('');

    const isEditing = !!initialData;

        useEffect(() => {
            if (initialData) {
                setTitle(initialData.title);
                setAmount(initialData.amount.toString());
                setType(initialData.type);
                setCategory(initialData.category);
                setDate(initialData.date.split('T')[0]);
            } else {
                setDate(new Date().toISOString().split('T')[0]);
            }
        }, [initialData]);

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
            e.preventDefault();
            setError('');

            const payload = {
                title,
                amount: Number(amount),
                type,
                category: category.trim().toLowerCase(),
                date: new Date(date).toISOString(),
            };

            try {
                if (isEditing && initialData) {
                    // Run update query targeting route parameters
                    await api.put(`/transactions/${initialData._id}`, payload);
                } else {
                    // Fallback to initial save route
                    await api.post('/transactions', payload);
                }

                onSuccess();
                onClose();
            } catch (err: any) {
                const errMsg = err.response?.data?.message || 'Failed to submit record changes.';
                setError(errMsg);
            }
        };

        return (
            <div className="modal-overlay">
            <div className="modal-card">
            <h2 className="modal-title">{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</h2>

            {error && <div className="error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-row">
            <label className="form-label">Transaction Title</label>
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            required
            />
            </div>

            <div className="form-row">
            <label className="form-label">Amount ($)</label>
            <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-control"
            min="0.01"
            required
            />
            </div>

            <div className="form-row">
            <label className="form-label">Transaction Type</label>
            <select
            value={type}
            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
            className="form-control"
            >
            <option value="expense">Expense (-)</option>
            <option value="income">Income (+)</option>
            </select>
            </div>

            <div className="form-row">
            <label className="form-label">Category</label>
            <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-control"
            required
            />
            </div>

            <div className="form-row">
            <label className="form-label">Date</label>
            <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
            required
            />
            </div>

            <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
            Cancel
            </button>
            <button type="submit" className="btn-submit">
            {isEditing ? 'Update Changes' : 'Save Record'}
            </button>
            </div>
            </form>
            </div>
            </div>
        );
}

