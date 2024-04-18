const mongoose = require("mongoose");

const productAllocationSchema = new mongoose.Schema({
  salesmanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salesman",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  allocatedQuantities: {
    small: {
      type: Number,
      default: 0,
    },
    medium: {
      type: Number,
      default: 0,
    },
    large: {
      type: Number,
      default: 0,
    },
  },
});

const ProductAllocation = mongoose.model(
  "ProductAllocation",
  productAllocationSchema
);

module.exports = ProductAllocation;
