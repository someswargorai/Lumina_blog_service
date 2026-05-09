import { Request, Response } from "express";
import schema from "../../models/schema";


const addComment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.userId;

        if (!text) {
            return res.status(400).json({ success: false, message: "Comment text is required" });
        }

        const blog = await schema.findById(id);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        blog.comments.push({
            user: userId,
            comment: text
        });

        await blog.save();

        return res.status(201).json({ 
            success: true, 
            message: "Comment added successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { addComment };
