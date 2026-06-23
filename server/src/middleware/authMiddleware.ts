import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}


export function protect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const secret_key = process.env.JWT_SECRET;
    
    if (!secret_key) {
        res.status(500).json({ message: 'Server error: missing secret key' });
        return;
    }

    const authHeader = req.headers.authorization; 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized: Missing or invalid token format'});
        return;
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = (jwt as any).verify(token, secret_key) as { userId: string, email: string };
        req.user = decoded;
        next();
    } catch (error: any) {
        res.status(401).json({ 
            message: 'Invalid or expired token.',
            debugReason: error.message 
        });
    }
}
