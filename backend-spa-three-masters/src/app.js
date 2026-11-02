import express from "express";
import cors from "cors";
import appRouter from "./app.routes.js";
import { config } from "./config/config.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";

const app = express();

// No revelar el framework en las respuestas
app.disable("x-powered-by");

// Middlewares globales
app.use(
  cors({
    origin: config.corsOrigenes,
  })
);
app.use(express.json({ limit: "20kb" }));

// Ruta base de healthcheck
app.get("/", (req, res) => {
  res.json({
    mensaje: "Bienvenido a la API de Three Masters Spa",
    estado: "operativo",
  });
});

// Montaje del enrutador modular bajo el prefijo /api
app.use("/api", appRouter);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware centralizado de manejo de errores
app.use(errorMiddleware);

export default app;
