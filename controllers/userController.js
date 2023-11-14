const formLogin = (req, res) => {
  res.render("auth/login", {
    page: 'Iniciar Sesión'
  });
};

const formRegister = (req, res) => {
  res.render("auth/register", {
    page: 'Crear Cuenta'
  });
};

const formForgetPassword = (req, res) => {
  res.render("auth/forget-password", {
    page: 'Recupera tu acceso a Bienes Raices'
  });
}

export { formLogin, formRegister, formForgetPassword };
