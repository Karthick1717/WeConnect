import {BrowserRouter as Router,Routes,Route, Navigate} from "react-router-dom"
import NavBar from "./components/NavBar"
import HomePage from "./components/HomePage"
import SignInPage from "./components/SignInPage"
import SignUpPage from "./components/SignUpPage"
import SettingsPage from "./components/SettingsPage"
import ProfilePage from "./components/ProfilePage"
import {userAuthStore} from "./store/userAuthStore"
import { useEffect } from "react" 
import {Loader} from "lucide-react"
function App() {
   const {checkAuth,authUser,isCheckingAuth}=userAuthStore()
   useEffect(()=>{
      checkAuth()
   },[checkAuth])
   console.log(authUser)
   if(isCheckingAuth && !authUser){
       return (
        <div className="flex items-center justify-center h-screen">
           <Loader className="size-10 animate-spin" />
        </div>
       )
   }
  return (
    <div>
      <NavBar />
      <Router>
      <Routes>
      <Route path="/" element={authUser?<HomePage />:<Navigate to="/login" />} />
      <Route path="/login" element={<SignInPage/>} />
      <Route path="/signup" element={!authUser?<SignUpPage/>:<Navigate to="/" />} />
      <Route path="/settings" element={<SettingsPage/>} />
      <Route path="/profile" element={authUser?<ProfilePage/>:<Navigate to="/login" />} />
    </Routes>
    </Router>
    </div>
  )
}

export default App