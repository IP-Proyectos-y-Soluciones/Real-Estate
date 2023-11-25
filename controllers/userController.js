import { check, validationResult } from "express-validator";
//import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateId } from '../helpers/tokens.js';
import { emailRegister } from "../helpers/email.js";

const formLogin = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar Sesión",
    csrfToken: req.csrfToken(),
  });
};

const formRegistration = (req, res) => {
  res.render("auth/register", {
    page: "Crear Cuenta",
    csrfToken: req.csrfToken(),
  });
};

const register = async ( req, res ) => {
  // Validación
  await check("name")
    .notEmpty()
    .withMessage("El Nombre no puede ir vacio")
    .run(req);
  await check("email").isEmail().withMessage("Eso no parece un email").run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El Password debe ser de al menos 6 caracteres")
    .run(req);
  await check("repeat_password")
    .equals(req.body.password)
    .withMessage("Los Passwords no son iguales")
    .run(req);

  let result = validationResult(req);

  // Verificar que el resultado este vacio
  if (!result.isEmpty()) {
    // Errores
    return res.render("auth/register", {
      page: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errors: result.array(),
      user: {
        name: req.body.name,
        email: req.body.mail,
      },
    });
  }

  // Extraer los datos
  const { name, email, password } = req.body;

  // Verificar que el usuario no este duplicado
  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    return res.render("auth/register", {
      page: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El Usuario ya esta Registrado" }],
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }

  // Almacenar un usuario
  const user = await User.create({
    name,
    email,
    password,
    token: generateId(),
  });

  // Envia email de confirmación
  emailRegister({
    name: user.name,
    email: user.email,
    token: user.token
  });

  // Mostrar mensaje de confirmación
  res.render("templates/message", {
    page: "Cuenta Creada Correctamente",
    mensaje: "Hemos Enviado un Email de Confirmación, presiona en el enlace",
  });
};

// Función que comprueba una cuenta
const confirm = async ( req, res ) => {
  const { token } = req.params;

  // Verificar si el token es válido
  const user = await User.findOne({ where: { token } });

  if (!user) {
    return res.render("auth/confirm-account", {
      page: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      error: true,
    });
  }

  // Confirmar la cuenta
  user.token = null;
  user.confirmed = true;
  await user.save();

  res.render("auth/confirm-account", {
    page: "Cuenta Confirmada",
    mensaje: "La cuenta se confirmó Correctamente"
  });
};

const formForgetPassword = (req, res) => {
  res.render("auth/forget-password", {
    page: "Recupera tu acceso a Bienes Raices",
    csrfToken: req.csrfToken(),
  });
};

export { formLogin, formRegistration, register, confirm, formForgetPassword };
