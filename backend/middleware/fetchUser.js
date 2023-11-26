// authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const authenticateUser = (req, res, next) => {
    // Extract the token from the request, for example, from the Authorization header
    const token = req.header('Cookie');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. Token not provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key
        
        // Add the user information to the request object
        req.user = decoded.id;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Unauthorized. Invalid token.' });
    }
};

export default authenticateUser;
