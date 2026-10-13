
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3001;
const FILE_NAME = "./books.json";

app.use(express.json());

function getBooks() {
    return JSON.parse(fs.readFileSync(FILE_NAME, "utf8"));
}

function saveBooks(books) {
    fs.writeFileSync(
        FILE_NAME,
        JSON.stringify(books, null, 2),
        "utf8"
    );
}

// GET: All books
app.get("/books", (req, res) => {
    res.status(200).json(getBooks());
});

// GET: One book by ID
app.get("/books/:id", (req, res) => {
    const books = getBooks();
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// POST: Add a book
app.post("/books", (req, res) => {
    const books = getBooks();
    const { title, author, price } = req.body;

    if (
        typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        price === "" ||
        price === null ||
        price === undefined ||
        !Number.isFinite(Number(price)) ||
        Number(price) <= 0
    ) {
        return res.status(400).json({
            message: "Valid title, author and positive price are required"
        });
    }

    const id = books.length
        ? Math.max(...books.map(b => b.id)) + 1
        : 1;

    const newBook = {
        id: id,
        title: title.trim(),
        author: author.trim(),
        price: Number(price)
    };

    books.push(newBook);
    saveBooks(books);

    res.status(201).json(newBook);
});

// PUT: Update a book
app.put("/books/:id", (req, res) => {
    const books = getBooks();
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, price } = req.body;

    if (
        typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        price === "" ||
        price === null ||
        price === undefined ||
        !Number.isFinite(Number(price)) ||
        Number(price) <= 0
    ) {
        return res.status(400).json({
            message: "Valid title, author and positive price are required"
        });
    }

    book.title = title.trim();
    book.author = author.trim();
    book.price = Number(price);

    saveBooks(books);

    res.status(200).json(book);
});

// DELETE: Remove a book
app.delete("/books/:id", (req, res) => {
    const books = getBooks();
    const id = Number(req.params.id);
    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1)[0];

    saveBooks(books);

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook
    });
});

app.listen(PORT, () => {
    console.log(`Book API running at http://localhost:${PORT}`);
});