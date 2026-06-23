import { Types, Schema, model } from 'mongoose';


interface ITransaction {
    userId: Types.ObjectId;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: Date;
};

const transactionSchema = new Schema<ITransaction>({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    amount: {type: Number, required: true},
    type: {type: String, enum: ['income', 'expense'], required: true},
    category: {type: String, required: true},
    date: {type: Date, required: true}
}, {timestamps: true});

export const Transaction = model<ITransaction>('Transaction', transactionSchema);
