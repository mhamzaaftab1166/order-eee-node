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
  colors: [
    {
      name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 15,
      },
      sizes: {
        xs: {
          type: Number,
          default: 0,
        },
        s: {
          type: Number,
          default: 0,
        },
        m: {
          type: Number,
          default: 0,
        },
        l: {
          type: Number,
          default: 0,
        },
        xl: {
          type: Number,
          default: 0,
        },
      },
    },
  ],
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
    colors: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().min(1).max(15).required(),
          sizes: Joi.object({
            xs: Joi.number().min(0).default(0),
            s: Joi.number().min(0).default(0),
            m: Joi.number().min(0).default(0),
            l: Joi.number().min(0).default(0),
            xl: Joi.number().min(0).default(0),
          }).required(),
        })
      )
      .required(),
    imageUrl: Joi.array().items(Joi.string()).min(1).max(3).required(),
    description: Joi.string().max(400).required(),
  };

  return Joi.validate(product, schema);
}

module.exports = {
  Product: Product,
  validate: validateProduct,
};
