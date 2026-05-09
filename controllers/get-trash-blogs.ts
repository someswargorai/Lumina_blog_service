import { Request, Response } from "express";
import schema from "../models/schema";

const getTrashBlogs = async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string;
        if (search) {
            const response = await schema.find({
                $text: { $search: search },
                isDelete: true,
                author: (req as any).userId
            })
            if (!response) {
                return res.status(404).json({ success: false, message: "No blogs found" });
            }
            return res.status(200).json({ success: true, data: response });
        }
        const response = await schema.find({ author: (req as any).userId, isDelete: true });
        if (!response) {
            return res.status(404).json({ success: false, message: "No blogs found" });
        }
        return res.status(200).json({ success: true, data: response });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export default getTrashBlogs;