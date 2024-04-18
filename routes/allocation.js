const express = require("express");
const router = express.Router();
const ProductAllocation = require("../models/allocation");
const { Product } = require("../models/product");
const { Salesman } = require("../models/salesman");

// Create a new product allocation
router.post("/", async (req, res) => {
  try {
    const { salesmanId, productId, allocatedQuantities } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    const salesman = await Salesman.findById(salesmanId);
    if (!salesman) {
      return res.status(404).send("Salesman not found");
    }
    // Check if the requested quantities are available
    const { small, medium, large } = allocatedQuantities;
    if (
      small > product.sizes.small ||
      medium > product.sizes.medium ||
      large > product.sizes.large
    ) {
      return res.status(400).send("Requested quantities are not available");
    }

    // Update product quantities
    product.sizes.small -= small;
    product.sizes.medium -= medium;
    product.sizes.large -= large;
    await product.save();

    // Create product allocation
    const productAllocation = new ProductAllocation({
      salesmanId,
      productId,
      allocatedQuantities,
    });
    await productAllocation.save();

    res.status(201).send(productAllocation);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get all product allocations
router.get("/", async (req, res) => {
  try {
    const productAllocations = await ProductAllocation.find()
      .populate({
        path: "salesmanId",
        select: "name", // Assuming the name field exists in the salesman schema
      })
      .populate({
        path: "productId",
        select: "name", // Assuming the name field exists in the product schema
      });

    // Extracting relevant data and constructing response
    const formattedAllocations = productAllocations.map((allocation) => {
      return {
        _id: allocation._id, // Add the _id of the collection
        salesman: allocation.salesmanId.name, // Assuming name field exists in salesman schema
        product: allocation.productId.name, // Assuming name field exists in product schema
        allocatedQuantities: allocation.allocatedQuantities,
      };
    });

    res.send(formattedAllocations);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get product allocation by ID
router.get("/:id", async (req, res) => {
  try {
    const productAllocation = await ProductAllocation.findById(req.params.id);
    if (!productAllocation) {
      return res.status(404).send("Product allocation not found");
    }
    res.send(productAllocation);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update product allocation by ID
// router.put("/:id", async (req, res) => {
//   try {
//     // Find the original product allocation entry
//     const productAllocation = await ProductAllocation.findById(req.params.id);
//     if (!productAllocation) {
//       return res.status(404).send("Product allocation not found");
//     }

//     // Retrieve the original allocated quantities and the corresponding product ID
//     const originalAllocatedQuantities = productAllocation.allocatedQuantities;
//     const productId = productAllocation.productId;

//     // Calculate the difference between the new allocated quantities and the original allocated quantities
//     const newAllocatedQuantities = req.body.allocatedQuantities;
//     const difference = {
//       small: newAllocatedQuantities.small - originalAllocatedQuantities.small,
//       medium:
//         newAllocatedQuantities.medium - originalAllocatedQuantities.medium,
//       large: newAllocatedQuantities.large - originalAllocatedQuantities.large,
//     };

//     // Update the product quantities based on the difference
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).send("Product not found");
//     }
//     product.sizes.small += difference.small;
//     product.sizes.medium += difference.medium;
//     product.sizes.large += difference.large;

//     // Save the updated product
//     await product.save();

//     // Update the product allocation entry
//     const updatedProductAllocation = await ProductAllocation.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     res.send(updatedProductAllocation);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

// Delete product allocation by ID
router.delete("/:id", async (req, res) => {
  try {
    // Find the product allocation entry
    const productAllocation = await ProductAllocation.findById(req.params.id);

    if (!productAllocation) {
      return res.status(404).send("Product allocation not found");
    }

    // Increment the product quantities based on the allocated quantities in the allocation entry
    const productId = productAllocation.productId;
    const allocatedQuantities = productAllocation.allocatedQuantities;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Update product quantities
    product.sizes.small += allocatedQuantities.small;
    product.sizes.medium += allocatedQuantities.medium;
    product.sizes.large += allocatedQuantities.large;

    // Save the updated product
    await product.save();

    // Delete the product allocation entry
    await ProductAllocation.findByIdAndDelete(req.params.id);

    res.send(productAllocation);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
