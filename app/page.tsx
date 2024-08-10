"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";

import { Book, Library } from "@/components/library";
import BookCard from "@/components/book_card";

export default function Home() {
  const [newBook, setNewBook] = useState<Book[]>([]);
  const [random, setRandom] = useState<Book[]>([]);
  const [category, setCategory] = useState<Book[][]>([]);
  const [loading, setLoading] = useState(true);
  const library = new Library();

  useEffect(() => {
    (async () => {
      const newBooks = await library.getNewBooks();
      const randomBooks = await library.getRandomBooks();
      const categories = await library.getCategories();
      var cat: Book[][] = [];

      for (let i in categories) {
        cat.push(await library.fetchBooks(categories[i]));
      }

      setNewBook(newBooks);
      setRandom(randomBooks);
      setCategory(cat);
      setLoading(false);
    })();
  }, []);

  return (
    <section>
      <div className="flex flex-col items-start justify-center gap-4 py-8 md:py-10">
        <h2 className="text-3xl font-bold mb-4">
          Welcome to the online library
        </h2>
        {!loading && (
          <>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">New books</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newBook.map((book, index) => (
                <BookCard key={index} book={book} />
              ))}
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              Random books
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {random.map((book, index) => (
                <BookCard key={index} book={book} />
              ))}
            </div>
            {category.map((cat, index) => (
              <div key={index}>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                  {cat[0].category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cat.map((book, index) => (
                    <BookCard key={index} book={book} />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div>
        {loading && (
          <div>
            <div className="text-2xl font-bold pb-4">Loading...</div>
            <Spinner />
          </div>
        )}
      </div>
    </section>
  );
}
