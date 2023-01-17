const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) res.status(500).json({ error: err });
    else {
      const user = new User({
        _id: mongoose.Types.ObjectId,
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then((result) => {
          res.status(201).json({
            message:"User successfully"
          });
        })
        .catch((error) => {
          error: error;
        });
    }
  });
});

module.exports = router;