export class Library {
  constructor() {}

  async searchBooks(keywords: String, limit: number = 30): Promise<[Book]> {
    let book = await fetch(
      `/api/books/search?keywords=${keywords}&limit=${limit}`
    );

    const bookData = await book.json();

    return bookData.map((book: any) => new Book(book));
  }

  async fetchBooks(category = ""): Promise<[Book]> {
    const response = await fetch(
      `/api/books${category ? `?category=${category}` : ""}`
    );
    const bookData = await response.json();

    return bookData.map((book: any) => new Book(book));
  }

  async getCategories(): Promise<[string]> {
    const response = await fetch("/api/books/categories");
    const data = await response.json();

    return data;
  }

  async getBook(id: String): Promise<[Book]> {
    const response = await fetch(`/api/book/${id}`);
    const bookData = await response.json();

    return bookData.map((book: any) => new Book(book));
  }

  async getNewBooks(): Promise<[Book]> {
    const response = await fetch("/api/books/new");
    const bookData = await response.json();

    return bookData.map((book: any) => new Book(book));
  }

  async getRandomBooks(): Promise<[Book]> {
    const response = await fetch("/api/books/random");
    const bookData = await response.json();

    return bookData.map((book: any) => new Book(book));
  }
}

export class Book {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  author: string;
  available: number;
  category: string;

  constructor(data: {
    _id: string;
    name: string;
    description: string;
    quantity: number;
    available: number;
    author: string;
    category: string;
  }) {
    this._id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.quantity = data.quantity;
    this.author = data.author;
    this.available = data.available;
    this.category = data.category;
  }
}
