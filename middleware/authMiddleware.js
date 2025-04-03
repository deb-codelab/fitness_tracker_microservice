const jwtTokenValidator = require("../utils/jwtTokenValidator");

module.exports = (req, res, next) => {
    try {
        // Check if token is valid
        const tokenValidity = jwtTokenValidator(req);
        if (!tokenValidity) {
            res.status(401).json({ valid: false, message: "Unauthorized" });
            return false;
        }
        // If token is valid, proceed to next middleware/controller
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorised" });
        return false;
    }
};