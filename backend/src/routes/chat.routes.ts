import express from "express";
import { chatwithAI } from "../controllers/chat.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = express.Router();

router.post('/generate',authMiddleware, chatwithAI);

export default router;