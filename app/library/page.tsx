"use client";
import { Component } from "react";
import { Spinner } from "@nextui-org/spinner";

import BookCard from "../../components/book_card";

import { Library } from "@/components/library";
import { title } from "@/components/primitives";

export default class LibraryPage extends Component {
  library = new Library();
  state = { books: [], loading: true };

  componentDidMount() {
    this.fetchBooks();
  }

  fetchBooks = async () => {
    this.setState({ loading: true });
    const books = await this.library.fetchBooks();

    this.setState({ books, loading: false });
  };

  render() {
    const { books, loading } = this.state;

    return (
      <div>
        <div className="p-6 rounded-lg shadow-lg">
          <h1 className={title()}>Library</h1>
        </div>
        <div className="text-gray-700">
          {loading ? (
            <Spinner /> // Render the loading spinner
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {books.map((book, index) => (
                <BookCard key={index} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
