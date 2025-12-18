const mongoose = require("mongoose");
const config = require("config");
const Product = require("../models/Product");

const sampleProducts = [
  {
    name: "Handmade Tote Bag",
    price: 45,
    category: "Bags",
    image: "",
    description: "Spacious canvas tote with leather straps, perfect for daily use.",
    stock: 12,
    tags: ["canvas", "tote", "handmade"],
  },
  {
    name: "Ceramic Mug",
    price: 22,
    category: "Home",
    image: "",
    description: "Wheel-thrown ceramic mug with matte glaze and comfy handle.",
    stock: 30,
    tags: ["kitchen", "mug"],
  },
  {
    name: "Wool Scarf",
    price: 35,
    category: "Clothing",
    image: "",
    description: "Soft merino wool scarf with subtle pattern and warm feel.",
    stock: 20,
    tags: ["winter", "scarf"],
  },
  {
    name: "Leather Journal",
    price: 40,
    category: "Stationery",
    image: "",
    description: "Bound leather journal with dotted pages for notes and sketches.",
    stock: 15,
    tags: ["journal", "leather"],
  },
];

async function run() {
  const connectionString = config.get("db");
  await mongoose.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("Connected to", connectionString);
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log("Seeded products:", sampleProducts.length);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

