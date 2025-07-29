import express from "express";
import { signup, signin, me, oauthLogin, signout } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post('/oauth', oauthLogin);

router.get("/me", authMiddleware, me);

export default router;
