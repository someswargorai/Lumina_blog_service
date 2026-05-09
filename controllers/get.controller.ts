
import { Request, Response } from "express";
import schema from "../models/schema";

const getBlogs = async (req: Request, res: Response) => {
    try {
        
        const response = await schema.find({author: (req as any).userId, isDelete: false},{title:1, publish:1, isDelete:1}).sort({ createdAt: -1, updatedAt: -1 });
        if(!response){
            return res.status(404).json({success: false, message: "No blogs found"});
        }
        res.status(200).json({success: true, data: response});
    } catch (error) {
        return res.status(500).json({success: false, message: error}); 
    }
}
export default getBlogs;