const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { createUser, login } = require("./controllers/users");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("This is working");
});

