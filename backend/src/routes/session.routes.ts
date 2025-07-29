import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createSession,
  listSessions,
  getSessionById,
  updateSessionTitle,
  deleteSession,
} from "../controllers/session.controller";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createSession);
router.get("/", listSessions);
router.get("/:id", getSessionById);
router.patch("/:id", updateSessionTitle);
router.delete("/:id", deleteSession);

export default router;
