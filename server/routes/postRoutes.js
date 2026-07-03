const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
    createPost,
    getPosts,
    deletePost,
    updatePost
} = require("../controllers/postController");

// Protected Routes
router.post("/create-post", auth, createPost);

router.get("/posts", auth, getPosts);

router.put("/delete-post/:rowNumber", auth, deletePost);

router.put("/update-post/:rowNumber", auth, updatePost);

module.exports = router;