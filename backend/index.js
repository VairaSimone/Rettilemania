import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRouter from './routes/Auth.router.js';
import passport from 'passport';
import googleStrategy from './config/Passport.config.js';
import userRouter from './routes/User.router.js';
import reptileRouter from './routes/Reptile.router.js';
import feedingRouter from './routes/Feeding.router.js';
import './config/FeedingJob.js';
import './config/RemoveTokenJob.js';
import notificationRouter from './routes/Notification.router.js';
import forum from './routes/Forum.router.js';

const port = process.env.PORT
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // Sostituisci con il dominio esatto del frontend
  credentials: true, // Consenti l'invio dei cookie
};

app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json())
app.use(morgan("dev"))
app.use(helmet())
passport.use("google", googleStrategy)

mongoose
  .connect(process.env.MONGO_STRING)
  .then(() => console.log("Connected database"))
  .catch((err) => console.log(err))

app.use("/api/v1/", authRouter)
app.use('/user', userRouter);
app.use('/reptile', reptileRouter);
app.use('/feedings', feedingRouter);
app.use('/notifications', notificationRouter);
app.use('/forum', forum);

app.listen(port, () => {
  console.log(`Server is running on ${process.env.BACKEND_URL}:${process.env.PORT}`);
})