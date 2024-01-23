const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const feedController = require("../controllers/post");
const isAuth = require("../middleware/is-auth");

router.get("/posts", isAuth, feedController.getPosts);
router.post("/create", isAuth, feedController.createPost);
router.get("/post/:postId", isAuth, feedController.getPost);

module.exports = router;
