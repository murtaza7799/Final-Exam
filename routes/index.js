var express = require("express");
var router = express.Router();
var Product = require("../models/Product");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
/* GET home page. */
router.get("/login", function (req, res, next) {
  return res.render("site/login");
});
router.get("/signup", function (req, res, next) {
  return res.render("site/signup");
});
router.get("/faqs", function (req, res, next) {
  return res.render("site/faqs");
});
router.get("/about", function (req, res, next) {
  return res.render("site/about");
});
router.post("/login", async function (req, res, next) {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("danger", "User with this email not present");
    return res.redirect("/login");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword) {
    req.session.user = user;
    req.flash("success", "Logged in Successfully");
    return res.redirect("/");
  } else {
    req.flash("danger", "Invalid Password");
    return res.redirect("/login");
  }
});
router.get("/signup", function (req, res, next) {
  return res.render("site/signup");
});
router.get("/logout", async (req, res) => {
  req.session.user = null;
  console.log("session clear");
  return res.redirect("/login");
});
router.post("/register", async function (req, res, next) {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    req.flash("danger", "User with given email already registered");
    return res.redirect("/register");
  }
  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  await user.save();
  return res.redirect("/login");
});
router.get("/contact-us", function (req, res, next) {
  return res.render("site/contact");
});
router.get("/", async function (req, res, next) {
  let products = await Product.find();
  return res.render("site/homepage", {
    products,
  });
});
router.get("/products", async function (req, res, next) {
  let products = await Product.find();
  return res.render("site/products", {
    products,
  });
});

module.exports = router;
