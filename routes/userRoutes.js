import express from "express";
import { formLogin } from "../controllers/userController.js";
import { formRegister } from "../controllers/userController.js";

const router = express.Router();

router.get( "/login", formLogin );
router.get ( '/register', formRegister );


export default router;