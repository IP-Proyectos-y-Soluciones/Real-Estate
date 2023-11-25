import express from "express";
import {
  formLogin,
  formRegistration,
  register,
  confirm,
  formForgetPassword,
  resetPassword,
  checkToken,
  newPassword,
} from "../controllers/userController.js";

const router = express.Router();

// Login
router.get("/login", formLogin);

// Registro
router.get("/register", formRegistration);
router.post("/register", register);

// Confirmar Cuenta
router.get("/confirm/:token", confirm);

// Formulario Olvide mi Password
router.get("/forget-password", formForgetPassword);
router.post("/forget-password", resetPassword);

// Almacenar el nuevo Password
router.get("/forget-password/:token", checkToken);
router.post("/forget-password/:token", newPassword);

export default router;
