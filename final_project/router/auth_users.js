const express = require("express");
const jwt = require("jsonwebtoken");
const { updateBookReview, deleteBookReview } = require("../service/common");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  } else if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Incorrect username or password" });
  } else {
    const accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 30,
    });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Successfully logged in." });
  }
});

// Add a book review
// /customer/auth/:isbn
regd_users.put("/auth/review/:isbn", async (req, res) => {
  const user = req.session.authorization.username;
  const review = req.body.review; // string
  const isbn = req.params.isbn;
  await updateBookReview(isbn, user, review);
  res.status(200).json({ message: "Book review updated." });
});

// delete a review
regd_users.delete("/auth/review/:isbn", async (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    res.status(400).json({ message: "invalid ISBN." });
  } else {
    await deleteBookReview(isbn, user);
    res.status(200).json({ message: "Book review deleted." });
  }
});

module.exports.authenticated = regd_users;
module.exports.users = users;
