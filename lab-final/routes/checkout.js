const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const checkCartNotEmpty = require('../middlewares/checkCartNotEmpty');

// Task 1 & 2: Apply checkCartNotEmpty middleware to checkout page
router.get('/', checkCartNotEmpty, (req, res) => {
    // Task 5: Explaining one route
    // This route renders the checkout page, but only if the cart is not empty.
    res.render('site/checkout', {
        pagetitle: 'Checkout',
        layout: 'layout', // Use standard layout for consistent look
        cart: req.session.cart || []
    });
});

// Process checkout
router.post('/', checkCartNotEmpty, async (req, res) => {
    try {
        const cart = req.session.cart || [];

        // Task 4: Validate checkout form inputs (server-side)
        const { fullName, email } = req.body;
        if (!fullName || !email) {
            if (req.flash) req.flash("danger", "Name and Email are required!");
            return res.redirect("/checkout");
        }

        // Task 4: Recalculate cart total on the server
        // This prevents users from tampering with the price in the frontend.
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Task 1: On order submission, save order in MongoDB
        const order = new Order({
            customerName: fullName,
            customerEmail: email,
            items: cart.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            totalAmount: totalAmount,
            status: 'Pending'
        });

        await order.save();

        // Task 1: Clear cart session
        req.session.cart = [];

        // Task 1: Redirect to an Order Confirmation page displaying the Order ID
        res.render('site/order-confirmation', {
            orderId: order._id,
            layout: 'layout'
        });

    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).send('Failed to process order');
    }
});

module.exports = router;
