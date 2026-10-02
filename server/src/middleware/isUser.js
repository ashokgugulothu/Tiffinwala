const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

exports.isUser = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token = req.headers.authorization.split(" ")[1];
            const decodeData = jwt.verify(token, process.env.SECRET_KEY);
            const user = await userModel.findById(decodeData.id).select('-password');
            
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            req.user = user;
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized - Token missing" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};