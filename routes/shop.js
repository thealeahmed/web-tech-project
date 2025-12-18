const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/cart", async function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  const products = await Product.find({ _id: { $in: cart } });
  const total = products.reduce(
    (runningTotal, product) => runningTotal + Number(product.price || 0),
    0
  );

  res.render("site/cart", { products, total, layout: "layout" });
});

router.get("/add-cart/:id", function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  if (!cart.includes(req.params.id)) {
    cart.push(req.params.id);
  }
  res.cookie("cart", cart);
  if (req.flash) {
    req.flash("success", "Product added to cart");
  }
  res.redirect("/products");
});


router.get("/", (req, res) => {
  res.render("site/homepage", {
    layout: false 
  });
});

router.get("/about", (req, res) => {
  res.render("site/about", {
    layout: false
  });
});

router.get("/offer", (req, res) => {
  res.render("site/offer", {
    layout: false
  });
});

router.get("/products", async function (req, res, next) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const filters = {};
  const { category, minPrice, maxPrice, search } = req.query;

  if (category) {
    filters.category = category;
  }

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }

  if (search) {
    filters.$text = { $search: search };
  }

  const [products, totalProducts, categories] = await Promise.all([
    Product.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filters),
    Product.distinct("category"),
  ]);

  const totalPages = Math.max(Math.ceil(totalProducts / limit), 1);

  res.render("site/products", {
    layout: "layout",
    pagetitle: "Shop Products",
    products,
    page,
    limit,
    totalPages,
    totalProducts,
    categories,
    filters: {
      category: category || "",
      minPrice: minPrice || "",
      maxPrice: maxPrice || "",
      search: search || "",
    },
  });
});

router.get("/products/:id", async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next();
  res.render("site/product-detail", {
    layout: "layout",
    product,
  });
});

module.exports = router;
