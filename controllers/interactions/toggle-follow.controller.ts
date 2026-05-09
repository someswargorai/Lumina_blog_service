import { Request, Response } from "express";
import userSchema from "../../models/userSchema.js";
import blogSchema from "../../models/schema.js";
import { io } from "../../index.js";

const toggleFollow = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;

        const isPresentOrNot = await userSchema.find({
            _id: id,
            followers: userId
        });

        let updateUser;

        const user = await userSchema.findById(id);

        if (isPresentOrNot?.length === 0) {
            io.to(id).emit("follow_notification", {
                type: "FOLLOW",
                data: `${user?.username} has followed you`
            });
        } else {
            io.to(id).emit("follow_notification", {
                type: "UNFOLLOW",
                data: `${user?.username} has unfollowed you`
            });
        }


        if (isPresentOrNot?.length > 0) {
            updateUser = await userSchema.findByIdAndUpdate(id, {
                $pull: { followers: userId }
            });
            await userSchema.findByIdAndUpdate(userId, {
                $pull: { following: id }
            })
        } else {
            updateUser = await userSchema.findByIdAndUpdate(id, {
                $addToSet: { followers: userId }
            });
            await userSchema.findByIdAndUpdate(userId, {
                $addToSet: { following: id }
            })
        }

        return res.status(200).json({ success: true, message: isPresentOrNot?.length > 0 ? "Unfollowed successfully" : "Followed successfully" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export default toggleFollow;