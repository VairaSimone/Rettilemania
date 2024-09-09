import RevokedToken from '../models/RevokedToken.js'; // Importa il modello dei token revocati
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(403).json({ message: "Refresh token mancante" });

    try {
        // Verifica se il refresh token è stato revocato
        const isRevoked = await RevokedToken.findOne({ token });
        if (isRevoked) return res.status(403).json({ message: "Token revocato" });

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userid);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "Token non valido" });
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Aggiorna il refresh token nel DB
        user.refreshToken = newRefreshToken;
        await user.save();

        // Aggiungi il vecchio refresh token alla lista dei token revocati
        if (!isRevoked && decoded.exp * 1000 > Date.now()) {
            const revokedToken = new RevokedToken({
                token,
                expiresAt: new Date(decoded.exp * 1000) // Scadenza del token
            });
            await revokedToken.save();

        }
        // Invia il nuovo refresh token e access token
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 giorni
        });

        return res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ message: "Token non valido o scaduto" });
    }
};
