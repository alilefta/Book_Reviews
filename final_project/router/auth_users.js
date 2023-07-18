const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username) => {
	//returns boolean
	//write code to check is the username is valid
	if (username) {
		if (username.length > 2 && username.match(/[a-zA-Z_]$/)) {
			return true;
		}
		return false;
	}
	return false;
};

const authenticatedUser = (username, password) => {
	//returns boolean
	//write code to check if username and password match the one we have in records.
	return users.find(
		(user) => user.username === username && user.password === password
	) === undefined
		? false
		: true;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	//Write your code here
	const { username, password } = req.body;
	if (username && password) {
		if (authenticatedUser(username, password)) {
			let accessToken = jwt.sign({ data: password }, "access", {
				expiresIn: 60 * 60,
			});
			req.session.authorization = {
				accessToken,
				username,
			};
			return res.status(200).json({ message: "User logged in successfully" });
		} else {
			res.status(401).json({
				message: "Username and password doesn't match our credentials",
			});
		}
	} else {
		return res.status(403).json({
			message:
				"The username is not valid, check your username and password then try again!",
		});
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	//Write your code here
	const review = req.query.review;
	if (req.session.authorization) {
		const username = req.session.authorization["username"];
		if (Object.keys(books).includes(req.params.isbn)) {
			for (let isbn of Object.keys(books)) {
				if (isbn === req.params.isbn) {
					books[isbn].reviews[username] = review;
				}
			}

			return res
				.status(200)
				.json({ message: "Review has been added successfully" });
		}
		return res.status(403).json({ message: "There is no book with this ISBN" });
	} else {
		return res
			.status(401)
			.json({ message: "You should be logged in to put a review" });
	}
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
	let isBookExist = Object.keys(books).includes(req.params.isbn);
	if (isBookExist) {
		for (let isbn of Object.keys(books)) {
			if (isbn === req.params.isbn) {
				if (Object.keys(books[isbn].reviews)) {
					for (let reviewByUser of Object.keys(books[isbn].reviews)) {
						if (reviewByUser === req.session.authorization.username) {
							let new_reviews = {};

							for (let key of Object.keys(books[isbn]["reviews"])) {
								if (key !== req.session.authorization.username) {
									new_reviews[key] = books[isbn].reviews[key];
								}
							}
							books[isbn].reviews = new_reviews;
						}
					}
				}
				return res.status(200).json({
					message: `Review made by the user ${req.session.authorization.username} has been deleted!`,
				});
			}
		}
	}
	return res.status(403).json({ message: "yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
