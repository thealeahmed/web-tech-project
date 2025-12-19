const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const adminOnly = require("../middlewares/adminOnly");

const router = express.Router();

// Apply adminOnly to all routes in this router
router.use(adminOnly);

// Task 3: Display a list of all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render("admin/orders", {
      layout: "layout",
      title: "Manage Orders",
      orders
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching orders");
  }
});

// Task 3: Mark order as Confirmed or Cancel order
router.post("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).send("Invalid status");
    }
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.redirect("/admin/orders");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating order status");
  }
});

router.get("/", async (req, res) => {
  const productCount = await Product.countDocuments();
  res.render("admin/dashboard", {
    layout: "layout",
    title: "Admin Dashboard",
    productCount,
  });
});

router.get("/products", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.render("admin/products/index", {
    layout: "layout",
    title: "Manage Products",
    products,
  });
});

router.get("/products/new", (req, res) => {
  res.render("admin/products/form", {
    layout: "layout",
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
    layout: "layout",
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

