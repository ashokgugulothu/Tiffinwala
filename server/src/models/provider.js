const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const env = require('dotenv');
env.config();

const providerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        min: 1000000000
    },
    rating: {
        type: Number, // FIXED: Changed from String to Number for accurate calculations
        default: 0
    },
    isAuthorized: {
        type: Boolean,
        default: true
    },
    providerLogo: {
        type: String
    }
}, { timestamps: true });

providerSchema.pre("save", async function(next) {
    const provider = this;
    if (!provider.isModified("password")) {
        return next();
    }
    provider.password = await bcrypt.hash(provider.password, 10);
    next();
});

providerSchema.methods.generateJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.SECRET_KEY, { expiresIn: '5d' });
};

module.exports = mongoose.model('providers', providerSchema);