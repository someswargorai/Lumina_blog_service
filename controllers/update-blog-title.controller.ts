import { Request, Response } from "express";
import blogSchema from '../models/schema.js';

export const updateBlogTitle = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;
        const { id } = req.params;

        const userId = req.userId;

        const updateBlogTitle = await blogSchema.findOneAndUpdate(
            {
                author: userId,
                _id: id
            },
            {

                $set: {
                    "title": title
                }
            },
            {
                new: true,
              
            }
        )

        if (!updateBlogTitle) {
            return res.status(404).json({ success: false, data: { message: "Blog not found" } });
        }
        return res.status(200).json({ success: true, data: { message: "Blog updated successfully" } });


    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ success: false, data: { message: "Internal server error" } });
    }
}
