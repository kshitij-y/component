import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createSession,
  listSessions,
  getSessionById,
  updateSessionTitle,
} from "../controllers/session.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createSession);
router.get("/", listSessions);
router.get("/:id", getSessionById);
router.patch("/:id", updateSessionTitle);

export default router;
