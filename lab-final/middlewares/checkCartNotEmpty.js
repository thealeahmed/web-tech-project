module.exports = function (req, res, next) {
    // Task 2: checkCartNotEmpty middleware
    // Ensures that the user has items in their cart before proceeding to checkout
    let cart = req.session.cart || [];
    if (cart.length === 0) {
        if (req.flash) req.flash("danger", "Your cart is empty!");
        return res.redirect("/cart");
    }
    next();
};
