const admin = (req, res) => {
  res.render("properties/admin", {
    page: "Mis Propiedades",
    barra: true
  });
};

export { admin };