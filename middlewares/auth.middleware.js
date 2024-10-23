// Middleware to verify if the user is the owner, an employee, or an admin
const verifyUserOrEmployee = (req, res, next) => {
    const userId = req.headers['x-user-id'];  // Get user ID from headers
    const userRole = req.headers['x-user-role'];  // Get user role from headers

    // Checks if both user ID and role are present in the headers
    if (!userId || !userRole) {
        return res.status(403).send('Authorization headers required');
    }

    // Allow access if the user is the owner (matching ID), an employee, or an admin
    if (userId === req.params.id || userRole === 'employee' || userRole === 'admin') {
        next(); // Proceed to the next middleware or route handler
    } else {
        return res.status(403).send('Access denied: Unauthorized user');
    }
};

// Middleware to verify if the user is the owner or an admin
const verifyUserOrAdmin = (req, res, next) => {
    const userId = req.headers['x-user-id'];  // Get user ID from headers
    const userRole = req.headers['x-user-role'];  // Get user role from headers

    // Checks if both user ID and role are present in the headers
    if (!userId || !userRole) {
        return res.status(403).send('Authorization headers required');
    }

    // Allow access if the user is the owner (matching ID) or an admin
    if (userId === req.params.id || userRole === 'admin') {
        next(); // Proceed to the next middleware or route handler
    } else {
        return res.status(403).send('Access denied: Admins only');
    }
};

module.exports = {
    verifyUserOrEmployee,
    verifyUserOrAdmin
};