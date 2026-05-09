import { Request, Response } from "express";
import blogSchema from "../../models/schema.js";
import userSchema from "../../models/userSchema.js";

const getBlogsByTopic = async (req: Request, res: Response) => {
    try {
        const { topic } = req.params;
        const userId = (req as any).userId;

        const blogs = await blogSchema.find({
            topics: topic,
            isDelete: false,
            publish: true
        }).populate("author", "name username email").sort({ createdAt: -1 });

        const user = await userSchema.findById(userId).select("bookmarks");

        return res.status(200).json({
            success: true,
            data: blogs,
            bookmarks: user?.bookmarks || []
        });

    } catch (err) {
        console.error("[getBlogsByTopic]", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export default getBlogsByTopic;
