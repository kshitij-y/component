import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import sessionRoutes from "./routes/session.routes";
import aiRoutes from "./routes/ai.routes"
import chatRoutes from "./routes/chat.routes"

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL! , 'https://component-sigma-two.vercel.app' , 'http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);

const PORT = parseInt(process.env.PORT!);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
