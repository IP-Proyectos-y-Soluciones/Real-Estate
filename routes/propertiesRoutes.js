import express from "express";
import { body } from "express-validator";
import {
  admin,
  create,
  save,
  addImage,
} from "../controllers/propertyController.js";

const router = express.Router();

router.get("/my-properties", admin);
router.get("/properties/create", create);
router.post("/properties/create",
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
  save
);

router.get("/properties/add-image/:id", addImage);

export default router;
