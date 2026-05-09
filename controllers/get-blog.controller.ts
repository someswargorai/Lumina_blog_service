import { Request, Response } from "express";
import blogSchema from '../models/schema.js';
import userSchema from '../models/userSchema.js';

const getBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;

        const getBlogData = await blogSchema.findById(id)
            .populate("author", "name username email bio")
            .populate("comments.user", "name username email");

        if (!getBlogData) { 
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Check if current user is following the author
        const isFollowing = await userSchema.exists({
            _id: getBlogData.author,
            followers: userId
        });

        // Get total followers count
        const authorProfile = await userSchema.findById(getBlogData.author).select("followers");
        const totalFollowersCount = authorProfile?.followers?.length || 0;

        // Check if user has bookmarked this blog
        const userBookmarked = await userSchema.exists({ 
            _id: userId, 
            bookmarks: id 
        });
        
        return res.status(200).json({
            success: true, 
            data: getBlogData, 
            userBookmarked: !!userBookmarked, 
            isFollowing: !!isFollowing, 
            totalFollowers: totalFollowersCount,
            isPublish: getBlogData.publish
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, err: err });
    }
}

export default getBlog;