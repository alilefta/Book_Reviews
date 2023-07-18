const express = require("express");
const uuid = require("uuid").v1();
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");
const checkUserExist = (username, password) => {
	return users.find(
		(user) => user.username === username && user.password === password
	) === undefined
		? false
		: true;
};

public_users.post("/register", (req, res) => {
	//Write your code here
	const { username, password } = req.body;
	if (username && password) {
		if (isValid(username)) {
			if (!checkUserExist(username, password)) {
				users.push({
					id: uuid,
					username,
					password,
					registerationDate: new Date().getUTCDate().toString(),
				});
				return res
					.status(200)
					.json({ message: "Registeration was successful" });
			} else {
				return res.status(403).json({
					message:
						"User with these credentials has already been registerd, try to login",
				});
			}
		} else {
			return res.status(403).json({ message: "username is incorrect" });
		}
	} else {
		return res
			.status(403)
			.json({ message: "Incorrect username and/or password" });
	}
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	//Write your code here
	if (Object.keys(books).length > 0) {
		return res.status(200).send(JSON.stringify(books, null, 4));
	}
	return res.status(403).json({ message: "No Books in our shop" });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	//Write your code here
	if (Object.keys(books).includes(req.params.isbn)) {
		let book = books[req.params.isbn];
		return res.status(200).json({ book });
	}
	return res.status(403).json({
		message: `No book has been found with ISBN: ${req.params.isbn}`,
	});
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	//Write your code here
	let filtered_books = [];
	for (let isbn of Object.keys(books)) {
		let book = books[isbn];
		if (
			book.author.includes(
				req.params.author.slice(0, 1).toUpperCase() + req.params.author.slice(1)
			)
		) {
			filtered_books.push(book);
		}
	}
	if (filtered_books.length > 0) {
		return res.status(200).json({ books: filtered_books });
	}

	return res.status(403).json({
		message: `No book has been found with author: ${req.params.author}`,
	});
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	//Write your code here
	let filtered_books = [];
	for (let isbn of Object.keys(books)) {
		let book = books[isbn];
		if (
			book.title.includes(
				req.params.title.slice(0, 1).toUpperCase() + req.params.title.slice(1)
			)
		) {
			filtered_books.push(book);
		}
	}
	if (filtered_books.length > 0) {
		return res.status(200).json({ books: filtered_books });
	}

	return res.status(403).json({
		message: `No book has been found with title: ${req.params.title}`,
	});
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	//Write your code here
	const reviews = [];
	if (books[req.params.isbn]) {
		for (let isbn of Object.keys(books)) {
			if (isbn === req.params.isbn) {
				if (books[isbn].reviews) {
					reviews.push(books[isbn].reviews);
				} else {
					reviews.push({});
				}
			}
		}
		return res.status(200).json({ reviews });
	}

	return res
		.status(403)
		.json({ message: "No book has been found with this ISBN" });
});

// using async/await with axios
const getAllBooks = async () => {
	const res = await axios.get("http://localhost:5000/");
	console.log(res.data);
};

const getBookByISBN = async (ISBN) => {
	try {
		const res = await axios.get(`http://localhost:5000/isbn/${ISBN}`);
		console.log(res.data);
	} catch (err) {
		console.log(err);
	}
};

// using promises with axios
const getBookByAuthor = (author) => {
	axios
		.get(`http://localhost:5000/author/${author}`)
		.then((res) => res.data)
		.then((data) => console.log(data))
		.catch((err) => console.log(err.response.data));
};
const getBookByTitle = (title) => {
	axios
		.get(`http://localhost:5000/title/${title}`)
		.then((res) => res.data)
		.then((data) => console.log(data))
		.catch((err) => console.log(err.response.data));
};
getAllBooks();
getBookByISBN(1);
getBookByAuthor("dante");
getBookByTitle("hi");
module.exports.general = public_users;
