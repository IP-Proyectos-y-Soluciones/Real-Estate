import express from "express";
import {
  home,
  category,
  notFound,
  searcher,
} from "../controllers/appController.js";

const router = express.Router();

// Página de Inicio
router.get("/", home);

// Categorias
router.get("/categories/:id", category);

// Página 404
router.get("/404", notFound);

// Buscador
router.post("/search", searcher);

export default router;
