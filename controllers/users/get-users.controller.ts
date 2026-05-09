import { Request, Response } from "express";
import userSchema from "../../models/userSchema";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userSchema.find(
            {
                _id: { $ne: req.userId },
                followers: { $ne: req.userId }
            }).select("name username email bio");
        if (!users) {
            return res.status(404).json({ success: false, message: "Users not found" });
        }
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export { getAllUsers };