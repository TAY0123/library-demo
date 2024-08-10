import express, { Request } from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import next from "next";

import { Library } from "./crud";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const prefix = `/api`;

const library = new Library(`localhost:27017/library`);

const server = express();

server.use(require(`cookie-parser`)(`secret`));
server.use(require(`body-parser`).urlencoded({ extended: true }));
server.use(
  require(`express-session`)({
    secret: `super secret key :)`,
    resave: true,
    saveUninitialized: true,
  })
);
server.use(passport.initialize());
server.use(passport.session());

server.use(express.json());

//setup passport auth
passport.use(
  new LocalStrategy(async function (
    username: string,
    password: string,
    done: (arg0: null, arg1: any) => any
  ) {
    if (username == "" || password == "") {
      return done(null, false);
    }
    let data = await library.login(username, password);

    if (data.username != undefined) {
      return done(null, {
        id: data._id,
        username: data.username,
        avatar: data._id,
      });
    } else {
      return done(null, false);
    }
  })
);

passport.serializeUser(function (user: any, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user._id,
      username: user,
    });
  });
});

passport.deserializeUser(function (user: { id: string; username: string }, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, username: user.username });
  });
});

app.prepare().then(() => {
  // Define custom routes here
  server.get("/custom-route", (req: Request | any, res) => {
    return app.render(req, res, "/custom-page", req.query);
  });

  server.get(`${prefix}/books`, async (req: Request | any, res) => {
    if (req.query.category) {
      res.send(await library.getBooks(req.query.category));
    } else {
      res.send(await library.getBooks());
    }
  });

  server.get(`${prefix}/book/:book`, async (req, res) => {
    res.send(await library.getBook(req.params.book));
  });

  server.get(`${prefix}/books/categories`, async (req, res) => {
    res.send(await library.getCategories());
  });
  server.get(`${prefix}/books/new`, async (req, res) => {
    res.send(await library.getNewBooks());
  });

  server.get(`${prefix}/books/search`, async (req: Request | any, res) => {
    let limit = 5;

    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }
    res.send(await library.searchBooks(req.query.keywords, limit));
  });

  server.get(`${prefix}/books/random`, async (req, res) => {
    res.send(await library.getRandomBooks());
  });

  server.post(`${prefix}/reserve`, async (req: Request | any, res) => {
    if (!req.user) {
      res.redirect(`/login`);
      return;
    }
    res.send(await library.reserveBook(req.user.username.id, req.body.bookID));
  });

  server.delete(`${prefix}/reserve`, async (req: Request | any, res) => {
    if (!req.user) {
      res.redirect(`/login`);
      return;
    }
    res.send(
      await library.cancelReservation(req.user.username.id, req.body.bookID)
    );
  });

  server.post(
    `${prefix}/auth`,
    passport.authenticate(`local`, {
      failureRedirect: `/login`,
      failureMessage: true,
    }),
    function (req: Request | any, res) {
      res.cookie(`username`, req.user.username);
      res.redirect(`/`);
    }
  );

  server.delete(`${prefix}/auth`, async function (req: Request & any, res) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });


  server.post(`${prefix}/register`, async function (req: Request & any, res) {
    let resp = await library.register(
      req.body.email,
      req.body.username,
      req.body.password
    );

    if (resp.message == "User created") {
      res.redirect(`/login`);

      return;
    }
    res.send(resp);
  });

  server.post(`${prefix}/addBook`, async (req, res) => {
    res.send(
      await library.addBook(
        req.body.name,
        req.body.description,
        req.body.quantity,
        req.body.avaliable,
        req.body.author,
        req.body.category
      )
    );
  });

  server.get(`${prefix}/user`, async function (req: Request & any, res) {
    if (!req.user) {
      res.redirect(`/login`);

      return;
    }
    let user = await library.getUserInfo(req.user.username.id);

    res.send(user);
  });

  server.get(`/test/seed`, async (req, res) => {
    await library.deleteAll();
    await library.seedUser();
    await library.seedBook();
    res.send(true);
  });

  // Default catch-all handler to allow Next.js to handle all other routes
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
