const express = require("express");
const app = express();
const morgan = require("morgan");
const port = 4000;
const mysql = require("mysql");

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Moonlight123!",
  database: "pokemart",
  multipleStatements: true
});

mysqlConnection.connect(err => {
  if (!err) console.log(`DB connection succeeded!`);
  else {
    console.log(
      `DB connection failed. Error:` + JSON.stringify(err, undefined, 2)
    );
  }
});

app.listen(port, () => {
  console.log(`Server has started on Port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/api/students", (req, res) => {
  const students = [
    { id: 1, firstName: "John", lastName: "Doe" },
    { id: 1, firstName: "Alice", lastName: "Wheezer" },
    { id: 1, firstName: "Carl", lastName: "Keenz" }
  ];
  res.json(students);
});

app.get("/userbase", (req, res) => {
  mysqlConnection.query("SELECT * FROM userbase", (err, rows, field) => {
    if (!err) {
      console.log(rows);
      res.json(rows);
    } else console.log(err);
  });
});

app.get("/userbase/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM userbase WHERE userid =?",
    [req.params.id],
    (err, rows, field) => {
      if (!err) {
        console.log(rows);
        res.send(rows);
      } else console.log(err);
    }
  );
});

app.post("/signup", (req, res) => {
  console.log("signup started");
  let poke = req.body;
  let sql =
    "SET @userid = 0;SET @username = ?;SET @password = ?; \
    CALL UserAddOrEdit(@userid,@username,@password);";
  mysqlConnection.query(
    sql,
    [poke.username, poke.password],
    (err, rows, field) => {
      if (!err) {
        console.log(rows);
        console.log("Sign-up successful!");
        res.send(rows);
      } else console.log(err);
    }
  );
});

// app.get? login

app.get("/items", (req, res) => {
    mysqlConnection.query("SELECT * FROM items", (err, rows, field) => {
      if (!err) {
        console.log(rows);
        res.json(rows);
      } else console.log(err);
    });
  });

app.post("/checkout", (req, res) => {
  console.log("checkout started");
  let poke = req.body;
  let sql =
    "SET @orderid = 0;SET @userid = ?;SET @order_arr = ?; \
    CALL OrdersAddOrEdit(@orderid,@userid,@order_arr);";
  mysqlConnection.query(
    sql,
    [poke.userid, poke.order_arr],
    (err, rows, field) => {
      if (!err) {
        console.log(rows);
        console.log("Checkout successful!");
        res.send(rows);
      } else console.log(err);
    }
  );
});

app.get("/orders", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM submitted_orders",
    (err, rows, field) => {
      if (!err) {
        console.log(rows);
        res.json(rows);
      } else console.log(err);
    }
  );
});

app.get("/orders/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM submitted_orders WHERE userid =?",
    [req.params.id],
    (err, rows, field) => {
      if (!err) {
        console.log(rows);
        res.send(rows);
      } else console.log(err);
    }
  );
});
