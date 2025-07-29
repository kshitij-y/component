import express from "express";
import { generateComponent } from "../controllers/ai.controller";
const router = express.Router();

router.post('/generate', generateComponent);

export default router;