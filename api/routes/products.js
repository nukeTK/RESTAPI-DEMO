const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer");

/* const upload = multer({ dest: "./uploads/" }); */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() +  file.originalname);
  },
});
const upload = multer({ storage: storage });
router.get("/", (req, res, next) => {
  /* res.status(200).json({
    message: "Handling GET request to /Products",
  }); */
  console.log(req.file);
  Product.find()
    .select("name price _id")
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        products: doc.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    });
});

router.post("/", upload.single("productImage"), (req, res, next) => {
  //using bodyparser to extract the incoming data
  /* const product={
        name:req.body.name,
        price: req.body.price
    } */
  console.log(req.body.name, req.body.price);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  //save: mongoose predefined method to save the data into the database
  product
    .save()
    .then((result) => {
      res.status(200).json({
        result: "Data Sucessfully Created",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: "POST",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
  /*  res.status(201).json({
    message: "Handling POST request to /Products",
    createdProduct: product,
  }); */
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  /* if (id === "special") {
    res.status(200).json({
      message: "handling POST request to /:productId = special",
      id: id,
    });
  } else {
    res.status(200).json({
      message: `You passed an ${id}`,
    });
  } */

  Product.findById(id)
    .select("name price _id")
    .exec()
    .then((doc) => {
      console.log(doc);
      /*  res.status(200).json(doc); */
      if (doc) res.status(200).json(doc);
      else res.status(404).json({ error: "wrong Data" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  /* res.status(200).json({
    message: "update the product",
  }); */
  const id = req.params.productId;
  const updateOps = {};
  //dynamic response
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value; //propName would be name and value would be new value "propName": "name", "value":"kaniey"
  }
  Product.updateOne(
    { _id: id },
    /* { $set: { name: req.body.name, price: req.body.price } } */
    { $set: updateOps } //dynamic update the value
  )
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  /*  res.status(200).json({
    message: "delete the product",
  }); */
  const id = req.params.productId;
  console.log(id);
  Product.deleteOne({ _id: id })
    .exec()
    .then((res) => {
      res.status(200).json({ message: "deleted" });
    })
    .catch((error) => {
      res.status(404).json({ Error: "error" });
    });
});

module.exports = router;
