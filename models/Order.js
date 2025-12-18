const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    // Customer Information
    customerInfo: {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        postal: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true }
    },

    // Payment Information
    paymentMethod: {
        type: String,
        required: true,
        enum: ['card', 'cod', 'wallet']
    },

    // Order Items (from cart)
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number
    }],

    // Order Totals
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 75 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },

    // Order Status
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
