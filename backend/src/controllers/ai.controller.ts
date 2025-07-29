import { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { extract } from "../utils/extract"

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

export const generateComponent = async (req: Request, res: Response) => {
  const { prompt, context } = req.body;


  if (!prompt) {
    return sendResponse({
      res,
      statusCode: 400,
      success: false,
      message: "Prompt is required",
    });
  }

  try {
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
          messages: [
            {
              role: "user",
              content:
                context + prompt +
                "\n\nGenerate a React component using JSX/TSX and include CSS separately if needed.",
            },
          ],
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

    return sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: "Component generated successfully",
      data: {
        code: jsx,
        css,
        generatedText
       },
    });
  } catch (error: any) {
    console.error("AI generation failed:", error.message);
    return sendResponse({
      res,
      statusCode: 500,
      success: false,
      message: "Failed to generate component",
    });
  }
};
