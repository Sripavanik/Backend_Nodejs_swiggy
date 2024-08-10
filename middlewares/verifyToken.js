const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.WHATISYOURNAME; // Ensure this matches the key used to sign the token

const verifyToken = async (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const vendor = await Vendor.findById(decoded.vendorId);
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        req.vendorId = vendor._id;
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ error: "Invalid token" });
    }
}

module.exports = verifyToken;
