const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv = require("dotenv");

dotEnv.config();

const secretKey = process.env.WhatIsYourName;

const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json("Email already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });

    await newVendor.save();

    res.status(201).json({ message: "Vendor register successfully" });
    console.log("Vendor registered");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error while creating vendor", error);
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exVendor = await Vendor.findOne({ email });

    if (!exVendor) {
      return res.status(400).json({ message: "Plz register" });
    }
    const verifyPass = await bcrypt.compare(password, exVendor.password);
    if (!verifyPass) {
      return res.status(400).json({ message: "Password wrong" });
    }

    const token = jwt.sign({ vendorId: exVendor._id }, secretKey, {
      expiresIn: "1h",
    });
    const vendorId = exVendor._id
    res.status(200).json({ sucess: "Login successfull", token, vendorId });
    console.log(email, "This is token", token, vendorId);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "login failed" });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("firm");

    res.json({ vendors });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Getting failed" });
  }
};

const getVendorById = async(req, res)=>{
    const vendorId = req.params.apple;

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');

        if(!vendor){
            return res.status(500).json({message:"Vendor not found"})
        }
        const vendorFirmId = vendor.firm[0]._id
        
        res.status(200).json({vendorFirmId, vendor});
        console.log("Firm id: ", vendorFirmId)

    } catch (error) {
       console.error(error);
       res.status(500).json({error: "Internal server error"}) 
    }
}

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };
