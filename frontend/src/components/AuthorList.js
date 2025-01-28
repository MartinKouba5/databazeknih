import React, { useState, useEffect } from 'react';

function AuthorList() {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/authors')
      .then((res) => res.json())
      .then((data) => setAuthors(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Author List</h2>
      <ul>
        {authors.map((author) => (
          <li key={author.id}>
            {author.first_name} {author.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuthorList;
