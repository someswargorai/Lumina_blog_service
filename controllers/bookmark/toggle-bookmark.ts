import { Request, Response } from "express";
import userSchema from "../../models/userSchema";

const toggleBookmark = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;

        // 1. Check if THIS SPECIFIC USER has the bookmark
        const isPresent = await userSchema.findOne({
            _id: userId,
            bookmarks: id
        });

        let updateUser;
        let message;

        if (!isPresent) {
            // 2. Not bookmarked? Add it
            updateUser = await userSchema.findOneAndUpdate({ _id: userId }, {
                $addToSet: { bookmarks: id }
            }, { new: true });
            message = "Bookmark added successfully";
        } else {
            // 3. Already bookmarked? Remove it
            updateUser = await userSchema.findOneAndUpdate({ _id: userId }, {
                $pull: { bookmarks: id }
            }, { new: true });
            message = "Bookmark removed successfully";
        }

        if (!updateUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(201).json({ success: true, message });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export default toggleBookmark