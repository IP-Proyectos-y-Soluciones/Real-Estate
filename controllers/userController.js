const formLogin = (req, res) => {
  res.render("auth/login", {
    pagina: 'Iniciar Sesión'
  });
};

const formRegister = (req, res) => {
  res.render("auth/register", {
    pagina: 'Crear Cuenta'
  });
};

export { formLogin, formRegister };
