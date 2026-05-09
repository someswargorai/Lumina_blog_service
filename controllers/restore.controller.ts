import { Request, Response } from "express";
import blogSchema from "../models/schema.js";

const restoreBlog = async(req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const getBlogData = await blogSchema.findById(id);
        if(!getBlogData){
            return res.status(404).json({success: false, message: "Blog not found"});
        }
        getBlogData.isDelete = false;
        await getBlogData.save();
        return res.status(200).json({success: true, message: "Blog restored successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
} 

export default restoreBlog;
