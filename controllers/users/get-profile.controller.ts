import { Request, Response } from "express"
import userSchema from "../../models/userSchema"


const getProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const currentUserId = (req as any).userId;

        const getTheUser = await userSchema.findById(id).select("-password");
       
        
        if (!getTheUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const stats = {
            followersCount: getTheUser.followers?.length || 0,
            followingCount: getTheUser.following?.length || 0,
            isFollowing: getTheUser.followers?.includes(currentUserId)
        };

        return res.status(200).send({ 
            success: true, 
            user: getTheUser,
            stats
        })
    } catch (err) {
        console.error("[getProfile]", err);
        return res.status(500).send({ success: false, message: "Internal server error" });
    }
}

export default getProfile