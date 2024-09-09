import GoogleStrategy from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.BACKEND_URL}:${process.env.PORT}${process.env.GOOGLE_CALLBACK}`
}, async function(accessToken, refreshToken, profile, passportNext) {
    const { name, email, sub: googleId } = profile._json;

    try {
        // Cerca l'utente prima per email
        let user = await User.findOne({ email });

        if (user) {
            // Se esiste un utente con la stessa email ma senza googleId, aggiorna l'account
            if (!user.googleId) {
                user.googleId = googleId;
                user = await user.save();
            }
        } else {
            // Se non esiste l'utente, creane uno nuovo con Google ID
            user = new User({
                googleId,
                name,
                email,
            });
            user = await user.save();
        }

        // Genera il token JWT
        const jwtToken = jwt.sign({ userid: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1w"
        });

        return passportNext(null, { jwtToken });
    } catch (err) {
        return passportNext(err, null)
    }
});

export default googleStrategy;
