const jwt = require("jsonwebtoken");

const jwtTokenGenerator = (userId) => {

    try {
        // Generate JWT token
        const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SECRET_EXPIRES_IN });

        return token;
    }
    catch (error) {
        console.error("Error Generating Token", error);
    }

};

module.exports = jwtTokenGenerator;