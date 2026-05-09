import { Request, Response } from "express";
import userSchema from "../../models/userSchema.js";

const getSavedBlogs = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id || (req as any).userId;

        const getBlogData = await userSchema.findById(userId).populate({
            path: 'bookmarks',
            populate: {
                path: 'author',
                select: 'name username email'
            }
        });

        if (!getBlogData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const savedBlogs = getBlogData.bookmarks;

        return res.status(200).json({ success: true, data: savedBlogs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export default getSavedBlogs;