import express from "express";
import { body } from "express-validator";
import {
  admin,
  create,
  save,
  addImage,
  storeImage,
  edit,
  saveChanges
} from "../controllers/propertyController.js";
import protectPath from "../middleware/protectPath.js";
import upload from "../middleware/uploadImage.js";

const router = express.Router();

router.get("/my-properties", protectPath, admin);

router.get("/properties/create", protectPath, create);
router.post(
  "/properties/create",
  protectPath,
  body("title").notEmpty().withMessage("El Titulo del Anuncio es Obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción no puede ir vacia")
    .isLength({ max: 200 })
    .withMessage("La Descripción es muy larga"),
  body("category").isNumeric().withMessage("Selecciona una categoría"),
  body("price").isNumeric().withMessage("Selecciona un rango de Precios"),
  body("bedrooms")
    .isNumeric()
    .withMessage("Selecciona la Cantidad de Habitaciones"),
  body("parking")
    .isNumeric()
    .withMessage("Selecciona la Cantidad de Estacionamientos"),
  body("wc").isNumeric().withMessage("Selecciona la Cantidad de Baños"),
  body("lat").notEmpty().withMessage("Ubica la Propiedad en el Mapa"),
  save,
);

router.get("/properties/add-image/:id", protectPath, addImage);
router.post(
  "/properties/add-image/:id",
  protectPath,
  upload.single("image"),
  storeImage,
);

router.get("/properties/edit/:id", protectPath, edit);
router.post(
  "/properties/edit/:id",
  protectPath,
  body("title").notEmpty().withMessage("El Titulo del Anuncio es Obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La Descripción no puede ir vacia")
    .isLength({ max: 200 })
    .withMessage("La Descripción es muy larga"),
  body("category").isNumeric().withMessage("Selecciona una categoría"),
  body("price").isNumeric().withMessage("Selecciona un rango de Precios"),
  body("bedrooms")
    .isNumeric()
    .withMessage("Selecciona la Cantidad de Habitaciones"),
  body("parking")
    .isNumeric()
    .withMessage("Selecciona la Cantidad de Estacionamientos"),
  body("wc").isNumeric().withMessage("Selecciona la Cantidad de Baños"),
  body("lat").notEmpty().withMessage("Ubica la Propiedad en el Mapa"),
  saveChanges,
);


export default router;
