const express = require("express");
const router = express.Router();
const { Admin, validate } = require("../models/admin");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, role, password } = req.body;

  // Check if admin with the same email already exists
  let existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).send("Admin already exists.");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // If not, save the new admin
  let admin = new Admin({
    name,
    email,
    role,
    password: hashedPassword,
  });

  admin = await admin.save();
  res.send(admin);
});

router.get("/", async (req, res) => {
  const admins = await Admin.find().sort("name");
  res.send(admins);
});

router.delete("/:id", async (req, res) => {
  const admin = await Admin.findByIdAndRemove(req.params.id);
  if (!admin)
    return res.status(404).send("The admin with the given ID was not found.");

  res.send(admin);
});

router.get("/email/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).send("Admin not found for the given email.");
    }
    res.send(admin);
  } catch (error) {
    console.error("Error finding admin by email:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, role, password } = req.body;

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = await Admin.findByIdAndUpdate(
    req.params.id,
    {
      name,
      email,
      role,
      password: hashedPassword,
    },
    { new: true }
  );
  if (!admin)
    return res.status(404).send("The admin with the given ID was not found.");

  res.send(admin);
});

module.exports = router;
