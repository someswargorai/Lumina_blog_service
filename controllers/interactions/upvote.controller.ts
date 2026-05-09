import { Request, Response } from "express";
import schema from "../../models/schema.js";

const toggleUpvote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // 1. Safety check: Ensure userId exists
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found" });
        }

        const blog = await schema.findById(id);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // 2. Fix the check: Convert ObjectIds to strings to compare with the userId string
        const isUpvoted = blog.upvotes.some(uid => uid.toString() === userId);

        let update;
        if (isUpvoted) {
            // Remove upvote
            update = { $pull: { upvotes: userId } };
        } else {
            // Add upvote (ensuring no duplicates)
            update = { $addToSet: { upvotes: userId } };
        }

        const updatedBlog = await schema.findByIdAndUpdate(id, update, { new: true });

        return res.status(200).json({ 
            success: true, 
            message: isUpvoted ? "Upvote removed" : "Upvote added",
            upvotesCount: updatedBlog?.upvotes?.length || 0
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export { toggleUpvote };
