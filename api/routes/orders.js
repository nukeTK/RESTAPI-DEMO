const express = require("express");
const router = express.Router();
const mangoose = require("mongoose");
const { orders_get_all } = require("../controllers/orders");

const Product = require("../models/product");
const checkAuth = require("../middleware/check-auth");

//for more ckeaner code we can can create controller folder and put all the logic over there
router.get("/", checkAuth, orders_get_all); //example

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        res.status(404).json({
          error: "Product not found",
        });
      }
      const order = new Order({
        _id: mangoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      res.status(201).json({
        Result: "Data has been created",
        createdData: {
          _id: result._id,
          quantity: result.quantity,
          product: result.productId,
          response: {
            type: "POST",
            url: "http://localhost:3000/orders/" + result._id,
          },
        },
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get("/:ordersId", (req, res, next) => {
  const id = req.params.ordersId;
  if (id === "special") {
    res.status(200).json({
      message: "handling POST request to /:orders = special",
      id: id,
    });
  } else {
    res.status(200).json({
      message: `You passed an ${id}`,
    });
  }
});

router.patch("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "update the order",
  });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "delete the order",
  });
});

module.exports = router;
