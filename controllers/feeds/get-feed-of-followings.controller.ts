import { Request, Response } from "express";
import userSchema from "../../models/userSchema";
import schema from "../../models/schema";

const getFeedOfFollowings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const currentUser = await userSchema.findById(userId).select("following");
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const blogs = await schema.find({
            author: { $in: currentUser.following },
            publish: true,
            isDelete: false
        }, { title: 1, content: 1, upvotes: 1, comments: 1, author: 1, createdAt: 1, updatedAt: 1 })
            .populate("author", "name username email bio")
            .sort({ createdAt: -1, updatedAt: -1 });

        if (!blogs || blogs.length === 0) {
            return res.status(200).json({ success: false, message: "No blogs found" });
        }
        return res.status(200).json({ success: true, data: blogs });


    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export default getFeedOfFollowings;