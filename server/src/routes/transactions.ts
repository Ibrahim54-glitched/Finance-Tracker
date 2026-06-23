import { Router } from "express";
import { addTransaction } from "../controllers/transactionController.ts";
import { getTransaction } from "../controllers/transactionController.ts";
import { updateTransaction } from "../controllers/transactionController.ts";
import { deleteTransaction } from "../controllers/transactionController.ts";
import { protect } from "../middleware/authMiddleware.ts";

const router = Router();

router.use(protect);

router.post('/', addTransaction);
router.get('/', getTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
