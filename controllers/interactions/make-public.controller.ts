import { Request, Response } from "express";
import blogSchema from "../../models/schema.js";
import userSchema from "../../models/userSchema.js";
import sendMail from "../../producer/send-mail.js";
import { posthog } from "../../utils/posthog.js";
import { io } from "../../index.js";

const makePublic = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { topic } = req.body;
        const userId = (req as any).userId
        const getBlogData = await blogSchema.findById(id);
        const user = await userSchema.findById(userId).populate("followers", "email");
        const followers = user.followers;

        if (!getBlogData) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        let updatedBlog;

        if (getBlogData.publish) {
            updatedBlog = await blogSchema.findByIdAndUpdate(id, {
                $set: { publish: false }
            }, { new: true });
        } else {
            updatedBlog = await blogSchema.findByIdAndUpdate(id, {
                $set: { publish: true, topics: topic }
            }, { new: true });
        }

        if (!updatedBlog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }


        if (updatedBlog?.publish) {
            try {

                const content = getBlogData?.content;
                const preview = typeof content === 'object' && Array.isArray(content)
                    ? `${content?.[0]?.content?.[0]?.text || ''} ${content?.[1]?.content?.[0]?.text || ''}`.trim().slice(0, 200) + "..."
                    : "Check out the new blog post!";

                for (const follower of followers) {
                    io.to(follower._id.toString()).emit("notification", {
                        type: "BLOG_PUBLISHED",
                        data: `${user?.username} has just published a blog ${updatedBlog?.title}`
                    });
                }
                await sendMail(followers, `${user.username} has just published a blog`, preview);
            } catch (mailErr) {
                console.error("[sendMail] Failed to notify followers, but blog was still published:", mailErr);
            }
        }

        return res.status(200).json({ success: true, message: `Blog made ${getBlogData.publish ? "private" : "public"} successfully`, updatedBlog });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export default makePublic;