import GoogleStrategy from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Google strategy for access
const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.BACKEND_URL}:${process.env.PORT}${process.env.GOOGLE_CALLBACK}`
}, async function (accessToken, refreshToken, profile, passportNext) {
    const { name, email, sub: googleId } = profile._json;

    console.log("Profile _json:", profile._json);  
    console.log("Estratto - Email:", email);       

    try {
        if (!email) {
            console.error("Email is missing");
            return passportNext(new Error("Email is required for Google authentication"), null);
        }

        // Verifica se l'utente esiste nel DB
        let user = await User.findOne({ email });

        if (user) {
            console.log("Utente trovato:", user);
            if (!user.googleId) {
                user.googleId = googleId;
            }
            if (refreshToken) {
                user.refreshToken = refreshToken;
            }
        } else {
            // Creazione di un nuovo utente con i campi richiesti
            user = new User({
                googleId,
                name: name || "Nome Sconosciuto",
                email: email,                
                refreshToken: refreshToken || null,
            });
        }
        console.log("User object before save:", user);

        // Salva l'utente con il campo email già presente
        await user.save();

        const jwtToken = jwt.sign({ userid: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1w",
            algorithm: "HS256"
        });

        return passportNext(null, { jwtToken });
    } catch (err) {
        console.error("Google Authentication Error: ", err);
        return passportNext(err, null);
    }
});

export default googleStrategy;
