const jwt = require('jsonwebtoken');

function checkAdminOrEmployee(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from headers

    if (!token) {
        return res.redirect('/account/login?message=Access denied. Please log in.'); // Redirect if no token
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/account/login?message=Invalid token. Please log in.'); // Redirect on token error
        }

        const accountType = decoded.account_type; // Assuming account_type is in the token payload

        if (accountType === 'Employee' || accountType === 'Admin') {
            next(); // Allow access to the route
        } else {
            return res.redirect('/account/login?message=Access denied. Insufficient permissions.'); // Redirect on permission failure
        }
    });
}

// Export the middleware
module.exports = checkAdminOrEmployee;
