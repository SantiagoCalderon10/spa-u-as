import app from "./app.js";
import { Database } from "./config/db.js";
import { config } from "./config/config.js";

async function iniciarServidor() {
  try {
    const db = new Database(config.mongoUri);
    await db.connect();

    app.listen(config.puerto, () => {
      console.log(` Servidor ejecutándose en http://localhost:${config.puerto}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
}

iniciarServidor();
