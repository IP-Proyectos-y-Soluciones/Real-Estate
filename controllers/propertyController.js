import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";
import { Price, Category, Property, Message, User } from "../models/index.js";

const admin = async (req, res) => {
  const { id } = req.user;

  const properties = await Property.findAll({
    where: {
      userId: id,
    },
    include: [
      { model: Category, as: "category" },
      { model: Price, as: "price" },
      { model: Message, as: "messages" },
    ],
  });

  res.render("properties/admin", {
    page: "Mis Propiedades",
    properties,
    csrfToken: req.csrfToken(),
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
    page: `Agregar Imagen: ${property.title}`,
    csrfToken: req.csrfToken(),
    property,
  });
};

const storeImage = async (req, res, next) => {
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

  try {
    // console.log(req.file)

    // Almacenar la imagen y publicar propiedad
    property.image = req.file.filename;
    property.published = 1;

    await property.save();

    next();
  } catch (error) {
    console.log(error);
  }
};

const edit = async (req, res) => {
  const { id } = req.params;

  // Validar que la propiedad exista
  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/my-properties");
  }

  // Revisar que quien visita la URl, es quien creo la propiedad
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/my-properties");
  }

  // Consultar Modelo de Precio y Categorias
  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("properties/edit", {
    page: `Editar Propiedad: ${property.title}`,
    csrfToken: req.csrfToken(),
    categories,
    prices,
    data: property,
  });
};

const saveChanges = async (req, res) => {
  // Verificar la validación
  let result = validationResult(req);

  if (!result.isEmpty()) {
    // Consultar Modelo de Precio y Categorias
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll(),
    ]);

    return res.render("properties/edit", {
      page: "Editar Propiedad",
      csrfToken: req.csrfToken(),
      categories,
      prices,
      errors: result.array(),
      data: req.body,
    });
  }

  const { id } = req.params;

  // Validar que la propiedad exista
  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/my-properties");
  }

  // Revisar que quien visita la URl, es quien creo la propiedad
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/my-properties");
  }

  // Reescribir el objeto y actualizarlo
  try {
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

    property.set({
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
    });

    await property.save();

    res.redirect("/my-properties");
  } catch (error) {
    console.log(error);
  }
};

const remove = async ( req, res ) => {
  const { id } = req.params;

  // Validar que la propiedad exista
  const property = await Property.findByPk(id);
  if (!property) {
    return res.redirect("/my-properties");
  }

  // Revisar que quien visita la URl, es quien creo la propiedad
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/my-properties");
  }

  // Eliminar la imagen
  await unlink(`public/uploads/${property.image}`);
  console.log(`Se eliminó la imagen ${property.image}`);

  // Eliminar la propiedad
  await property.destroy();
  res.redirect("/my-properties");
};

export { admin, create, save, addImage, storeImage, edit, saveChanges, remove };
