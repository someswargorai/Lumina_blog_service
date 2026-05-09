import { Request, Response } from "express";
import blogSchema from "../models/schema.js";
import "../models/userSchema.js";
import userSchema from "../models/userSchema.js";


const getUpdatedBlogs = async (req: Request, res: Response) => {
    try {
        const getBlogData = await blogSchema.find({
            author: { $ne: (req as any).userId },
            isDelete: false, 
            publish: true
        }).populate("author", "name username email").sort({ createdAt: -1, updatedAt: -1 });

        const getBookmarks = await userSchema.findById((req as any).userId).select('bookmarks');


        if (!getBlogData) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        } 

        return res.status(200).json({ success: true, message: getBlogData, data: getBookmarks });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
} 

export { getUpdatedBlogs };