import express from "express";
import { signup, login, me, oauthLogin } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post('/oauth', oauthLogin);

router.get("/me", authMiddleware, me);

export default router;
