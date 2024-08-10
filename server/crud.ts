import mongoose, { Model } from "mongoose";
import { Mongoose, Schema } from "mongoose";

import { Seed } from "./seed";

export class Library {
  private userSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: String,
    password: String,
    borrowed: [
      {
        bookID: String,
        Date: Number,
      },
    ],
    reserved: [
      {
        bookID: String,
        Date: Number,
      },
    ],
  });

  private user!: Model<any>;

  private bookSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    description: String,
    author: String,
    quantity: Number,
    available: Number,
    category: String,
  });

  private book!: Model<any>;

  private db!: Mongoose;
  constructor(url: String) {
    (async () => {
      this.db = await mongoose.connect(`mongodb://${url}`, {
        useNewUrlParser: true,
      });
      this.book = this.db.model("book", this.bookSchema);
      this.user = this.db.model("user", this.userSchema);
      console.log("connected");
    })();
  }

  async login(email: String, password: String): Promise<any> {
    let user = await this.user.find({ email: email, password: password });

    if (user.length > 0) {
      return user[0];
    } else {
      return {};
    }
  }

  async register(
    email: String,
    username: String,
    password: String
  ): Promise<any> {
    if (email == "" || username == "" || password == "") {
      return { message: "Email, username or password not found" };
    }

    let user = await this.user.find({ email: email });

    if (user.length > 0) {
      return { message: "User already exists" };
    }

    await this.user.insertMany([
      {
        email: email,
        username: username,
        password: password,
      },
    ]);

    return { message: "User created" };
  }

  async getUserInfo(id: String): Promise<any> {
    let user = await this.user.find({ _id: id }, { password: 0, email: 0 });

    if (user.length > 0) {
      let data = JSON.parse(JSON.stringify(user[0]));

      for (let i = 0; i < data.borrowed.length; i++) {
        data.borrowed[i].key = i;
        data.borrowed[i].book = await this.book.findById(
          data.borrowed[i].bookID
        );
        data.borrowed[i].Date = new Date(data.borrowed[i].Date);
      }
      for (let i = 0; i < data.reserved.length; i++) {
        data.reserved[i].key = i;
        data.reserved[i].name = (
          await this.book.findById(data.reserved[i].bookID)
        ).name;
        data.reserved[i].date = new Date(data.reserved[i].Date);
      }

      return data;
    }

    return user;
  }

  async addBook(
    name: String,
    description: String,
    quantity: Number,
    available: Number,
    author: String,
    category: String
  ): Promise<boolean> {
    let book = await this.book.insertMany({
      name: name,
      description: description,
      quantity: quantity,
      available: available,
      author: author,
      category: category,
    });

    if (!book.errors) {
      return true;
    } else {
      return false;
    }
  }

  async removeBook(id: String): Promise<boolean> {
    let book = await this.book.deleteMany({ _id: id });

    if (book.deletedCount ?? 0 > 0) {
      return true;
    } else {
      return false;
    }
  }

  async borrowBook(id: String, uid: String): Promise<boolean> {
    let book = await this.book.find({ _id: id });

    if (book.length > 0 && book[0].available > 0) {
      this.book.updateOne({ _id: id }, { available: book[0].available - 1 });
      this.user.updateOne(
        { _id: uid },
        { $push: { borrowed: { bookID: id, Date: Date.now() } } }
      );

      return true;
    } else {
      return false;
    }
  }

  async returnBook(id: String, email: String): Promise<boolean> {
    let user = await this.user.find({ email: email });
    let book = await this.book.find({ _id: id });

    if (user.length > 0 && book.length > 0) {
      this.book.updateOne({ _id: id }, { available: book[0].available + 1 });
      this.user.updateOne(
        { email: id },
        { $pull: { borrowed: { bookID: id } } }
      );

      return true;
    } else {
      return false;
    }
  }

  async getBook(id: String): Promise<any> {
    let book: any;

    book = await this.book.find({ _id: id });

    return book;
  }

  async getBooks(category: String = ""): Promise<any> {
    let book: any;

    if (category == "") {
      book = await this.book.find({});
    } else {
      book = await this.book.find({ category: category });
    }

    return book;
  }

  async getNewBooks(): Promise<any> {
    let book = await this.book.aggregate([
      { $match: { available: { $gt: 0 } } },
      { $sample: { size: 10 } },
    ]);

    return book;
  }

  async getCategories(): Promise<any> {
    let book = await this.book.distinct("category");

    return book;
  }

  async getRandomBooks(): Promise<any> {
    let book = await this.book.aggregate([
      { $match: { available: { $gt: 0 } } },
      { $sample: { size: 5 } },
    ]);

    return book;
  }

  async seedBook(): Promise<any> {
    await this.book.insertMany(Seed);

    return true;
  }

  async seedUser(): Promise<any> {
    await this.user.insertMany([
      { email: "admin@admin.com", username: "admin", password: "admin" },
      { email: "user@user.com", username: "user", password: "user" },
    ]);

    return true;
  }

  async deleteAll(): Promise<any> {
    await this.user.deleteMany({});
    await this.book.deleteMany({});

    return true;
  }

  async searchBooks(keywords: String, limit: number = 10): Promise<any> {
    let book = await this.book
      .find({
        $or: [
          { name: { $regex: keywords, $options: "i" } },
          { description: { $regex: keywords, $options: "i" } },
          { category: { $regex: keywords, $options: "i" } },
          { author: { $regex: keywords, $options: "i" } },
          { publisher: { $regex: keywords, $options: "i" } },
        ],
      })
      .limit(limit);

    return book;
  }

  async reserveBook(userid: String, bookid: String): Promise<any> {
    if (userid == "" || bookid == "") {
      return { message: "User or book not found" };
    }
    let book = await this.book.find({ _id: bookid });
    let user = await this.user.find({ _id: userid });

    if (user.length == 0 || book.length == 0) {
      return { message: "User or book not found" };
    }

    if (book[0].available == 0) {
      return { message: "Book is not available" };
    }

    if (user[0].reserved.length > 5) {
      return { message: "You can only reserve 5 books" };
    }

    await this.user.updateOne(
      { _id: userid },
      { $push: { reserved: { bookID: bookid, Date: Date.now() } } }
    );

    await this.book.updateOne(
      { _id: bookid },
      { available: book[0].available - 1 }
    );

    return { message: "Book reserved" };
  }

  async cancelReservation(userid: String, bookid: String): Promise<any> {
    if (userid == "" || bookid == "") {
      return { message: "User or book not found" };
    }
    let book = await this.book.find({ _id: bookid });
    let user = await this.user.find({ _id: userid });

    if (user.length == 0 || book.length == 0) {
      return { message: "User or book not found" };
    }

    await this.user.updateOne(
      { _id: userid },
      { $pull: { reserved: { bookID: bookid } } }
    );

    await this.book.updateOne(
      { _id: bookid },
      { available: book[0].available + 1 }
    );

    return { message: "Reservation canceled" };
  }
}
