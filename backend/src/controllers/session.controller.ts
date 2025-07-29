import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../utils/sendResponse";

const prisma = new PrismaClient();

export const createSession = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { title } = req.body;

  const session = await prisma.session.create({
    data: {
      userId,
      title: title || "New Session",
    },
  });

  return sendResponse({
    res,
    statusCode: 201,
    message: "Session created",
    data: session,
  });
};

export const listSessions = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return sendResponse({
    res,
    message: "Sessions fetched",
    data: sessions,
  });
};

export const getSessionById = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const sessionId = req.params.id;

  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId },
    include: { chats: true},
  });

  if (!session) {
    return sendResponse({
      res,
      statusCode: 404,
      success: false,
      message: "Session not found",
    });
  }

  return sendResponse({
    res,
    message: "Session fetched",
    data: session,
  });
};

export const updateSessionTitle = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const sessionId = req.params.id;
  const { title } = req.body;

  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId },
  });
  if (!session) {
    return sendResponse({
      res,
      statusCode: 404,
      success: false,
      message: "Session not found",
    });
  }

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: { title },
  });

  return sendResponse({
    res,
    message: "Session title updated",
    data: updated,
  });
};

export const deleteSession = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const sessionId = req.params.id;

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });

    if (!session) {
      return sendResponse({
        res,
        statusCode: 404,
        success: false,
        message: "Session not found",
      });
    }

    if (session.userId !== userId) {
      return sendResponse({
        res,
        statusCode: 403,
        success: false,
        message: "Unauthorized to delete this session",
      });
    }

    await prisma.session.delete({
      where: { id: sessionId },
    });

    return sendResponse({
      res,
      message: "Session deleted successfully",
      success: true,
    });
  } catch (error) {
    return sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: "Failed to delete session",
    });
  }
};
