const express = require('express');
const fileUpload = require('express-fileupload');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Import knihovny fs

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pro parsování JSON
app.use(express.json());
app.use(cors());
app.use(fileUpload());

// Přidání knihy
app.post('/books', async (req, res) => {
  const { title, publication_date, author_id, genre_id } = req.body;

  if (!title || !publication_date || !author_id || !genre_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = 'INSERT INTO books (title, publication_date, author_id, genre_id) VALUES (?, ?, ?, ?)';
    await runQuery(query, [title, publication_date, author_id, genre_id]);
    res.status(201).json({ message: 'Book added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding book' });
  }
});

// Přidání autora
app.post('/authors', async (req, res) => {
  const { first_name, last_name } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = 'INSERT INTO authors (first_name, last_name) VALUES (?, ?)';
    await runQuery(query, [first_name, last_name]);
    res.status(201).json({ message: 'Author added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding author' });
  }
});

const { format } = require('date-fns');

// Seznam knih s filtrováním
app.get('/books', async (req, res) => {
  const { title, author_id, genre_id, publication_date } = req.query;

  let query = 'SELECT books.*, authors.first_name, authors.last_name, genres.name AS genre_name FROM books ' +
              'JOIN authors ON books.author_id = authors.id ' +
              'JOIN genres ON books.genre_id = genres.id WHERE 1=1';
  const params = [];

  if (title) {
    query += ' AND books.title LIKE ?';
    params.push(`%${title}%`);
  }
  if (author_id) {
    query += ' AND books.author_id = ?';
    params.push(author_id);
  }
  if (genre_id) {
    query += ' AND books.genre_id = ?';
    params.push(genre_id);
  }
  if (publication_date) {
    query += ' AND books.publication_date = ?';
    params.push(publication_date);
  }

  try {
    const books = await runQuery(query, params);

    // Formátování datumu 
    const formattedBooks = books.map(book => ({
      ...book,
      publication_date: format(new Date(book.publication_date), 'd.MM.yyyy') // Formátování datumu
    }));

    res.json(formattedBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching books' });
  }
});




// Seznam autorů s filtrováním
app.get('/authors', async (req, res) => {
  const { first_name, last_name } = req.query;

  let query = 'SELECT * FROM authors WHERE 1=1';
  const params = [];

  if (first_name) {
    query += ' AND first_name LIKE ?';
    params.push(`%${first_name}%`);
  }
  if (last_name) {
    query += ' AND last_name LIKE ?';
    params.push(`%${last_name}%`);
  }

  try {
    const authors = await runQuery(query, params);
    res.json(authors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching authors' });
  }
});

// Detail autora
app.get('/authors/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const authorQuery = 'SELECT * FROM authors WHERE id = ?';
    const booksQuery = 'SELECT books.*, genres.name AS genre_name FROM books ' +
                       'JOIN genres ON books.genre_id = genres.id WHERE books.author_id = ?';

    const [author] = await runQuery(authorQuery, [id]);
    const books = await runQuery(booksQuery, [id]);

    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    // Oblíbený žánr
    const genreCount = books.reduce((acc, book) => {
      acc[book.genre_name] = (acc[book.genre_name] || 0) + 1;
      return acc;
    }, {});

    const favoriteGenre = Object.keys(genreCount).reduce((a, b) => genreCount[a] > genreCount[b] ? a : b, null);

    res.json({
      author,
      books,
      favorite_genre: favoriteGenre,
      book_count: books.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching author details' });
  }
});

// Seznam žánrů
app.get('/genres', async (req, res) => {
  try {
    const query = 'SELECT * FROM genres';
    const genres = await runQuery(query);
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching genres' });
  }
});

// Přidání nového žánru
app.post('/genres', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Missing required field: name' });
  }

  try {
    const query = 'INSERT INTO genres (name) VALUES (?)';
    await runQuery(query, [name]);
    res.status(201).json({ message: 'Genre added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding genre' });
  }
});


// Připojení k databázi
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: 'root',
  password: '',
  database: 'databazeknih_kouba'
});

// Pomocná funkce pro spuštění dotazů
const runQuery = async (query, params = []) => {
  const [rows] = await pool.query(query, params);
  return rows;
};


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

