import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAwi7jto_eA5JEvK6NkJePhu36Mdj_O8_4";
const genAI = new GoogleGenerativeAI(API_KEY);

export const createAiBlog = async (req: Request, res: Response) => {
    try {
        const { messages } = req.body;

        // Use Gemini 1.5 Flash
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Simple prompt construction from messages
        const lastMessage = messages[messages.length - 1]?.content || "";

        const result = await model.generateContentStream(lastMessage);

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            res.write(chunkText);
        }

        res.end();

    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ success: false, message: "AI generation failed" });
    }
};