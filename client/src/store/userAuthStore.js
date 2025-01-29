import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"

export const userAuthStore=create((set)=>({
    authUser:null,
    isSigningIn:false,
    isLoggingIng:true,
    isUpdatingProfile:false,
    isCheckingAuth:true,

    checkAuth:async()=>{
       try{
         const response=await axiosInstance.get("/auth/check")
         console.log(response)
         set({authUser:response.data})
       }
       catch(err){
       console.log(err)
       set({authUser:null})
       }
       finally{
        set({isCheckingAuth:false})
       }
    }
}))