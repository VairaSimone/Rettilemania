import jwt from 'jsonwebtoken';
import RevokedToken from '../models/RevokedToken.js';

export const authenticateJWT = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Access token mancante' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Controlla se il token è stato revocato
        const isRevoked = await RevokedToken.findOne({ token });
        if (isRevoked) {
            return res.status(403).json({ message: 'Token revocato' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        const status = error.name === 'TokenExpiredError' ? 401 : 403;
        return res.status(status).json({ message: error.message });
    }
};
