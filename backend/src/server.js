import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mangaRoutes from "./routes/mangaRoutes.js"
import { connectDB } from "./config/db.js"
dotenv.config()
const app = express();
const port = process.env.PORT || 5000
app.use(cors(
    {
        origin: 'http://localhost:5173'
    }
))
app.use(express.json())
app.use("/manga", mangaRoutes)
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`http://localhost:${port}/manga`)
    })
})
