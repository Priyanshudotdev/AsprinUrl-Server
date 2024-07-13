import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
config({
    path: "./.env"
});
import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './utils/db.js';
import cors from 'cors';
import NodeCache from 'node-cache';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
export const myCache = new NodeCache();
const app = express();
const PORT = process.env.PORT || 8000;
// middlewares
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Routes
import UrlRoute from './routes/url.routes.js';
app.use("/api/v1/url", UrlRoute);
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("SERVER IS LISTENING ON PORT:", PORT);
    });
}).catch((err) => {
    console.log(err);
});
