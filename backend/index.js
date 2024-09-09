import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import authRouter from './routes/Auth.router.js';
import passport from 'passport';
import googleStrategy from './config/passport.config.js';
import 'dotenv/config';

const port = process.env.PORT
const app = express();

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(morgan("dev"))
app.use(helmet())
passport.use("google", googleStrategy)
//connessione al db
mongoose
  .connect(process.env.MONGO_STRING)
  .then(() => console.log("Database connesso"))
  .catch((err) => console.log(err))

app.use("/api/v1/", authRouter)
app.listen(port, () => {
  console.log(`Server is running on ${process.env.BACKEND_URL}`);
});
