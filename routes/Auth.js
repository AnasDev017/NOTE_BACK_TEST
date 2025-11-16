import express from 'express'
import { isLogin, Login, Logout, Register } from '../controllers/Auth.js'
import { TokenVerfication } from '../middlewares/TokenVerfication.js'


const AuthRoutes=express.Router()
AuthRoutes.post('/register',Register)
AuthRoutes.post('/login',Login)
AuthRoutes.post('/logout',Logout)
AuthRoutes.get('/islogin',TokenVerfication,isLogin)
export default AuthRoutes