const admin = (req, res) => {
  res.render("properties/admin", {
    page: "Mis Propiedades",
  });
};

export { admin };