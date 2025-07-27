import { Response } from "express";

interface SendResponseProps<T> {
  res: Response;
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: T;
}

export function sendResponse<T>({
  res,
  statusCode = 200,
  success = true,
  message = "Request successful",
  data,
}: SendResponseProps<T>) {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
}
