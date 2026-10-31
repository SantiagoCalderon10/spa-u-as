import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { Database } from "./config/db.js";

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/three-masters";

async function iniciarServidor() {
  try {
    const db = new Database(MONGO_URI);
    await db.connect();

    app.listen(PORT, () => {
      console.log(` Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
}

iniciarServidor();
