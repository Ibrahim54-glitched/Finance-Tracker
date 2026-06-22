import express from 'express';
import type {Application,  Request, Response} from 'express';

import cors from 'cors';
import dotenv from 'dotenv';

const app: Application = express();
const PORT: number = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({message: "Hello World"});
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT})`);
});
