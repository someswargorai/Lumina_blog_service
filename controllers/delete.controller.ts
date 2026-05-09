import { Request, Response } from "express";
import blogSchema from "../models/schema.js";

const deleteBlog = async(req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const getBlogData = await blogSchema.findById(id);
        if(!getBlogData){
            return res.status(404).json({success: false, message: "Blog not found"});
        }
        getBlogData.isDelete = true;
        await getBlogData.save();
        return res.status(200).json({success: true, message: "Blog deleted successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
} 

export default deleteBlog;