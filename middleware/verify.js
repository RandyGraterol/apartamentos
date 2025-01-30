const adminAuthMiddleware = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin');
    }
};
module.exports=adminAuthMiddleware;