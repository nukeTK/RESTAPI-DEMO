const Order = require("../models/order");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("_id product quantity")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        products: docs.map((doc) => {
          return {
            _id: doc._id,
            productImage: doc.productImage,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
