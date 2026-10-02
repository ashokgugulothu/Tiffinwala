const providerModel = require('../models/provider');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

exports.isProvider = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token = req.headers.authorization.split(" ")[1];
            const decodeData = jwt.verify(token, process.env.SECRET_KEY);
            const provider = await providerModel.findById(decodeData.id).select('-password');
            
            if (!provider) {
                return res.status(404).json({ message: "Provider not found or invalid token" });
            }

            req.provider = provider;
            next(); // Properly proceed to controller
        } else {
            return res.status(401).json({ message: "Authorization token missing or malformed" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};