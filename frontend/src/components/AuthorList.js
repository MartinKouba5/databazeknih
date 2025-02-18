import React, { useState, useEffect } from 'react';

function AuthorList() {
  const [authors, setAuthors] = useState([]); // Seznam všech autorů
  const [filteredAuthors, setFilteredAuthors] = useState([]); // Filtrovaní autoři
  const [searchTerm, setSearchTerm] = useState(''); // Hledaný výraz

  // Načtení autorů z API
  useEffect(() => {
    fetch('http://localhost:5000/authors')
      .then((res) => res.json())
      .then((data) => {
        setAuthors(data); // Uložení všech autorů
        setFilteredAuthors(data); // Inicializace filtrovaných autorů
      })
      .catch((err) => console.error(err));
  }, []);

  // Filtrace autorů při změně searchTerm
  useEffect(() => {
    const filtered = authors.filter((author) => {
      const fullName = `${author.first_name} ${author.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    setFilteredAuthors(filtered); // Aktualizace filtrovaných autorů
  }, [searchTerm, authors]);

  return (
    <div>
      <h2>Seznam autorů</h2>

      {/* Pole pro filtrování */}
      <input
        type="text"
        placeholder="Hledat autora..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          fontSize: '16px',
        }}
      />

      {/* Výpis filtrovaných autorů */}
      <ul>
        {filteredAuthors.map((author) => (
          <li key={author.id}>
            {author.first_name} {author.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuthorList;