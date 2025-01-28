import React, { useState } from 'react';
import './App.css';
import AddBook from './components/AddBook';
import AddAuthor from './components/AddAuthor';
import BookList from './components/BookList';
import AuthorList from './components/AuthorList';

function App() {
  const [view, setView] = useState('books');

  return (
    <div className="App">
      <header>
        <h1>Database of books</h1>
        <nav>
          <button onClick={() => setView('books')}>Book list</button>
          <button onClick={() => setView('authors')}>Author list</button>
          <button onClick={() => setView('addBook')}>Add book</button>
          <button onClick={() => setView('addAuthor')}>Add author</button>
        </nav>
      </header>
      <main>
        {view === 'books' && <BookList />}
        {view === 'authors' && <AuthorList />}
        {view === 'addBook' && <AddBook />}
        {view === 'addAuthor' && <AddAuthor />}
      </main>
    </div>
  );
}

export default App;
