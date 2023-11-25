import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateId, generateJWT } from '../helpers/tokens.js';
import { emailRegister, emailForgetPassword } from "../helpers/email.js";

const formLogin = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar Sesión",
    csrfToken: req.csrfToken(),
  });
};

const authenticate = async ( req, res ) => {
  // Validación
  await check("email")
    .isEmail()
    .withMessage("El Email es Obligatorio")
    .run(req);
  await check("password")
    .notEmpty()
    .withMessage("El Password es Obligatorio")
    .run(req);

  let result = validationResult(req);

  // Verificar que el resultado este vacio
  if (!result.isEmpty()) {
    // Errores
    return res.render("auth/login", {
      page: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.render("auth/login", {
      page: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El Usuario No Existe" }],
    });
  }

  // Comprobar si el usuario esta confirmado
  if (!user.confirmed) {
    return res.render("auth/login", {
      page: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "Tu Cuenta no ha sido Confirmada" }],
    });
  }

  // Revisar el password
  if (!user.verifyPassword(password)) {
    return res.render("auth/login", {
      page: "Iniciar Sesión",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El Password es Incorrecto" }],
    });
  }

  // Autenticar al usuario
  const token = generateJWT({ id: user.id, name: user.name });
  console.log(token);

  // Almacenar en un cookie
  return res.cookie("_token", token, {
      httpOnly: true,
      // secure: true,
      // sameSite: true
    }).redirect("/my-properties");
};

const logOut = (req, res) => {
  return res.clearCookie("_token").status(200).redirect("/auth/login");
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

const resetPassword = async ( req, res ) => {
  // Validación
  await check("email")
    .isEmail()
    .withMessage("Eso no parece un email")
    .run(req);

  let result = validationResult(req);

  // Verificar que el resultado este vacio
  if ( !result.isEmpty() ) {
    // Errores
    return res.render("auth/forget-password", {
      page: "Recupera tu acceso a Bienes Raices",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  // Buscar el usuario
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if ( !user ) {
    return res.render("auth/forget-password", {
      page: "Recupera tu acceso a Bienes Raices",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El Email no Pertenece a ningún usuario" }],
    });
  }

  // Generar un token y enviar el email
  user.token = generateId();
  await user.save();

  // Enviar un email
  emailForgetPassword({
    email: user.email,
    name: user.name,
    token: user.token
  })

  // Mostrar mensaje de confirmación
  res.render("templates/message", {
    page: "Reestablece tu Password",
    mensaje: "Hemos enviado un email con las instrucciones",
  });
};

const checkToken = async ( req, res ) => {
  const { token } = req.params;

  const user = await User.findOne({ where: { token } });

  if (!user) {
    return res.render("auth/confirm-account", {
      page: "Reestablece tu Password",
      mensaje: "Hubo un error al validar tu información, intenta de nuevo",
      error: true,
    });
  }

  // Mostrar formulario para modificar el password
  res.render("auth/reset-password", {
    page: "Reestablece Tu Password",
    csrfToken: req.csrfToken(),
  });
};

const newPassword = async ( req, res ) => {
  // Validar el password
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El Password debe ser de al menos 6 caracteres")
    .run(req);

  let result = validationResult(req);

  // Verificar que el resultado este vacio
  if (!result.isEmpty()) {
    // Errores
    return res.render("auth/reset-password", {
      page: "Reestablece tu Password",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  // Identificar quien hace el cambio
  const user = await User.findOne({ where: { token } });

  // Hashear el nuevo password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.token = null;

  await user.save();

  res.render("auth/confirm-account", {
    page: "Password Reestablecido",
    mensaje: "El Password se guardó correctamente",
  });
};

export { 
  authenticate,
  logOut,
  formLogin, 
  formRegistration, 
  register, 
  confirm, 
  formForgetPassword,
  resetPassword,
  checkToken,
  newPassword
};
