const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin access only",
    });
  }
  next();
};

module.exports = adminAuth;
