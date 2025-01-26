import express from "express"
import {logIn, logout, signUp, updateProfile,checkAuth} from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const Router =express.Router()

Router.post("/signup",signUp)

Router.post("/login",logIn)

Router.get("/logout",logout)

Router.put("/update-profile",protectRoute,updateProfile)

Router.get("/check",protectRoute,checkAuth)
export default Router