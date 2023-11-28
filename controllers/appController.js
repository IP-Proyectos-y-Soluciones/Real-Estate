import { Sequelize } from "sequelize";
import { Price, Category, Property } from "../models/index.js";

const home = async ( req, res ) => {
  const [categories, prices, casas, departamentos] = await Promise.all([
    Category.findAll({ raw: true }),
    Price.findAll({ raw: true }),
    Property.findAll({
      limit: 3,
      where: {
        categoryId: 1,
      },
      include: [
        {
          model: Price,
          as: "price",
        },
      ],
      order: [["createdAt", "DESC"]],
    }),
    Property.findAll({
      limit: 3,
      where: {
        categoryId: 2,
      },
      include: [
        {
          model: Price,
          as: "price",
        },
      ],
      order: [["createdAt", "DESC"]],
    }),
  ]);

  res.render("home", {
    page: "Inicio",
    categories,
    prices,
    casas,
    departamentos,
    csrfToken: req.csrfToken(),
  });
};

const category = async ( req, res ) => {
  const { id } = req.params;

  // Comprobar que la categoria exista
  const category = await Category.findByPk(id);
  if (!category) {
    return res.redirect("/404");
  }

  // Obtener las propiedades de la categoria
  const properties = await Property.findAll({
    where: {
      categoryId: id,
    },
    include: [{ model: Price, as: "price" }],
  });

  res.render("category", {
    page: `${category.name}s en Venta`,
    properties,
    csrfToken: req.csrfToken(),
  });
};

const notFound = async ( req, res ) => {
  res.render("404", {
    page: "No Encontrada",
    csrfToken: req.csrfToken(),
  });
};

const searcher = async ( req, res ) => {
  const { term } = req.body;

  // Validar que termino no este vacio
  if (!term.trim()) {
    return res.redirect("back");
  }

  // Consultar las propiedades
  const properties = await Property.findAll({
    where: {
      title: {
        [Sequelize.Op.like]: "%" + term + "%",
      },
    },
    include: [{ model: Price, as: "price" }],
  });

  res.render("search", {
    page: "Resultados de la Búsqueda",
    properties,
    csrfToken: req.csrfToken(),
  });
};

export { home, category, notFound, searcher }