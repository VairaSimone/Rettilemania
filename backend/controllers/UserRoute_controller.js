import User from "../models/User.js";
import RevokedToken from "../models/RevokedToken.js";
import jwt from "jsonwebtoken";

export const GetAllUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 20;

        const user = await User.find({})
            .sort({ name: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        const totalResults = await User.countDocuments();
        const totalPages = Math.ceil(totalResults / perPage);

        res.send({
            dati: user,
            totalPages,
            totalResults,
            page,
        });
    } catch (err) {
        res.status(500).send();
    }
};


export const GetIDUser = async (req, res) => {
    try {
        const id = req.params.userId;

        const user = await User.findById(id);
        if (!user) res.status(404).send();
        else res.send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Not Found' });
    }
};

export const PutUser = async (req, res) => {
    try {
        const id = req.params.userId;
        const userData = req.body;

        const user = await User.findByIdAndUpdate(id, userData, { new: true });
        res.send(user);
    } catch (err) {
        res.status(500).send();
    }
};

export const DeleteUser = async (req, res) => {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    
            // Aggiungi l'access token corrente dell'utente alla blacklist (revocato)
            const token = req.header('Authorization')?.split(' ')[1]; // Ottieni il token dal header Authorization
            if (token) {
                const decoded = jwt.decode(token);
                if (decoded) {
                    const revokedToken = new RevokedToken({
                        token,
                        expiresAt: new Date(decoded.exp * 1000) // Scadenza del token
                    });
                    await revokedToken.save();
                }
            }
    
            // Elimina l'utente dal database
            await User.findByIdAndDelete(req.params.userId)
            return res.status(200).json({ message: "Utente eliminato con successo" });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Errore del server" });
        }
    };

