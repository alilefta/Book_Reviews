const axios = require("axios");

// using async/await with axios
const getAllBooks = async () => {
	try {
		const res = await axios.get("http://localhost:5000/");
		console.log(res.data);
	} catch (err) {
		console.log(err.response.data);
	}
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
getBookByTitle("divine");
