const express = require("express");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const { getAllBooks } = require("../service/common.js");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(500).json({ message: "Missing username or password" });
  } else if (doesExist(username)) {
    return res.status(500).json({ message: "User exists." });
  } else {
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered" });
  }
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const searchISBN = parseInt(req.params.isbn);
  const allBooks = await getAllBooks();
  const searchBook = allBooks[searchISBN];
  if (!searchBook) {
    return res.status(400).json({ message: "No books was found" });
  } else {
    return res.status(200).json(searchBook);
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const allBooks = await getAllBooks();
  const searchBooks = Object.values(allBooks).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  if (searchBooks.length > 0) {
    return res.status(200).send(JSON.stringify(searchBooks, null, 4));
  } else {
    return res.status(400).json({ message: "No books was found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  const allBooks = await getAllBooks();
  const searchBooks = Object.values(allBooks).filter(
    (book) => book.title.toLowerCase() === req.params.title.toLowerCase()
  )[0];
  if (searchBooks) {
    return res.status(200).json(searchBooks);
  } else {
    return res.status(400).json({ message: "No books was found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
  const targetISBN = req.params.isbn;
  const allBooks = await getAllBooks();
  const searchBook = allBooks[targetISBN];
  if (searchBook) {
    return res.status(200).send(JSON.stringify(searchBook.reviews, null, 4));
  } else {
    return res.status(400).json({ message: "No books was found" });
  }
});

module.exports.general = public_users;
