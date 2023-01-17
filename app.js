const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const auth = require("morgan");
const mongoose = require("mongoose");
const productRoutes = require("./api/routes/products");
const orders = require("./api/routes/orders");
require("dotenv").config();
const path = require("path");
const { MONGO_DBPASS } = process.env;
/* 
app.use((req,res,next)=>{
    res.status(200).json({
        message:"It works"
    });
})   */
//mongoose.connect('mongodb+srv://taran1809'+ process.env.file + '@cluster0.8ahilj1.mongodb.net/?retryWrites=true&w=majority')
mongoose.set("strictQuery", true);
mongoose.connect(
  `mongodb+srv://taran1809:${MONGO_DBPASS}@cluster0.8ahilj1.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const con = mongoose.connection;
con.on("connected", function () {
  console.log("database is connected successfully");
});

app.use(auth("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //to access file with the link of the productImage
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json()); //use for the reading body data

//cors error- cross origin resource sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,PATCH,DELETE");
    res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orders);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404; //Data not found
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: { message: error.message },
  });
});

module.exports = app;
