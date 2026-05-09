import { Request, Response } from "express"
import schema from "../../models/schema"

const getTopics = async (req: Request, res: Response) => {
    try {
        const topics = await schema.aggregate([
            {
                $match: {
                    topics: { $ne: null, $nin: [""] }
                }
            },
            {
                $group: {
                    "_id": "$topics",
                }
            }
        ]);

        console.log(topics);
        res.status(200).send({success: true, data:topics})
    } catch (err) {
        console.log(err);
    }
}

export default getTopics;