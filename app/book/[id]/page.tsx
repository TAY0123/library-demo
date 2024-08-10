"use client";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";

import { Library, Book } from "@/components/library";
import BookCard from "@/components/book_card";
import React from "react";

export default function BookPage() {
  const [book, setBook] = useState({
    name: "",
    author: "",
    category: "",
    available: 0,
    quantity: 0,
    description: "",
  });

  let c: Book[] = [];
  const [random, setRandom] = useState(c);

  let lastSegment = "";
  const [loading, setLoading] = useState(true);

  if (window != undefined) {
    const url = window.location.href;
    const segments = url.split("/");

    lastSegment = segments[segments.length - 1];
  }

  const library = new Library();

  useEffect(() => {
    library.getBook(lastSegment).then((book) => {
      setBook(book[0]);
      setLoading(false);
    });

    library.getRandomBooks().then((books) => {
      setRandom(books);
    });
  }, []);

  let content;

  if (loading) {
    content = (
      <div>
        <div className="text-3xl font-bold pb-4">Loading...</div>
        <Spinner />
      </div>
    );
  } else {
    content = (
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold">{book.name}</h1>
        </CardHeader>
        <CardBody>
          <p className="text-xl font-bold text-default-500">{book.author}</p>
          <p className="text-xl font-bold text-default-500 uppercase">
            {book.category}
          </p>
        </CardBody>
        <CardFooter>
          <div className="py-4 w-full flex flex-col gap-4 items-start">
            <p className="text-default-500">{book.description}</p>
            <p>Quantity: {book.quantity}</p>
            <p>Available: {book.available}</p>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div>
      {content}
      <div className="py-4">
        <h3 className="text-3xl font-bold">Book Recommandations</h3>
      </div>
      <div className=" flex flex-row gap-4 width-full">
        {random.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
}
