// modules required for routing
let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

// define the book model
let Book = require("../models/books");

/* GET books List page. READ */
router.get("/", (req, res, next) => {
  // find all books in the books collection
  Book.find((err, books) => {
    if (err) {
      return console.error(err);
    } else {
      res.render("books/index", {
        title: "Books",
        books: books,
      });
    }
  });
});

// GET the Book Details page in order to add a new Book
router.get("/add", (req, res, next) => {
  res.render("books/details", {
    title: "Add Book",
    books: new Book(),
  });
});

// POST process the Book Details page and create a new Book - CREATE
router.post("/add", (req, res, next) => {
  const { title, description, price, author, genre } = req.body;

  // Perform data type validation for the "Price" field
  if (isNaN(price)) {
    return res.render("books/details", {
      title: "Add Book",
      books: req.body,
      priceError: "Price must be a number.",
    });
  }

  // The rest of your validation logic (e.g., required fields) goes here

  // If all validation checks pass, proceed with saving to the database
  let newBook = new Book({
    Title: title,
    Description: description,
    Price: price,
    Author: author,
    Genre: genre,
  });

  newBook.save((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/books");
    }
  });
});

// GET the Book Details page in order to edit an existing Book
router.get("/:id", (req, res, next) => {
  let id = req.params.id;

  Book.findById(id, (err, book) => {
    if (err) {
      console.error(err);
    } else {
      res.render("books/details", {
        title: "Edit Book",
        books: book,
      });
    }
  });
});

// POST - process the information passed from the details form and update the document
router.post("/:id", (req, res, next) => {
  const id = req.params.id;
  const { title, description, price, author, genre } = req.body;

  // Perform data type validation for the "Price" field
  if (isNaN(price)) {
    return res.render("books/details", {
      title: "Edit Book",
      books: req.body,
      priceError: "Price must be a number.",
    });
  }

  // The rest of your validation logic (e.g., required fields) goes here

  // If all validation checks pass, proceed with updating the document
  Book.findByIdAndUpdate(
    id,
    {
      Title: title,
      Description: description,
      Price: price,
      Author: author,
      Genre: genre,
    },
    (err, book) => {
      if (err) {
        console.error(err);
      } else {
        res.redirect("/books");
      }
    }
  );
});

// GET - process the delete by user id
router.get("/delete/:id", (req, res, next) => {
  let id = req.params.id;

  Book.findByIdAndRemove(id, (err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/books");
    }
  });
});

module.exports = router;
