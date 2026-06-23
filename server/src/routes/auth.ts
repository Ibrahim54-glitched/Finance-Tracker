import {Router} from 'express';
import { loginUser, registerUser } from '../controllers/authController.ts';
import { protect } from '../middleware/authMiddleware.ts';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/test', protect, (req, res) => {
    res.json({ message: "You are authorized!" });
});

export default router;
