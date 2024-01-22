const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const User = require("../models/user");
const authController = require("../controllers/auth");

router.put(
	"/signup",
	[
		body("email")
			// .isEmail()
			// .withMessage("Please enter a valid email!")
			.custom(async (value, { req }) => {
				const result = await User.findOne({ email: value });
                console.log(result);
				if (result !== null) {
					return await Promise.reject(
						"E-mail address already exists!"
					);
				}
			}),
		// .normalizeEmail(),
		body("password").trim().isLength({ min: 5 }),
		body("name").trim().not().isEmpty(),
	],
	authController.signup
);
router.post("/login", authController.login);

module.exports = router;
