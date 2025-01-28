import React, { useState, useEffect } from 'react';

function AddBook() {
  const [title, setTitle] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    // Načtení autorů a žánrů z backendu
    fetch('http://localhost:5000/authors')
      .then((res) => res.json())
      .then((data) => setAuthors(data));
    fetch('http://localhost:5000/genres')
      .then((res) => res.json())
      .then((data) => setGenres(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        publication_date: publicationDate,
        author_id: selectedAuthor,
        genre_id: selectedGenre,
      }),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Book</h2>
      <input
        type="text"
        placeholder="Name of the book"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="date"
        value={publicationDate}
        onChange={(e) => setPublicationDate(e.target.value)}
        required
      />
      <select value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)} required>
        <option value="">Choose author</option>
        {authors.map((author) => (
          <option key={author.id} value={author.id}>
            {author.first_name} {author.last_name}
          </option>
        ))}
      </select>
      <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} required>
        <option value="">Choose genre</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
      <button type="submit">Add</button>
    </form>
  );
}

export default AddBook;
