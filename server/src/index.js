import express from "express"
import authRouter from "./routes/auth.router.js"
import messageRouter from "./routes/message.router.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

const app=express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())


app.use("/api/auth",authRouter)
app.use("/api/message",messageRouter)

app.listen(process.env.PORT,()=>{
    console.log("Port connected")
    connectDB()
})