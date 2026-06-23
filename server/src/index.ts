// Dependencies
import express from 'express';
import type {Application,  Request, Response} from 'express';
import { connectDB } from './config/db.ts';
import cors from 'cors';

// My utils
import authRouter from './routes/auth.ts';
import transactionRouter from './routes/transactions.ts'

const app: Application = express();
const PORT: number = 5000;
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionRouter);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({message: "Hello World From Server"});
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT})`);
});
