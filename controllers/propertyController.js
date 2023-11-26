import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";
import { Price, Category, Property, Message, User } from "../models/index.js";

const admin = async (req, res) => {

    res.render("properties/admin", {
      page: "Mis Propiedades",
      barra: true,
    });
};

// Formulario para crear una nueva propiedad
const create = async (req, res) => {
  // Consultar Modelo de Precio y Categorias
  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("properties/create", {
    page: "Crear Propiedad",
    csrfToken: req.csrfToken(),
    categories,
    prices,
    data: {},
    barra: true,
  });
};

const save = async (req, res) => {
  // Validación
  let result = validationResult(req);

  if (!result.isEmpty()) {
    // Consultar Modelo de Precio y Categorias
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll(),
    ]);

    return res.render("properties/create", {
      page: "Crear Propiedad",
      csrfToken: req.csrfToken(),
      categories,
      prices,
      errors: result.array(),
      data: req.body,
    });
  }

  // Crear un Registro

  const {
    title,
    description,
    bedrooms,
    parking,
    wc,
    street,
    lat,
    lng,
    price: priceId,
    category: categoryId,
  } = req.body;

  const { id: userId } = req.user;

  try {
    const savedproperty = await Property.create({
      title,
      description,
      bedrooms,
      parking,
      wc,
      street,
      lat,
      lng,
      priceId,
      categoryId,
      userId,
      image: "",
    });

    const { id } = savedproperty;

    res.redirect(`/properties/add-image/${id}`);
  } catch (error) {
    console.log(error);
  }
};

const addImage = async (req, res) => {
  const { id } = req.params;

  // Validar que la propiedad exista
  const property = await Property.findByPk(id);
  if (!property) {
    return res.redirect("/my-properties");
  }

  // Validar que la propiedad no este publicada
  if (property.published) {
    return res.redirect("/my-properties");
  }

  // Validar que la propiedad pertenece a quien visita esta página
  if (req.user.id.toString() !== property.userId.toString()) {
    return res.redirect("/my-properties");
  }

  res.render("properties/add-image", {
    pagina: `Agregar Imagen: ${property.title}`,
    csrfToken: req.csrfToken(),
    property,
  });
};

export { admin, create, save, addImage };
