const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        let token = null;

        // 1. Check Authorization Header
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        // 2. Check Cookie if no header found
        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. No token provided."
            });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Save user info
        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email
        };

        console.log("Authenticated User:", req.user);

        next();

    } catch (err) {
        console.error("JWT Error:", err.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

module.exports = authMiddleware;