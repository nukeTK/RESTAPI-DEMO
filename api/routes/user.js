const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1)
        return res.status(409).json({
          message: "Email ID already Exist",
        });
      else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) return res.status(500).json({ error: err });
          else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "User Created",
                });
              })
              .catch((error) => {
                res.status(500).json({ error: error });
              });
          }
        });
      }
    });
});
router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Dont have account",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(400).json({ message: err });
        }
        if (result) {
          return res.status(200).json({
            message: "user is logged in",
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});
router.delete("/:emailId", (req, res, next) => {
  User.remove({ email: req.params.emailId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "user deleted",
      });
    })
    .catch((error) => res.status(400).json({ error: error }));
});

module.exports = router;
