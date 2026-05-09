import { Request, Response } from "express";
import schema from "../zod/blogSchema";
import blogSchema from "../models/schema";

const createBlog = async (req: Request, res: Response) => {
    try {
        const validateInput = schema.safeParse(req.body);
        if (!validateInput.success) {
            const { issues } = validateInput.error;
            return res.status(400).json({ success: false, data: { message: "Invalid input", issues } });
        }

        const { title, content } = validateInput.data;
        const userId = (req as any).userId;

        const blog = new blogSchema({
            title,
            content,
            author: userId,
        });

        await blog.save();

        return res.status(201).json({ success: true, data: blog });

    } catch (error) {
        return res.status(500).json({ success: false, data: { message: "Internal server error" } });
    }
}

export default createBlog;