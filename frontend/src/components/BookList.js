import React, { useState, useEffect } from 'react';

function BookList() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Načtení autorů a žánrů při startu
  useEffect(() => {
    fetch('http://localhost:5000/authors')
      .then((res) => res.json())
      .then((data) => setAuthors(data))
      .catch((err) => console.error(err));

    fetch('http://localhost:5000/genres')
      .then((res) => res.json())
      .then((data) => setGenres(data))
      .catch((err) => console.error(err));
  }, []);

  // Načtení knih při změně filtrů
  useEffect(() => {
    const fetchBooks = async () => {
      const params = new URLSearchParams();
      if (titleFilter) params.append('title', titleFilter);
      if (authorFilter) params.append('author_id', authorFilter);
      if (genreFilter) params.append('genre_id', genreFilter);
      if (dateFilter) params.append('publication_date', dateFilter);

      try {
        const res = await fetch(`http://localhost:5000/books?${params.toString()}`);
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBooks();
  }, [titleFilter, authorFilter, genreFilter, dateFilter]);

  return (
    <div>
      <h2>Seznam knih</h2>
      
      {/* Filtrovací ovládací prvky */}
      <div className="filters">
        <input
          type="text"
          placeholder="Filtrovat podle názvu"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
        />
        
        <select
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
        >
          <option value="">Všichni autoři</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.first_name} {author.last_name}
            </option>
          ))}
        </select>
        
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="">Všechny žánry</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
        
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Výpis knih */}
      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id}>
            <h3>{book.title}</h3>
            <p>
              Autor: {book.first_name} {book.last_name}<br />
              Žánr: {book.genre_name}<br />
              Datum vydání: {book.publication_date}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookList;