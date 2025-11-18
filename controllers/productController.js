const Product = require("../models/Product");
const multer = require("multer");
const Firm = require("../models/firm");
const path = require("path")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestseller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }

    const newProduct = new Product({
      productName,
      price,
      category,
      bestseller,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await newProduct.save();

    firm.product.push(savedProduct);

    await firm.save();

    res.status(200).json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductByFirm = async(req, res)=>{
  try {
    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);

    if(!firm){
      return res.status(400).json({message:"Firm not found"});
    }

    const products = await Product.find({firm:firmId})

    res.status(200).json({products})

  } catch (error) {
    console.log(error);
    res.status(500).status({message: "Internal server error"})
  }
}

const deleteProductById = async(req,res)=>{
  try {
    const productid = req.params.productId;

    const deletedProduct = await Product.findByIdAndDelete(productid);

    if(!deletedProduct){
      return res.status(404).json({error: "No product found"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Internal server error"})
  }
}

module.exports = { addProduct: [upload.single("image"), addProduct], getProductByFirm, deleteProductById };
