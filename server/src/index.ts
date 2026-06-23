import express from 'express';
import type {Application,  Request, Response} from 'express';

import { connectDB } from './config/db.ts';
import cors from 'cors';
import router from './routes/auth.ts';

const app: Application = express();
const PORT: number = 5000;
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', router);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({message: "Hello World From Server"});
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT})`);
});
