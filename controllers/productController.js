const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product'); // Correct import path without .js extension
const multer = require('multer');
const Firm = require('../models/Firm');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId = req.params.firmId;

        // Validate firmId
        if (!mongoose.Types.ObjectId.isValid(firmId)) {
            return res.status(400).json({ error: "Invalid firm ID" });
        }

        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }

        const product = new Product({
            productName,
            price,
            category,
            bestSeller,
            description,
            image,
            firm: firm._id
        });

        const savedProduct = await product.save();
        
        // Update the firm's products list
        firm.products.push(savedProduct._id);
        await firm.save();

        res.status(200).json(savedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId;

        // Validate firmId
        if (!mongoose.Types.ObjectId.isValid(firmId)) {
            return res.status(400).json({ error: "Invalid firm ID" });
        }

        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }
        const restaurantName=firm.firmName;
        const products = await Product.find({ firm: firmId });
        res.status(200).json({restaurantName,products});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const deleteProductById=async(req,res)=>{
    try{
        const productId=req.params.productId;
        const deletedProduct=await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).json({error:"no product found"});
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Internal Server error"});
    }
}

module.exports = { addProduct: [upload.single('image'), addProduct], getProductByFirm,deleteProductById };
