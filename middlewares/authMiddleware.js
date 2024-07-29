const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Get token from cookie or authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Set the decoded token object to req.user
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;
