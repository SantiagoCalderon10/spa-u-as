import express from "express";
import cors from "cors";
import appRouter from "./app.routes.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());


// Ruta base de healthcheck
app.get("/", (req, res) => {
  res.json({
    mensaje: "Bienvenido a la API de Three Masters Spa",
    estado: "operativo"
  });
});

// Montaje del enrutador modular bajo el prefijo /api
app.use("/api", appRouter);

// Middleware centralizado de manejo de errores
app.use(errorMiddleware)

export default app;
