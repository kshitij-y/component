import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";
import { sendResponse } from "../utils/sendResponse";

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "User already exists",
    });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hashed } });

  const token = generateToken(user.id);
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
  const { id, name: username, email: userMail } = user;

  return sendResponse({
    res,
    statusCode: 201,
    message: "Signup successful",
    data: { id, name: username, email: userMail },
  });
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "Invalid credentials",
    });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "Invalid credentials",
    });
  }

  const token = generateToken(user.id);
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });

  const { id, name, email: userMail } = user;

  return sendResponse({
    res,
    message: "Login successful",
    success: true,
    data: {id, name, email: userMail},
  });
};

export const me = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return sendResponse({
      res,
      success: false,
      message: "no user found",
    });
  }
  const { id, name, email } = user;
  return sendResponse({
    res,
    message: "User fetched successfully",
    data: { id, name, email },
  });
};

export const oauthLogin = async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "Missing Google ID token",
    });
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    return sendResponse({
      res,
      statusCode: 401,
      success: false,
      message: "Invalid Google ID token",
    });
  }

  if (!payload || !payload.sub || !payload.email) {
    return sendResponse({
      res,
      statusCode: 401,
      success: false,
      message: "Google token payload missing required info",
    });
  }

  const provider = "google";
  const providerId = payload.sub;
  const email = payload.email;

  let user = await prisma.user.findFirst({
    where: { provider, providerId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { email, provider, providerId },
    });
  }

  const token = generateToken(user.id);
  res.cookie("token", token, { httpOnly: true, sameSite: "lax" });

  return sendResponse({
    res,
    message: "OAuth login successful",
    data: user,
  });
};

export const signout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });

    return sendResponse({
      res,
      message: "Signout successful",
      success: true,
    });
  } catch (err) {
    return sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: "Something went wrong during signout",
    });
  }
};