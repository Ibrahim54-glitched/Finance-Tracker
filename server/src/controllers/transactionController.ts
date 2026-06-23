import type {Request, Response} from 'express';
import { Transaction } from '../models/Transaction.ts';
import type { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

export const addTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { title, amount, type, category, date } = req.body; 

        if (!title || !amount || !type || !category) {
            res.status(400).json({ message: 'Missing required Transaction'});
            return;
        }
        
        if (!req.user || !req.user.userId) {
            res.status(401).json({ message: 'Unauthorized: User context missing' });
            return;
        }

        const newTransaction = await Transaction.create({
            userId: req.user?.userId,
            title,
            amount,
            type,
            category,
            date: date ? new Date(date) : new Date()
        });

        res.status(201).json({
            message: 'Transaction saved successfully',
            transaction: newTransaction
        });

    } catch (error: any) {
        res.status(500).json ({
            message: 'Error saving transaction data',
            error: error.message
        });
    }
}
export const getTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.userId) {
            res.status(401).json({ message: 'Unauthorized: User context missing' });
            return;
        }

        const transactions = await Transaction.find({ userId: req.user?.userId }).sort({date: -1});

        res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        })

    } catch (error: any) {
        res.status(500).json({
            message: 'Error fetching transactions',
            error: error.message
        })
    }
};
export const updateTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, amount, type, category, date } = req.body;

        if (!req.user || !req.user.userId) {
            res.status(401).json({ message: 'Unauthorized: User context missing' });
            return;
        }

        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: id, userId: req.user.userId },
            { 
                title,
                amount,
                type,
                category,
                date: date ? new Date(date) : undefined
            },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedTransaction) {
            res.status(404).json({ message: 'Transaction not found or unauthorized' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Transaction updated successfully',
            transaction: updatedTransaction
        });

    } catch (error: any) {
        res.status(500).json({ 
            message: 'Error updating transaction', 
            error: error.message 
        });
    }
};

export const deleteTransaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!req.user || !req.user.userId) {
            res.status(401).json({ message: 'Unauthorized: User context missing' });
            return;
        }

        const deletedTransaction = await Transaction.findOneAndDelete({
            _id: id,
            userId: req.user.userId
        });

        if (!deletedTransaction) {
            res.status(404).json({ message: 'Transaction not found or unauthorized' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully',
            deletedId: id
        });

    } catch (error: any) {
        res.status(500).json({ 
            message: 'Error deleting transaction', 
            error: error.message 
        });
    }
};
