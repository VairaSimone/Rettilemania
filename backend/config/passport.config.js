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

    try {
        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                user = await user.save();
            }
        } else {
            user = new User({
                googleId,
                name,
                email,
            });
            user = await user.save();
        }

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
