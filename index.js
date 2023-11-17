import express from "express";
import userRoutes from "./routes/userRoutes.js";
import db from "./config/db.js";

// Crear la app
const app = express();

// Habilitar lectura de datos de formularios

// Habilitar Cookie Parser

// Habilitar CSRF

// Conexión a la base de datos
try {
  await db.authenticate();
  db.sync();
  console.log("Correct Connection to the Database");
} catch (error) {
  console.log(error);
}

// Habilitar Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Carpeta Pública
app.use(express.static("public"));

// Routing
app.use("/auth", userRoutes);

// Definir un puerto y arrancar el proyecto
const port = 3000;
app.listen(port, () => {
  console.log(`The Server is running on the port ${port}`);
});
