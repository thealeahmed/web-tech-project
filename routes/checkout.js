const express = require('express');
const router = express.Router();
const Order = require('../models/Order');


router.get('/', (req, res) => {
    res.render('site/checkout', {
        pagetitle: 'Checkout',
        layout: false 
    });
});

// Process checkout
router.post('/', async (req, res) => {
    try {
        const cart = req.session.cart || [];

        if (cart.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const { fullName, email, phone, address, city, postal, country, payment } = req.body;

      
        if (!fullName || !email || !phone || !address || !city || !postal || !country || !payment) {
            return res.status(400).json({ error: 'All fields are required' });
        }

      
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 75;
        const tax = Math.round(subtotal * 0.05);
        const total = subtotal + shipping + tax;

        
        const order = new Order({
            customerInfo: {
                fullName,
                email,
                phone,
                address,
                city,
                postal,
                country
            },
            paymentMethod: payment,
            items: cart.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            subtotal,
            shipping,
            tax,
            total
        });

        await order.save();

        
        req.session.cart = [];

        req.session.flash = {
            type: 'success',
            message: `Order placed successfully! Order ID: ${order._id}`
        };

        res.json({
            success: true,
            orderId: order._id,
            message: 'Order placed successfully!'
        });

    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Failed to process order' });
    }
});

module.exports = router;
