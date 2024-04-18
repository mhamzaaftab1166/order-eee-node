const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 40,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Category model
    ref: "Category",
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Department model
    ref: "Department",
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  sizes: {
    type: {
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
    required: true,
  },
  color: {
    type: [String],
    required: true,
    minlength: 1,
    maxlength: 15,
  },
  imageUrl: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 1 && v.length <= 3;
      },
      message: "Image URL array must contain 1 to 3 items",
    },
  },
  description: {
    type: String,
    required: true,
    maxlength: 400,
  },
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = {
    name: Joi.string().min(3).max(40).required(),
    category: Joi.string().required(), // Since we are referencing Category model, we only need to validate the ObjectId
    department: Joi.string().required(), // Similarly, validate the ObjectId for Department
    price: Joi.number().min(0).required(),
    sizes: Joi.object({
      small: Joi.number().min(0).required(),
      medium: Joi.number().min(0).required(),
      large: Joi.number().min(0).required(),
    }).required(),
    color: Joi.array().items(Joi.string()).min(1).required(),
    imageUrl: Joi.array().items(Joi.string()).min(1).max(3).required(),
    description: Joi.string().max(400).required(),
  };

  return Joi.validate(product, schema);
}

module.exports = {
  Product: Product,
  validate: validateProduct,
};
