import { Request, Response } from "express";
import blogSchema from "../models/schema.js";

const permanentDeleteBlog = async(req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const deletedBlog = await blogSchema.findByIdAndDelete(id);
        
        if(!deletedBlog){
            return res.status(404).json({success: false, message: "Blog not found"});
        }
        
        return res.status(200).json({success: true, message: "Blog permanently deleted"});
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
} 

export default permanentDeleteBlog;
