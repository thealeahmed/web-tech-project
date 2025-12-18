const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  const productCount = await Product.countDocuments();
  res.render("admin/dashboard", {
    layout: "admin/layout",
    title: "Admin Dashboard",
    productCount,
  });
});

router.get("/products", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.render("admin/products/index", {
    layout: "admin/layout",
    title: "Manage Products",
    products,
  });
});

router.get("/products/new", (req, res) => {
  res.render("admin/products/form", {
    layout: "admin/layout",
    title: "Add Product",
    product: {},
    action: "/admin/products",
    method: "POST",
  });
});

router.post("/products", async (req, res) => {
  await Product.create({
    name: req.body.name,
    price: Number(req.body.price),
    category: req.body.category,
    image: req.body.image,
    description: req.body.description,
    stock: Number(req.body.stock || 0),
    tags: req.body.tags ? req.body.tags.split(",").map((t) => t.trim()) : [],
  });
  res.redirect("/admin/products");
});

router.get("/products/:id/edit", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.redirect("/admin/products");
  res.render("admin/products/form", {
    layout: "admin/layout",
    title: "Edit Product",
    product,
    action: `/admin/products/${product._id}`,
    method: "POST",
  });
});

router.post("/products/:id", async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    price: Number(req.body.price),
    category: req.body.category,
    image: req.body.image,
    description: req.body.description,
    stock: Number(req.body.stock || 0),
    tags: req.body.tags ? req.body.tags.split(",").map((t) => t.trim()) : [],
  });
  res.redirect("/admin/products");
});

router.post("/products/:id/delete", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/admin/products");
});

module.exports = router;

