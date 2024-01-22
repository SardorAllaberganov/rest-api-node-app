const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const multer = require("multer");

const PORT = process.env.PORT;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_USER = process.env.MONGODB_USER;

const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");

const app = express();

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "images");
//     },
//     filename: (req, file, cb) => {
//         cb(null, new Date().toISOString() + "-" + file.originalname);
//     },
// });
// const fileFilter = (req, file, cb) => {
//     if (
//         file.mimetype === "image/png" ||
//         file.mimetype === "image/jpg" ||
//         file.mimetype === "image/jpeg"
//     ) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

app.use(bodyParser.json());
// app.use(
// 	multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
// );
// app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.use("/post", postRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(
        `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.asfr8nn.mongodb.net/posts`
    )
    .then((result) => {
        app.listen(PORT);
    })
    .catch((err) => {
        console.log(err);
    });
