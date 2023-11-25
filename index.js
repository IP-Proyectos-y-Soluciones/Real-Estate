import express from "express";
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/userRoutes.js";
import propertiesRoutes from "./routes/propertiesRoutes.js";
import db from "./config/db.js";

// Crear la app
const app = express();

// Habilitar lectura de datos de formularios
app.use( express.urlencoded({ extended: true }) );

// Habilitar Cookie Parser
app.use( cookieParser() );

// Habilitar CSRF
app.use( csrf({ cookie: true }) );

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
app.use("/", propertiesRoutes);

// Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The Server is running on the port ${ port }`);
});
