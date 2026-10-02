const orderModel = require('../models/order');
const foodModel = require('../models/food');
const mailSender = require("../utils/mailSender");
const { paymentUsEmail } = require("../mail/templates/paymentFormRes");
const { updateOrderMail } = require("../mail/templates/updateOrderMail");

exports.addOrder = async (req, res) => {
    try {
        const user = req.user._id;
        if (!user)
            return res.status(400).json({ message: "Please Login to make orders" });
        
        const data = req.body;

        // 1. Check if food exists and has enough quantity
        const food = await foodModel.findById(data.food);
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }
        if (food.quantity < data.quantity) {
            return res.status(400).json({ message: "Requested quantity exceeds available stock" });
        }

        const obj = { user, ...data };
        const order = await orderModel.create(obj);

        // 2. Deduct inventory quantity
        const newQuantity = food.quantity - data.quantity;
        await foodModel.findByIdAndUpdate(food._id, { $set: { quantity: newQuantity } });

        try {
            await mailSender(
                data.email,
                "Order Placed Successfully",
                paymentUsEmail(data.email, data.quantity, data.totalAmount, data.paymentId, order._id)
            );
        } catch (mailError) {
            console.error("Email sending failed:", mailError.message);
        }

        return res.status(201).json({ success: true, order });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const user = req.user._id;
        const orders = await orderModel.find({ user })
            .populate('food')
            .populate({ path: 'user', select: '-password' })
            .populate({ path: 'provider', select: '-password' })
            .sort({ createdAt: -1 });

        if (!orders)
            return res.status(404).json({ message: "No orders Found" });

        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getProvidersOrders = async (req, res) => {
    try {
        const provider = req.provider._id;
        const orders = await orderModel.find({ provider })
            .populate("user food")
            .sort({ createdAt: -1 });

        if (!orders)
            return res.status(404).json({ message: "No orders Found" });

        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id)
            return res.status(404).json({ message: "Invalid Request" });

        await orderModel.findByIdAndDelete(_id);
        return res.status(200).json({ message: "Order Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const status = req.body.status;
        const id = req.body._id;
        
        if (!id) {
            return res.status(400).json({ message: "No Order Found" });
        }

        const myOrder = await orderModel.findById(id).populate("food");
        if (!myOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        // If order is cancelled, restore the inventory quantity
        if (status === "Cancelled" && myOrder.orderStatus !== "Cancelled") {
            const foodItem = await foodModel.findById(myOrder.food._id);
            if (foodItem) {
                const restoredQuantity = foodItem.quantity + myOrder.quantity;
                await foodModel.findByIdAndUpdate(foodItem._id, { $set: { quantity: restoredQuantity } });
            }
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            id, 
            { orderStatus: status }, 
            { new: true }
        ).populate("user food");

        try {
            await mailSender(
                updatedOrder.email,
                "Order Status Updated",
                updateOrderMail(updatedOrder._id, updatedOrder.email, updatedOrder.orderStatus)
            );
        } catch (error) {
            console.error("Email sending failed:", error.message);
        }

        return res.status(200).json({ updatedOrder });
    } catch (error) {
        console.error("Order status update failed:", error.message);
        return res.status(500).json({ message: error.message });
    }
};