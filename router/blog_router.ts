import express from 'express';
import verifyToken from '../middlewares/verifyToken.middleware.js';
import getBlogs from '../controllers/get.controller.js';
import createBlog from '../controllers/create.controller.js';
import { updateBlog } from '../controllers/update.controller.js';
import getBlog from '../controllers/get-blog.controller.js';
import { updateBlogTitle } from '../controllers/update-blog-title.controller.js';
import deleteBlog from '../controllers/delete.controller.js';
import getTrashBlogs from '../controllers/get-trash-blogs.js';
import restoreBlog from '../controllers/restore.controller.js';
import permanentDeleteBlog from '../controllers/permanent-delete.controller.js';
import { getUpdatedBlogs } from '../controllers/get-updated-blogs.controller.js';
import getSavedBlogs from '../controllers/bookmark/get-saved-blogs.js';
import { rateLimit } from '../middlewares/rateLimit.middleware.js';
import { getAllUsers } from '../controllers/users/get-users.controller.js';
import { toggleUpvote } from '../controllers/interactions/upvote.controller.js';
import { addComment } from '../controllers/interactions/comment.controller.js';
import toggleFollow from '../controllers/interactions/toggle-follow.controller.js';
import makePublic from '../controllers/interactions/make-public.controller.js';
import getFeedOfFollowings from '../controllers/feeds/get-feed-of-followings.controller.js';
import getTopics from '../controllers/topics/get-topics.controller.js';
import getBlogsByTopic from '../controllers/topics/get-blogs-by-topic.controller.js';
import getProfile from '../controllers/users/get-profile.controller.js';
import getUserBlogs from '../controllers/users/get-user-blogs.controller.js';
import toggleBookmark from '../controllers/bookmark/toggle-bookmark.js';

const router = express.Router();

//get blogs
router.get("/get-blogs", rateLimit, verifyToken, getBlogs);
router.get('/trash-blogs', rateLimit, verifyToken, getTrashBlogs);
router.get('/updated-blogs', rateLimit, verifyToken, getUpdatedBlogs);
router.get("/get-blog/:id", rateLimit, verifyToken, getBlog);
router.get("/get-saved-blogs", rateLimit, verifyToken, getSavedBlogs);
router.get("/get-saved-blogs/:id", rateLimit, verifyToken, getSavedBlogs);
router.get("/get-users", rateLimit, verifyToken, getAllUsers);
router.get("/get-feed-of-followings", rateLimit, verifyToken, getFeedOfFollowings);
router.get("/get-topics", rateLimit, verifyToken, getTopics);
router.get("/get-blogs-by-topic/:topic", rateLimit, verifyToken, getBlogsByTopic);
router.get("/get-profile/:id", rateLimit, verifyToken, getProfile);
router.get("/get-user-blogs/:id", rateLimit, verifyToken, getUserBlogs);
//create blog
router.post('/create-blog', rateLimit, verifyToken, createBlog);

//update blog content
router.put('/update-blog/:id', rateLimit, verifyToken, updateBlog);

//update blog title
router.put('/update-blog-title/:id', rateLimit, verifyToken, updateBlogTitle);

//delete blog
router.delete('/delete-blog/:id', rateLimit, verifyToken, deleteBlog);

//Restore blog
router.put('/restore-blog/:id', rateLimit, verifyToken, restoreBlog);

//Permanent delete blog
router.delete('/permanent-delete-blog/:id', rateLimit, verifyToken, permanentDeleteBlog);

//create bookmark
router.patch('/toggle-bookmark/:id', rateLimit, verifyToken, toggleBookmark);

//Interactions
router.patch('/toggle-upvote/:id', rateLimit, verifyToken, toggleUpvote);
router.post('/add-comment/:id', rateLimit, verifyToken, addComment);
router.patch('/toggle-follow/:id', rateLimit, verifyToken, toggleFollow);
router.patch("/make-public/:id", rateLimit, verifyToken, makePublic);

export default router;

