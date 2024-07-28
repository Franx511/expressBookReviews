let books = require("../assets/booksdb.js");

const getAllBooks = () => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
};

const updateBookReview = (isbn, user, review) => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      books[isbn].reviews[user] = review;
      resolve(books);
    }, 1000);
  });
};

const deleteBookReview = (isbn, user) => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      delete books[isbn].reviews[user];
      resolve(books);
    }, 1000);
  });
};
module.exports = {
  getAllBooks,
  updateBookReview,
  deleteBookReview,
};
