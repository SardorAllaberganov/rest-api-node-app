const Post = require("../models/post");
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    let creator;
    User.findById(req.userId)
        .then((user) => {
            creator = user;
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    Post.find()
        .countDocuments()
        .then((count) => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
        .then((result) => {
            res.status(200).json({
                posts: result,
                totalItems: totalItems,
                creatorName: creator.name,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createPost = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const error = new Error("Validation failed, entered incorrect data!");
        error.statusCode = 422;
        throw error;
    }
    // if (!req.file) {
    //     const error = new Error("No image provided");
    //     error.statusCode = 422;
    //     throw error;
    // }
    const imageUrl = req.body.imageUrl;
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const post = new Post({
        title: title,
        imageUrl: imageUrl,
        content: content,
        creator: req.userId,
    });
    post.save()
        .then((result) => {
            return User.findById(req.userId);
        })
        .then((user) => {
            creator = user;
            user.posts.push(post);
            return user.save();
        })
        .then((result) => {
            res.status(201).json({
                message: "Post created successfully!",
                post: post,
                creator: { _id: creator._id, name: creator.name },
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then((post) => {
            if (!post) {
                const error = new Error("Post could not found!");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: "Post fetched",
                post: post,
            });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.status = 500;
            }
            next(error);
        });
};
