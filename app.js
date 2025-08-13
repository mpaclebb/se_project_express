const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "6890db0b46353f4587ee4277",
  };
  next();
});
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("This is working");
});

//const express = require("express");
//const mongoose = require("mongoose");
//const Garment = require("./models/Garment");

//const app = express();
//const { PORT = 3002 } = process.env;

// Async function to handle DB connection and test insert
//async function startServer() {
//  try {
//    await mongoose.connect("mongodb+srv://mpacleb:Augustu1234%21@cluster0.qqo4hgq.mongodb.net/wtwr_db?retryWrites=true&w=majority&appName=Cluster0");
//    console.log("✅ Connected to DB");

//    const garment = await Garment.create({ name: "T-Shirt", type: "Top", size: "M" });
//    console.log("🧥 Garment saved:", garment);
//  } catch (err) {
//    console.error("❌ MongoDB error:", err);
//  }

//  app.listen(PORT, () => {
//    console.log(`🚀 Server is running on port ${PORT}`);
//  });
//}

//startServer();
