import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from 'express-validator';
import RevokedToken from '../models/RevokedToken.js';

const generateAccessToken = (user) => {
    return jwt.sign({ userid: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ userid: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(401).json({ message: "Email non registrata" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).json({ message: "Password errata" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ accessToken });
    } catch (error) {
        return res.status(500).json({ message: "Errore del server" });
    }
};

export const register = [
    body('email').isEmail().withMessage('Email non valida'),
    body('password').isLength({ min: 6 }).withMessage('La password deve essere di almeno 6 caratteri'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) return res.status(409).send("Indirizzo email già utilizzato");

            const hashedPassword = await bcrypt.hash(req.body.password, 12);
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.avatar
            });

            const createdUser = await newUser.save();
            return res.status(201).json(createdUser);
        } catch (error) {
            return res.status(500).json({ message: "Errore del server" });
        }
    }
];

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userid).select('-password');
        if (!user) return res.status(404).json({ message: 'Utente non trovato' });
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: "Errore del server" });
    }
};

export const logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(400).json({ message: "Token non trovato" });

    try {
        const user = await User.findOne({ refreshToken: token });
        if (!user) return res.status(400).json({ message: "Token non valido" });

        const decoded = jwt.decode(token);
        const revokedToken = new RevokedToken({
            token,
            expiresAt: new Date(decoded.exp * 1000)
        });
        await revokedToken.save();

        user.refreshToken = null;
        await user.save();

        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
        return res.status(200).json({ message: "Logout effettuato con successo" });
    } catch (error) {
        return res.status(500).json({ message: "Errore del server" });
    }
};

export const callBackGoogle = (req, res) => {
    const token = req.user.jwtToken;
    if (!token) return res.status(401).send("Autenticazione fallita");
    
    res.redirect(`${process.env.FRONTEND_URL}/login-google-callback?token=${token}`);
};
