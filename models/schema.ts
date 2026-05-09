import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    publish: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    topics:{
        type:String,
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    upvotes:{
        type: [mongoose.Schema.Types.ObjectId],
        default:[]
    },
    comments:[
     {
        user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },
        comment: String, 
     }  
    ],
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


blogSchema.index({ "title": "text" })

export default mongoose.model("Blog", blogSchema);