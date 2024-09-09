import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Access token mancante' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verifica l'access token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Decodifica i dati utente
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access token scaduto' });
        } else {
            return res.status(403).json({ message: 'Token non valido' });
        }
    }
};
