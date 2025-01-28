import React, { useState, useEffect } from 'react';

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/books')
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Book list</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} - {book.publication_date} ({book.genre_name}) -{' '}
            {book.first_name} {book.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookList;
