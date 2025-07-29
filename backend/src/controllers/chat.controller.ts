import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sendResponse } from "../utils/sendResponse";
import { extract } from "../utils/extract";

const prisma = new PrismaClient();

type OpenRouterMessage = {
  role: "user";
  content: string;
};

type OpenRouterChoice = {
  message: OpenRouterMessage;
  index: number;
  finish_reason?: string;
};

type OpenRouterResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenRouterChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export const chatwithAI = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { prompt, sessionId } = req.body;

  if (!prompt || !sessionId) {
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "Prompt and sessionId are required",
    });
  }

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { chats: { orderBy: { createdAt: "desc" }, take: 2 } },
    });

    if (!session || session.userId !== userId) {
      return sendResponse({
        res,
        statusCode: 403,
        success: false,
        message: "Unauthorized session access",
      });
    }

    const context = session.chats
      .reverse()
      .map(
        (chat) => `Prompt: ${chat.prompt}\nJSX: ${chat.jsx}\nCSS: ${chat.css}`
      )
      .join("\n\n");

    const fullPrompt = `
      You are a frontend component generator.

      Here is previous context (for reference):
      ${context}

      Now, based on this prompt:
      "${prompt}"

      Generate **only one file**: \`App.jsx\`, and include any required CSS in a separate block.

      ### Output Format:
      1. Start with a comment: \`// App.jsx\`
      2. Then a complete React app in JSX — this must include:
        - Imports
        - A default \`App\` component
        - All UI and logic inside \`App\`
        - Export default \`App\` (if using module-based)
      3. Followed by: \`// styles.css\`
      4. Then the CSS code

      ### Requirements:
      - Do **not** create separate components (like \`SignInForm.js\`)
      - Do **not** include markdown or explanations
      - Make the app runnable as-is in an online React sandbox (like CodeSandbox or StackBlitz)
    `;


    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: fullPrompt }],
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data: OpenRouterResponse = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText) {
      throw new Error("OpenRouter returned no content");
    }

    const { jsx, css } = extract(generatedText);

    const chat = await prisma.chat.create({
      data: {
        sessionId,
        prompt,
        jsx,
        css,
      },
    });

    return sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: "Component generated successfully",
      data: {
        chatId: chat.id,
        code: jsx,
        css,
      },
    });
  } catch (error: any) {
    console.error("Chat generation failed:", error.message);
    return sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: "Failed to generate component",
    });
  }
};
