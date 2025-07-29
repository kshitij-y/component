import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { sendResponse } from "../utils/sendResponse";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    return sendResponse({
      res,
      statusCode: 401,
      success: false,
      message: "Unauthorized: Token missing",
    });
  }

  try {
    const payload = verifyToken(token);
    (req as any).userId = payload.userId;
    next();
  } catch {
    return sendResponse({
      res,
      statusCode: 401,
      success: false,
      message: "Invalid token",
    });
  }
};
