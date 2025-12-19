module.exports = function (req, res, next) {
    // Task 2: adminOnly middleware
    // Restricts access to routes based on the user's email address
    if (req.session.user && req.session.user.email === "admin@shop.com") {
        return next();
    }
    if (req.flash) req.flash("danger", "Admin access only!");
    res.redirect("/login");
};
