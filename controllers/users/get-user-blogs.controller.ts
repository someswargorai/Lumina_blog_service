import { Request, Response } from "express";
import blogSchema from "../../models/schema.js";
import userSchema from "../../models/userSchema.js";

const getUserBlogs = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const currentUserId = (req as any).userId;

        // Find all published blogs by the target user
        const blogs = await blogSchema.find({
            author: id,
            publish: true,
            isDelete: false
        }).sort({ createdAt: -1 });

        // Get current user's bookmarks to show bookmark status on cards
        const currentUser = await userSchema.findById(currentUserId).select("bookmarks");

        return res.status(200).json({
            success: true,
            data: blogs,
            bookmarks: currentUser?.bookmarks || []
        });

    } catch (err) {
        console.error("[getUserBlogs]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export default getUserBlogs;
