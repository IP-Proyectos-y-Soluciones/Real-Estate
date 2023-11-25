import express from "express";
import { formLogin, formRegistration, register, confirm, formForgetPassword } from "../controllers/userController.js";


const router = express.Router();

router.get( "/login", formLogin );

router.get( '/register', formRegistration );
router.post( '/register', register );

router.get( "/confirm/:token", confirm );

router.get("/forget-password", formForgetPassword );


export default router;