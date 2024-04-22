const express = require("express");
const router = express.Router();
const { Product, validate } = require("../models/product");
const { Category } = require("../models/category"); // Import Category model
const { Department } = require("../models/department"); // Import Department model

// CREATE
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {
      name,
      category,
      department,
      price,
      sizes,
      color,
      imageUrl,
      description,
    } = req.body;

    // Check if the provided category and department IDs exist
    const existingCategory = await Category.findById(category);
    const existingDepartment = await Department.findById(department);

    if (!existingCategory) return res.status(400).send("Category not found");
    if (!existingDepartment)
      return res.status(400).send("Department not found");

    let product = new Product({
      name,
      category,
      department,
      price,
      sizes,
      color,
      imageUrl,
      description,
    });

    product = await product.save();
    res.send(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// READ (Get all products)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort("name");
    res.send(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// READ (Get a single product by ID)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .send("The product with the given ID was not found.");
    res.send(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/department/:departmentId", async (req, res) => {
  try {
    const products = await Product.find({
      department: req.params.departmentId,
    });
    res.send(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {
      name,
      category,
      department,
      price,
      sizes,
      color,
      imageUrl,
      description,
    } = req.body;

    // Check if the provided category and department IDs exist
    const existingCategory = await Category.findById(category);
    const existingDepartment = await Department.findById(department);

    if (!existingCategory) return res.status(400).send("Invalid category.");
    if (!existingDepartment) return res.status(400).send("Invalid department.");

    let product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        department,
        price,
        sizes,
        color,
        imageUrl,
        description,
      },
      { new: true }
    );

    if (!product)
      return res
        .status(404)
        .send("The product with the given ID was not found.");

    res.send(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product)
      return res
        .status(404)
        .send("The product with the given ID was not found.");
    res.send(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
