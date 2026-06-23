import { type Request, type Response, type NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.ts';
import jwt from 'jsonwebtoken';

export async function registerUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({message: 'All fields are required'});
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const userResponse = newUser.toObject();
        delete (userResponse as Partial<typeof userResponse>).password;

        res.status(201).json({
            message: 'User registered successfully',
            user: userResponse
        })

    } catch (error: any) {
        if (error.code === 11000) {
            res.status(409).json({ message: 'Email already exists'});
            return;
        }
        next(error);
    }
}
export async function loginUser(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const user = await User.findOne({email: email.toLowerCase().trim()}).select('+password');
    if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials' })
    }

    const secret_key = process.env.JWT_SECRET;
    if (!secret_key) {
        throw new Error('JWT_SECRET is missing from env variables');
    }

    const payload = {
        userId: user._id,
        email: user.email
    };
    const token = jwt.sign(
        payload, 
        secret_key, 
        { expiresIn: '1h' }
    );

    res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
}

